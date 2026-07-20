import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _error;
  bool _isLoggedIn = false;

  // Getters
  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _isLoggedIn;
  bool get isAdmin => _currentUser?.isAdmin ?? false;
  bool get isEmployee => _currentUser?.isEmployee ?? false;

  // Inicializar o provider
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.initialize();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao inicializar autenticação: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  // Registrar novo usuário
  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required String role,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role,
      );

      if (success) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Erro ao registrar usuário. Email já existe?';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao registrar: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Login
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final user = await _authService.login(
        email: email,
        password: password,
      );

      if (user != null) {
        _currentUser = user;
        _isLoggedIn = true;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Email ou senha inválidos';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao fazer login: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Logout
  void logout() {
    _authService.logout();
    _currentUser = null;
    _isLoggedIn = false;
    _error = null;
    notifyListeners();
  }

  // Bloquear usuário
  Future<bool> blockUser(int userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.blockUser(userId);

      if (success) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Apenas admin pode bloquear usuários';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao bloquear usuário: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Desbloquear usuário
  Future<bool> unblockUser(int userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.unblockUser(userId);

      if (success) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Apenas admin pode desbloquear usuários';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao desbloquear usuário: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Deletar usuário
  Future<bool> deleteUser(int userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.deleteUser(userId);

      if (success) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Apenas admin pode deletar usuários';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao deletar usuário: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Limpar erro
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
