class ClientModel {
  final int id;
  final String uuid;
  final String name;
  final String? phone;
  final String? email;
  final String? address;
  final String? city;
  final String? state;
  final String? zipCode;
  final DateTime createdAt;
  final DateTime updatedAt;

  ClientModel({
    required this.id,
    required this.uuid,
    required this.name,
    this.phone,
    this.email,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ClientModel.fromMap(Map<String, dynamic> map) {
    return ClientModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      name: map['name'] as String,
      phone: map['phone'] as String?,
      email: map['email'] as String?,
      address: map['address'] as String?,
      city: map['city'] as String?,
      state: map['state'] as String?,
      zipCode: map['zip_code'] as String?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class VehicleCategoryModel {
  final int id;
  final String uuid;
  final String name;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;

  VehicleCategoryModel({
    required this.id,
    required this.uuid,
    required this.name,
    this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory VehicleCategoryModel.fromMap(Map<String, dynamic> map) {
    return VehicleCategoryModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      name: map['name'] as String,
      description: map['description'] as String?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'name': name,
      'description': description,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class ServiceModel {
  final int id;
  final String uuid;
  final String name;
  final String? description;
  final double basePrice;
  final int? durationMinutes;
  final DateTime createdAt;
  final DateTime updatedAt;

  ServiceModel({
    required this.id,
    required this.uuid,
    required this.name,
    this.description,
    required this.basePrice,
    this.durationMinutes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ServiceModel.fromMap(Map<String, dynamic> map) {
    return ServiceModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      name: map['name'] as String,
      description: map['description'] as String?,
      basePrice: (map['base_price'] as num).toDouble(),
      durationMinutes: map['duration_minutes'] as int?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'name': name,
      'description': description,
      'base_price': basePrice,
      'duration_minutes': durationMinutes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class VehicleModel {
  final int id;
  final String uuid;
  final int clientId;
  final String plate;
  final String brand;
  final String model;
  final String? color;
  final int categoryId;
  final int? year;
  final DateTime createdAt;
  final DateTime updatedAt;

  VehicleModel({
    required this.id,
    required this.uuid,
    required this.clientId,
    required this.plate,
    required this.brand,
    required this.model,
    this.color,
    required this.categoryId,
    this.year,
    required this.createdAt,
    required this.updatedAt,
  });

  factory VehicleModel.fromMap(Map<String, dynamic> map) {
    return VehicleModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      clientId: map['client_id'] as int,
      plate: map['plate'] as String,
      brand: map['brand'] as String,
      model: map['model'] as String,
      color: map['color'] as String?,
      categoryId: map['category_id'] as int,
      year: map['year'] as int?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'client_id': clientId,
      'plate': plate,
      'brand': brand,
      'model': model,
      'color': color,
      'category_id': categoryId,
      'year': year,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class ServiceOrderModel {
  final int id;
  final String uuid;
  final String orderNumber;
  final int vehicleId;
  final int clientId;
  final int employeeId;
  final int serviceId;
  final String status; // pending, in_progress, completed
  final String? entryPhotoPath;
  final String? exitPhotoPath;
  final DateTime entryTime;
  final DateTime? completionTime;
  final double price;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  ServiceOrderModel({
    required this.id,
    required this.uuid,
    required this.orderNumber,
    required this.vehicleId,
    required this.clientId,
    required this.employeeId,
    required this.serviceId,
    required this.status,
    this.entryPhotoPath,
    this.exitPhotoPath,
    required this.entryTime,
    this.completionTime,
    required this.price,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ServiceOrderModel.fromMap(Map<String, dynamic> map) {
    return ServiceOrderModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      orderNumber: map['order_number'] as String,
      vehicleId: map['vehicle_id'] as int,
      clientId: map['client_id'] as int,
      employeeId: map['employee_id'] as int,
      serviceId: map['service_id'] as int,
      status: map['status'] as String,
      entryPhotoPath: map['entry_photo_path'] as String?,
      exitPhotoPath: map['exit_photo_path'] as String?,
      entryTime: DateTime.parse(map['entry_time'] as String),
      completionTime: map['completion_time'] != null
          ? DateTime.parse(map['completion_time'] as String)
          : null,
      price: (map['price'] as num).toDouble(),
      notes: map['notes'] as String?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'order_number': orderNumber,
      'vehicle_id': vehicleId,
      'client_id': clientId,
      'employee_id': employeeId,
      'service_id': serviceId,
      'status': status,
      'entry_photo_path': entryPhotoPath,
      'exit_photo_path': exitPhotoPath,
      'entry_time': entryTime.toIso8601String(),
      'completion_time': completionTime?.toIso8601String(),
      'price': price,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
