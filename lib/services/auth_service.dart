import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:sqflite/sqflite.dart';
import '../config/database_config.dart';
import '../models/user_model.dart';
import '../utils/app_logger.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  late Database _db;
  UserModel? _currentUser;

  factory AuthService() => _instance;
  AuthService._internal();

  Future<void> initialize() async {
    _db = await DatabaseConfig.initializeDatabase();
  }

  // ── Geração de salt aleatório ─────────────────────────────────────────────
  static String _generateSalt() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    return base64Url.encode(bytes);
  }

  // ── Hash com salt (novo padrão) ───────────────────────────────────────────
  static String _hashWithSalt(String password, String salt) {
    final salted = '$salt:$password';
    return sha256.convert(utf8.encode(salted)).toString();
  }

  // ── Hash legado sem salt (compatibilidade com usuários antigos) ───────────
  static String _hashLegacy(String password) {
    return sha256.convert(utf8.encode(password)).toString();
  }

  // ── Registrar novo usuário ────────────────────────────────────────────────
  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required String role,
  }) async {
    try {
      final existing = await _db.query(
        'users',
        where: 'email = ?',
        whereArgs: [email],
      );
      if (existing.isNotEmpty) return false;

      final salt = _generateSalt();
      final now = DateTime.now().toIso8601String();

      await _db.insert('users', {
        'uuid': _generateUUID(),
        'name': name,
        'email': email,
        'phone': phone,
        'password_hash': _hashWithSalt(password, salt),
        'salt': salt,
        'role': role,
        'is_active': 1,
        'is_blocked': 0,
        'created_at': now,
        'updated_at': now,
      });

      return true;
    } catch (e, st) {
      appLogger.e('Erro ao registrar usuário', error: e, stackTrace: st);
      return false;
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  Future<UserModel?> login({
    required String email,
    required String password,
  }) async {
    try {
      final result = await _db.query(
        'users',
        where: 'email = ?',
        whereArgs: [email],
      );
      if (result.isEmpty) return null;

      final userData = Map<String, dynamic>.from(result.first);
      if (userData['is_blocked'] == 1) return null;
      if (userData['is_active'] == 0) return null;

      // Verifica hash: com salt (novo) ou sem salt (legado)
      final salt = userData['salt'] as String?;
      final storedHash = userData['password_hash'] as String;
      final computedHash = salt != null
          ? _hashWithSalt(password, salt)
          : _hashLegacy(password);

      if (computedHash != storedHash) return null;

      // Migração: se usuário ainda usa hash legado, atualiza para hash com salt
      if (salt == null) {
        final newSalt = _generateSalt();
        await _db.update(
          'users',
          {
            'salt': newSalt,
            'password_hash': _hashWithSalt(password, newSalt),
            'updated_at': DateTime.now().toIso8601String(),
          },
          where: 'id = ?',
          whereArgs: [userData['id']],
        );
        appLogger.i('Hash de senha migrado para o padrão seguro: $email');
      }

      _currentUser = UserModel.fromMap(userData);
      return _currentUser;
    } catch (e, st) {
      appLogger.e('Erro ao fazer login', error: e, stackTrace: st);
      return null;
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  void logout() => _currentUser = null;

  UserModel? getCurrentUser() => _currentUser;
  bool isLoggedIn() => _currentUser != null;

  // ── Administração de usuários ─────────────────────────────────────────────
  Future<bool> blockUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') return false;
      await _db.update('users',
          {'is_blocked': 1, 'updated_at': DateTime.now().toIso8601String()},
          where: 'id = ?', whereArgs: [userId]);
      return true;
    } catch (e, st) {
      appLogger.e('Erro ao bloquear usuário', error: e, stackTrace: st);
      return false;
    }
  }

  Future<bool> unblockUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') return false;
      await _db.update('users',
          {'is_blocked': 0, 'updated_at': DateTime.now().toIso8601String()},
          where: 'id = ?', whereArgs: [userId]);
      return true;
    } catch (e, st) {
      appLogger.e('Erro ao desbloquear usuário', error: e, stackTrace: st);
      return false;
    }
  }

  Future<bool> deleteUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') return false;
      await _db.delete('users', where: 'id = ?', whereArgs: [userId]);
      return true;
    } catch (e, st) {
      appLogger.e('Erro ao deletar usuário', error: e, stackTrace: st);
      return false;
    }
  }

  Future<List<UserModel>> getAllUsers() async {
    try {
      if (_currentUser?.role != 'admin') return [];
      final result = await _db.query('users');
      return result.map((m) => UserModel.fromMap(Map<String, dynamic>.from(m))).toList();
    } catch (e, st) {
      appLogger.e('Erro ao listar usuários', error: e, stackTrace: st);
      return [];
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  static String _generateUUID() =>
      '${DateTime.now().millisecondsSinceEpoch}-${DateTime.now().microsecond}';
}
