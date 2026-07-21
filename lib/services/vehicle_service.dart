import '../utils/app_logger.dart';
import 'package:sqflite/sqflite.dart';
import '../config/database_config.dart';
import '../models/vehicle_models.dart';

class VehicleService {
  static final VehicleService _instance = VehicleService._internal();
  late Database _db;

  factory VehicleService() {
    return _instance;
  }

  VehicleService._internal();

  Future<void> initialize() async {
    _db = await DatabaseConfig.initializeDatabase();
  }

  // ============ CLIENTES ============
  Future<int> createClient(ClientModel client) async {
    return await _db.insert('clients', client.toMap());
  }

  Future<List<ClientModel>> getAllClients() async {
    final result = await _db.query('clients');
    return result.map((map) => ClientModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<ClientModel?> getClientById(int id) async {
    final result = await _db.query(
      'clients',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (result.isEmpty) return null;
    return ClientModel.fromMap(result.first as Map<String, dynamic>);
  }

  Future<ClientModel?> getClientByPhone(String phone) async {
    final result = await _db.query(
      'clients',
      where: 'phone = ?',
      whereArgs: [phone],
    );
    if (result.isEmpty) return null;
    return ClientModel.fromMap(result.first as Map<String, dynamic>);
  }

  Future<int> updateClient(ClientModel client) async {
    return await _db.update(
      'clients',
      client.toMap(),
      where: 'id = ?',
      whereArgs: [client.id],
    );
  }

  // ============ CATEGORIAS DE VEÍCULOS ============
  Future<int> createVehicleCategory(VehicleCategoryModel category) async {
    return await _db.insert('vehicle_categories', category.toMap());
  }

  Future<List<VehicleCategoryModel>> getAllVehicleCategories() async {
    final result = await _db.query('vehicle_categories');
    return result.map((map) => VehicleCategoryModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<VehicleCategoryModel?> getVehicleCategoryById(int id) async {
    final result = await _db.query(
      'vehicle_categories',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (result.isEmpty) return null;
    return VehicleCategoryModel.fromMap(result.first as Map<String, dynamic>);
  }

  // ============ SERVIÇOS ============
  Future<int> createService(ServiceModel service) async {
    return await _db.insert('services', service.toMap());
  }

  Future<List<ServiceModel>> getAllServices() async {
    final result = await _db.query('services');
    return result.map((map) => ServiceModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<ServiceModel?> getServiceById(int id) async {
    final result = await _db.query(
      'services',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (result.isEmpty) return null;
    return ServiceModel.fromMap(result.first as Map<String, dynamic>);
  }

  // ============ VEÍCULOS ============
  Future<int> createVehicle(VehicleModel vehicle) async {
    return await _db.insert('vehicles', vehicle.toMap());
  }

  Future<List<VehicleModel>> getAllVehicles() async {
    final result = await _db.query('vehicles');
    return result.map((map) => VehicleModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<VehicleModel?> getVehicleById(int id) async {
    final result = await _db.query(
      'vehicles',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (result.isEmpty) return null;
    return VehicleModel.fromMap(result.first as Map<String, dynamic>);
  }

  Future<VehicleModel?> getVehicleByPlate(String plate) async {
    final result = await _db.query(
      'vehicles',
      where: 'plate = ?',
      whereArgs: [plate],
    );
    if (result.isEmpty) return null;
    return VehicleModel.fromMap(result.first as Map<String, dynamic>);
  }

  Future<List<VehicleModel>> getVehiclesByClientId(int clientId) async {
    final result = await _db.query(
      'vehicles',
      where: 'client_id = ?',
      whereArgs: [clientId],
    );
    return result.map((map) => VehicleModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<int> updateVehicle(VehicleModel vehicle) async {
    return await _db.update(
      'vehicles',
      vehicle.toMap(),
      where: 'id = ?',
      whereArgs: [vehicle.id],
    );
  }

  // ============ ORDENS DE SERVIÇO ============
  Future<int> createServiceOrder(ServiceOrderModel order) async {
    return await _db.insert('service_orders', order.toMap());
  }

  Future<List<ServiceOrderModel>> getAllServiceOrders() async {
    final result = await _db.query('service_orders');
    return result.map((map) => ServiceOrderModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<List<ServiceOrderModel>> getServiceOrdersByStatus(String status) async {
    final result = await _db.query(
      'service_orders',
      where: 'status = ?',
      whereArgs: [status],
    );
    return result.map((map) => ServiceOrderModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<List<ServiceOrderModel>> getServiceOrdersByEmployeeId(int employeeId) async {
    final result = await _db.query(
      'service_orders',
      where: 'employee_id = ?',
      whereArgs: [employeeId],
    );
    return result.map((map) => ServiceOrderModel.fromMap(map as Map<String, dynamic>)).toList();
  }

  Future<ServiceOrderModel?> getServiceOrderById(int id) async {
    final result = await _db.query(
      'service_orders',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (result.isEmpty) return null;
    return ServiceOrderModel.fromMap(result.first as Map<String, dynamic>);
  }

  Future<int> updateServiceOrder(ServiceOrderModel order) async {
    return await _db.update(
      'service_orders',
      order.toMap(),
      where: 'id = ?',
      whereArgs: [order.id],
    );
  }

  // Gerar número de OS único
  Future<String> generateOrderNumber() async {
    final now = DateTime.now();
    final result = await _db.rawQuery('SELECT COUNT(*) as count FROM service_orders WHERE DATE(created_at) = DATE(?)', [now.toIso8601String()]);
    final count = Sqflite.firstIntValue(result);
    final number = (count ?? 0) + 1;
    return '${now.year}${now.month.toString().padLeft(2, '0')}${now.day.toString().padLeft(2, '0')}-${number.toString().padLeft(4, '0')}';
  }

  // Obter estatísticas do dashboard
  Future<Map<String, dynamic>> getDashboardStats() async {
    final pendingCount = Sqflite.firstIntValue(
      await _db.rawQuery('SELECT COUNT(*) FROM service_orders WHERE status = ?', ['pending']),
    ) ?? 0;

    final inProgressCount = Sqflite.firstIntValue(
      await _db.rawQuery('SELECT COUNT(*) FROM service_orders WHERE status = ?', ['in_progress']),
    ) ?? 0;

    final completedCount = Sqflite.firstIntValue(
      await _db.rawQuery('SELECT COUNT(*) FROM service_orders WHERE status = ?', ['completed']),
    ) ?? 0;

    final revenueResult = await _db.rawQuery('SELECT COALESCE(SUM(price), 0) as revenue FROM service_orders WHERE status = ?', ['completed']);
    final totalRevenue = (revenueResult.isNotEmpty ? revenueResult.first['revenue'] as double? : null) ?? 0.0;

    return {
      'pending': pendingCount,
      'in_progress': inProgressCount,
      'completed': completedCount,
      'total_revenue': totalRevenue,
    };
  }
}
