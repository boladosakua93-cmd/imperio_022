import 'package:crypto/crypto.dart';
import 'package:sqflite/sqflite.dart';
import '../config/database_config.dart';
import '../models/user_model.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  late Database _db;
  UserModel? _currentUser;

  factory AuthService() {
    return _instance;
  }

  AuthService._internal();

  Future<void> initialize() async {
    _db = await DatabaseConfig.initializeDatabase();
  }

  // Hash de senha usando SHA256
  static String _hashPassword(String password) {
    return sha256.convert(password.codeUnits).toString();
  }

  // Registrar novo usuário
  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required String role,
  }) async {
    try {
      final existingUser = await _db.query(
        'users',
        where: 'email = ?',
        whereArgs: [email],
      );

      if (existingUser.isNotEmpty) {
        return false; // Usuário já existe
      }

      final now = DateTime.now().toIso8601String();
      final uuid = _generateUUID();

      await _db.insert('users', {
        'uuid': uuid,
        'name': name,
        'email': email,
        'phone': phone,
        'password_hash': _hashPassword(password),
        'role': role,
        'is_active': 1,
        'is_blocked': 0,
        'created_at': now,
        'updated_at': now,
      });

      return true;
    } catch (e) {
      print('Erro ao registrar usuário: $e');
      return false;
    }
  }

  // Login
  Future<UserModel?> login({
    required String email,
    required String password,
  }) async {
    try {
      final result = await _db.query(
        'users',
        where: 'email = ? AND password_hash = ?',
        whereArgs: [email, _hashPassword(password)],
      );

      if (result.isEmpty) {
        return null; // Credenciais inválidas
      }

      final userData = result.first;

      // Verificar se o usuário está bloqueado
      if (userData['is_blocked'] == 1) {
        return null; // Usuário bloqueado
      }

      // Verificar se o usuário está ativo
      if (userData['is_active'] == 0) {
        return null; // Usuário inativo
      }

      _currentUser = UserModel.fromMap(userData as Map<String, dynamic>);
      return _currentUser;
    } catch (e) {
      print('Erro ao fazer login: $e');
      return null;
    }
  }

  // Logout
  void logout() {
    _currentUser = null;
  }

  // Obter usuário atual
  UserModel? getCurrentUser() {
    return _currentUser;
  }

  // Verificar se está logado
  bool isLoggedIn() {
    return _currentUser != null;
  }

  // Bloquear usuário (apenas admin)
  Future<bool> blockUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') {
        return false; // Apenas admin pode bloquear
      }

      await _db.update(
        'users',
        {'is_blocked': 1, 'updated_at': DateTime.now().toIso8601String()},
        where: 'id = ?',
        whereArgs: [userId],
      );

      return true;
    } catch (e) {
      print('Erro ao bloquear usuário: $e');
      return false;
    }
  }

  // Desbloquear usuário (apenas admin)
  Future<bool> unblockUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') {
        return false; // Apenas admin pode desbloquear
      }

      await _db.update(
        'users',
        {'is_blocked': 0, 'updated_at': DateTime.now().toIso8601String()},
        where: 'id = ?',
        whereArgs: [userId],
      );

      return true;
    } catch (e) {
      print('Erro ao desbloquear usuário: $e');
      return false;
    }
  }

  // Deletar usuário (apenas admin)
  Future<bool> deleteUser(int userId) async {
    try {
      if (_currentUser?.role != 'admin') {
        return false; // Apenas admin pode deletar
      }

      await _db.delete(
        'users',
        where: 'id = ?',
        whereArgs: [userId],
      );

      return true;
    } catch (e) {
      print('Erro ao deletar usuário: $e');
      return false;
    }
  }

  // Listar todos os usuários (apenas admin)
  Future<List<UserModel>> getAllUsers() async {
    try {
      if (_currentUser?.role != 'admin') {
        return []; // Apenas admin pode listar
      }

      final result = await _db.query('users');
      return result.map((map) => UserModel.fromMap(map as Map<String, dynamic>)).toList();
    } catch (e) {
      print('Erro ao listar usuários: $e');
      return [];
    }
  }

  // Gerar UUID simples
  static String _generateUUID() {
    return '${DateTime.now().millisecondsSinceEpoch}-${(DateTime.now().microsecond).toString()}';
  }
}
