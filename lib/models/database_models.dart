// Modelos de dados para o banco de dados Supabase

import 'package:uuid/uuid.dart';

// ============================================================================
// USUÁRIO
// ============================================================================
class User {
  final String id;
  final String email;
  final String? name;
  final String role; // 'admin' ou 'employee'
  final String status; // 'active', 'inactive', 'blocked'
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastSignedIn;

  User({
    required this.id,
    required this.email,
    this.name,
    required this.role,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.lastSignedIn,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      role: json['role'] ?? 'employee',
      status: json['status'] ?? 'active',
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      lastSignedIn: json['last_signed_in'] != null ? DateTime.parse(json['last_signed_in']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'last_signed_in': lastSignedIn?.toIso8601String(),
    };
  }
}

// ============================================================================
// FUNCIONÁRIO
// ============================================================================
class Employee {
  final String id;
  final String? userId;
  final String name;
  final String? phone;
  final String? cpf;
  final String? address;
  final String? position;
  final DateTime? hireDate;
  final String status;
  final String? photoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Employee({
    required this.id,
    this.userId,
    required this.name,
    this.phone,
    this.cpf,
    this.address,
    this.position,
    this.hireDate,
    required this.status,
    this.photoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'],
      userId: json['user_id'],
      name: json['name'],
      phone: json['phone'],
      cpf: json['cpf'],
      address: json['address'],
      position: json['position'],
      hireDate: json['hire_date'] != null ? DateTime.parse(json['hire_date']) : null,
      status: json['status'] ?? 'active',
      photoUrl: json['photo_url'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'phone': phone,
      'cpf': cpf,
      'address': address,
      'position': position,
      'hire_date': hireDate?.toIso8601String().split('T')[0],
      'status': status,
      'photo_url': photoUrl,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// CLIENTE
// ============================================================================
class Client {
  final String id;
  final String name;
  final String? phone;
  final String? email;
  final int totalVisits;
  final double totalSpent;
  final DateTime? lastWash;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Client({
    required this.id,
    required this.name,
    this.phone,
    this.email,
    required this.totalVisits,
    required this.totalSpent,
    this.lastWash,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
      totalVisits: json['total_visits'] ?? 0,
      totalSpent: (json['total_spent'] ?? 0).toDouble(),
      lastWash: json['last_wash'] != null ? DateTime.parse(json['last_wash']) : null,
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'total_visits': totalVisits,
      'total_spent': totalSpent,
      'last_wash': lastWash?.toIso8601String(),
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// CATEGORIA DE VEÍCULO
// ============================================================================
class VehicleCategory {
  final String id;
  final String name;
  final String? description;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  VehicleCategory({
    required this.id,
    required this.name,
    this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory VehicleCategory.fromJson(Map<String, dynamic> json) {
    return VehicleCategory(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      status: json['status'] ?? 'active',
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// VEÍCULO
// ============================================================================
class Vehicle {
  final String id;
  final String clientId;
  final String categoryId;
  final String plate;
  final String? brand;
  final String? model;
  final String? color;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Vehicle({
    required this.id,
    required this.clientId,
    required this.categoryId,
    required this.plate,
    this.brand,
    this.model,
    this.color,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'],
      clientId: json['client_id'],
      categoryId: json['category_id'],
      plate: json['plate'],
      brand: json['brand'],
      model: json['model'],
      color: json['color'],
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'client_id': clientId,
      'category_id': categoryId,
      'plate': plate,
      'brand': brand,
      'model': model,
      'color': color,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// SERVIÇO
// ============================================================================
class Service {
  final String id;
  final String name;
  final String? description;
  final String? categoryId;
  final int? averageDuration;
  final double? fixedCommission;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Service({
    required this.id,
    required this.name,
    this.description,
    this.categoryId,
    this.averageDuration,
    this.fixedCommission,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      categoryId: json['category_id'],
      averageDuration: json['average_duration'],
      fixedCommission: json['fixed_commission'] != null ? (json['fixed_commission'] as num).toDouble() : null,
      status: json['status'] ?? 'active',
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category_id': categoryId,
      'average_duration': averageDuration,
      'fixed_commission': fixedCommission,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// ORDEM DE SERVIÇO (OS)
// ============================================================================
class ServiceOrder {
  final String id;
  final int orderNumber;
  final String vehicleId;
  final String clientId;
  final String serviceId;
  final String? employeeId;
  final double price;
  final String status;
  final String? entryPhotoUrl;
  final String? exitPhotoUrl;
  final String? notes;
  final DateTime createdAt;
  final DateTime? completedAt;
  final DateTime updatedAt;

  ServiceOrder({
    required this.id,
    required this.orderNumber,
    required this.vehicleId,
    required this.clientId,
    required this.serviceId,
    this.employeeId,
    required this.price,
    required this.status,
    this.entryPhotoUrl,
    this.exitPhotoUrl,
    this.notes,
    required this.createdAt,
    this.completedAt,
    required this.updatedAt,
  });

  factory ServiceOrder.fromJson(Map<String, dynamic> json) {
    return ServiceOrder(
      id: json['id'],
      orderNumber: json['order_number'],
      vehicleId: json['vehicle_id'],
      clientId: json['client_id'],
      serviceId: json['service_id'],
      employeeId: json['employee_id'],
      price: (json['price'] as num).toDouble(),
      status: json['status'] ?? 'pending',
      entryPhotoUrl: json['entry_photo_url'],
      exitPhotoUrl: json['exit_photo_url'],
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      completedAt: json['completed_at'] != null ? DateTime.parse(json['completed_at']) : null,
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_number': orderNumber,
      'vehicle_id': vehicleId,
      'client_id': clientId,
      'service_id': serviceId,
      'employee_id': employeeId,
      'price': price,
      'status': status,
      'entry_photo_url': entryPhotoUrl,
      'exit_photo_url': exitPhotoUrl,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'completed_at': completedAt?.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// FILA DE ATENDIMENTO
// ============================================================================
class Queue {
  final String id;
  final String serviceOrderId;
  final String status;
  final int? position;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  Queue({
    required this.id,
    required this.serviceOrderId,
    required this.status,
    this.position,
    this.startedAt,
    this.completedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Queue.fromJson(Map<String, dynamic> json) {
    return Queue(
      id: json['id'],
      serviceOrderId: json['service_order_id'],
      status: json['status'] ?? 'waiting',
      position: json['position'],
      startedAt: json['started_at'] != null ? DateTime.parse(json['started_at']) : null,
      completedAt: json['completed_at'] != null ? DateTime.parse(json['completed_at']) : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'service_order_id': serviceOrderId,
      'status': status,
      'position': position,
      'started_at': startedAt?.toIso8601String(),
      'completed_at': completedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

// ============================================================================
// COMISSÃO
// ============================================================================
class Commission {
  final String id;
  final String employeeId;
  final String serviceOrderId;
  final double amount;
  final DateTime commissionDate;
  final DateTime createdAt;

  Commission({
    required this.id,
    required this.employeeId,
    required this.serviceOrderId,
    required this.amount,
    required this.commissionDate,
    required this.createdAt,
  });

  factory Commission.fromJson(Map<String, dynamic> json) {
    return Commission(
      id: json['id'],
      employeeId: json['employee_id'],
      serviceOrderId: json['service_order_id'],
      amount: (json['amount'] as num).toDouble(),
      commissionDate: DateTime.parse(json['commission_date']),
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'service_order_id': serviceOrderId,
      'amount': amount,
      'commission_date': commissionDate.toIso8601String().split('T')[0],
      'created_at': createdAt.toIso8601String(),
    };
  }
}

// ============================================================================
// NOTIFICAÇÃO
// ============================================================================
class Notification {
  final String id;
  final String userId;
  final String title;
  final String? message;
  final String type;
  final bool read;
  final DateTime createdAt;

  Notification({
    required this.id,
    required this.userId,
    required this.title,
    this.message,
    required this.type,
    required this.read,
    required this.createdAt,
  });

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['id'],
      userId: json['user_id'],
      title: json['title'],
      message: json['message'],
      type: json['type'],
      read: json['read'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'message': message,
      'type': type,
      'read': read,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================
class Settings {
  final String id;
  final String? companyName;
  final String? phone;
  final String? whatsapp;
  final String? address;
  final String? businessHoursStart;
  final String? businessHoursEnd;
  final String? logoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Settings({
    required this.id,
    this.companyName,
    this.phone,
    this.whatsapp,
    this.address,
    this.businessHoursStart,
    this.businessHoursEnd,
    this.logoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Settings.fromJson(Map<String, dynamic> json) {
    return Settings(
      id: json['id'],
      companyName: json['company_name'],
      phone: json['phone'],
      whatsapp: json['whatsapp'],
      address: json['address'],
      businessHoursStart: json['business_hours_start'],
      businessHoursEnd: json['business_hours_end'],
      logoUrl: json['logo_url'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_name': companyName,
      'phone': phone,
      'whatsapp': whatsapp,
      'address': address,
      'business_hours_start': businessHoursStart,
      'business_hours_end': businessHoursEnd,
      'logo_url': logoUrl,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
