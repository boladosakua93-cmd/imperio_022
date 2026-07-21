import 'package:flutter/material.dart';
import '../models/vehicle_models.dart';
import '../services/vehicle_service.dart';

class VehicleProvider extends ChangeNotifier {
  final VehicleService _vehicleService = VehicleService();

  List<ClientModel> _clients = [];
  List<VehicleCategoryModel> _categories = [];
  List<ServiceModel> _services = [];
  List<VehicleModel> _vehicles = [];
  List<ServiceOrderModel> _serviceOrders = [];
  Map<String, dynamic> _dashboardStats = {};

  bool _isLoading = false;
  String? _error;

  // Getters
  List<ClientModel> get clients => _clients;
  List<VehicleCategoryModel> get categories => _categories;
  List<ServiceModel> get services => _services;
  List<VehicleModel> get vehicles => _vehicles;
  List<ServiceOrderModel> get serviceOrders => _serviceOrders;
  Map<String, dynamic> get dashboardStats => _dashboardStats;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Getters para dashboard
  int get pendingCount => _dashboardStats['pending'] ?? 0;
  int get inProgressCount => _dashboardStats['in_progress'] ?? 0;
  int get completedCount => _dashboardStats['completed'] ?? 0;
  double get totalRevenue => (_dashboardStats['total_revenue'] ?? 0.0).toDouble();
  List<ServiceOrderModel> get allServiceOrders => _serviceOrders;

  // Inicializar
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _vehicleService.initialize();
      await loadAllData();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao inicializar: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadAllData() async {
    try {
      _clients = await _vehicleService.getAllClients();
      _categories = await _vehicleService.getAllVehicleCategories();
      _services = await _vehicleService.getAllServices();
      _vehicles = await _vehicleService.getAllVehicles();
      _serviceOrders = await _vehicleService.getAllServiceOrders();
      _dashboardStats = await _vehicleService.getDashboardStats();
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao carregar dados: $e';
      notifyListeners();
    }
  }

  // ============ CLIENTES ============
  Future<bool> createClient(ClientModel client) async {
    try {
      await _vehicleService.createClient(client);
      _clients.add(client);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao criar cliente: $e';
      notifyListeners();
      return false;
    }
  }

  Future<ClientModel?> getClientByPhone(String phone) async {
    try {
      return await _vehicleService.getClientByPhone(phone);
    } catch (e) {
      _error = 'Erro ao buscar cliente: $e';
      notifyListeners();
      return null;
    }
  }

  // ============ CATEGORIAS ============
  Future<bool> createVehicleCategory(VehicleCategoryModel category) async {
    try {
      await _vehicleService.createVehicleCategory(category);
      _categories.add(category);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao criar categoria: $e';
      notifyListeners();
      return false;
    }
  }

  // ============ SERVIÇOS ============
  Future<bool> createService(ServiceModel service) async {
    try {
      await _vehicleService.createService(service);
      _services.add(service);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao criar serviço: $e';
      notifyListeners();
      return false;
    }
  }

  // ============ VEÍCULOS ============
  Future<bool> createVehicle(VehicleModel vehicle) async {
    try {
      await _vehicleService.createVehicle(vehicle);
      _vehicles.add(vehicle);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao criar veículo: $e';
      notifyListeners();
      return false;
    }
  }

  Future<VehicleModel?> getVehicleByPlate(String plate) async {
    try {
      return await _vehicleService.getVehicleByPlate(plate);
    } catch (e) {
      _error = 'Erro ao buscar veículo: $e';
      notifyListeners();
      return null;
    }
  }

  Future<List<VehicleModel>> getVehiclesByClientId(int clientId) async {
    try {
      return await _vehicleService.getVehiclesByClientId(clientId);
    } catch (e) {
      _error = 'Erro ao buscar veículos: $e';
      notifyListeners();
      return [];
    }
  }

  Future<VehicleModel?> getVehicleById(int id) async {
    try {
      return _vehicles.firstWhere((v) => v.id == id);
    } catch (e) {
      _error = 'Erro ao buscar veículo: $e';
      notifyListeners();
      return null;
    }
  }

  // ============ ORDENS DE SERVIÇO ============
  Future<bool> createServiceOrder(ServiceOrderModel order) async {
    try {
      await _vehicleService.createServiceOrder(order);
      _serviceOrders.add(order);
      await _vehicleService.getDashboardStats().then((stats) {
        _dashboardStats = stats;
      });
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao criar ordem de serviço: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateServiceOrder(ServiceOrderModel order) async {
    try {
      await _vehicleService.updateServiceOrder(order);
      final index = _serviceOrders.indexWhere((o) => o.id == order.id);
      if (index != -1) {
        _serviceOrders[index] = order;
      }
      await _vehicleService.getDashboardStats().then((stats) {
        _dashboardStats = stats;
      });
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Erro ao atualizar ordem de serviço: $e';
      notifyListeners();
      return false;
    }
  }

  Future<List<ServiceOrderModel>> getServiceOrdersByStatus(String status) async {
    try {
      return await _vehicleService.getServiceOrdersByStatus(status);
    } catch (e) {
      _error = 'Erro ao buscar ordens: $e';
      notifyListeners();
      return [];
    }
  }

  Future<String> generateOrderNumber() async {
    try {
      return await _vehicleService.generateOrderNumber();
    } catch (e) {
      _error = 'Erro ao gerar número de OS: $e';
      notifyListeners();
      return '';
    }
  }

  Future<void> refreshDashboardStats() async {
    try {
      _dashboardStats = await _vehicleService.getDashboardStats();
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao atualizar estatísticas: $e';
      notifyListeners();
    }
  }

  // ============ CAIXA ============
  Future<bool> openCashRegister(double openingBalance) async {
    try {
      // Implementação stub para abertura de caixa
      // Pode ser expandida para persistir em banco de dados
      return true;
    } catch (e) {
      _error = 'Erro ao abrir caixa: $e';
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
