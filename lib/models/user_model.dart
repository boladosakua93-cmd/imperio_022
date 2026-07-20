class UserModel {
  final int id;
  final String uuid;
  final String name;
  final String email;
  final String? phone;
  final String role; // 'admin' ou 'employee'
  final bool isActive;
  final bool isBlocked;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserModel({
    required this.id,
    required this.uuid,
    required this.name,
    required this.email,
    this.phone,
    required this.role,
    required this.isActive,
    required this.isBlocked,
    required this.createdAt,
    required this.updatedAt,
  });

  // Converter de Map para UserModel
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] as int,
      uuid: map['uuid'] as String,
      name: map['name'] as String,
      email: map['email'] as String,
      phone: map['phone'] as String?,
      role: map['role'] as String? ?? 'employee',
      isActive: (map['is_active'] as int?) == 1,
      isBlocked: (map['is_blocked'] as int?) == 1,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  // Converter de UserModel para Map
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'uuid': uuid,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'is_active': isActive ? 1 : 0,
      'is_blocked': isBlocked ? 1 : 0,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  // Verificar se é admin
  bool get isAdmin => role == 'admin';

  // Verificar se é funcionário
  bool get isEmployee => role == 'employee';

  @override
  String toString() => 'UserModel(id: $id, name: $name, email: $email, role: $role)';
}
