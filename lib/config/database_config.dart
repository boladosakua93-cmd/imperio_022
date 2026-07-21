import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';
import '../utils/app_logger.dart';

class DatabaseConfig {
  static const String databaseName = 'imperio_022.db';
  // v2: adicionada coluna salt na tabela users
  static const int databaseVersion = 2;

  static Future<Database> initializeDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, databaseName);
    return openDatabase(
      path,
      version: databaseVersion,
      onCreate: (db, version) async {
        await _createDatabase(db, version);
        await _seedDatabase(db);
      },
      onUpgrade: _upgradeDatabase,
    );
  }

  static Future<void> _createDatabase(Database db, int version) async {
    await db.execute(
      'CREATE TABLE users ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'name TEXT NOT NULL,'
      'email TEXT UNIQUE NOT NULL,'
      'phone TEXT,'
      'password_hash TEXT NOT NULL,'
      'salt TEXT,'
      'role TEXT NOT NULL DEFAULT \'employee\','
      'is_active INTEGER DEFAULT 1,'
      'is_blocked INTEGER DEFAULT 0,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL'
      ')',
    );
    await db.execute(
      'CREATE TABLE clients ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'name TEXT NOT NULL,'
      'phone TEXT,'
      'email TEXT,'
      'address TEXT,'
      'city TEXT,'
      'state TEXT,'
      'zip_code TEXT,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL'
      ')',
    );
    await db.execute(
      'CREATE TABLE vehicle_categories ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'name TEXT NOT NULL,'
      'description TEXT,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL'
      ')',
    );
    await db.execute(
      'CREATE TABLE services ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'name TEXT NOT NULL,'
      'description TEXT,'
      'base_price REAL NOT NULL,'
      'duration_minutes INTEGER,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL'
      ')',
    );
    await db.execute(
      'CREATE TABLE service_prices ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'service_id INTEGER NOT NULL,'
      'category_id INTEGER NOT NULL,'
      'price REAL NOT NULL,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL,'
      'FOREIGN KEY (service_id) REFERENCES services(id),'
      'FOREIGN KEY (category_id) REFERENCES vehicle_categories(id)'
      ')',
    );
    await db.execute(
      'CREATE TABLE vehicles ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'client_id INTEGER NOT NULL,'
      'plate TEXT UNIQUE NOT NULL,'
      'brand TEXT NOT NULL,'
      'model TEXT NOT NULL,'
      'color TEXT,'
      'category_id INTEGER NOT NULL,'
      'year INTEGER,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL,'
      'FOREIGN KEY (client_id) REFERENCES clients(id),'
      'FOREIGN KEY (category_id) REFERENCES vehicle_categories(id)'
      ')',
    );
    await db.execute(
      'CREATE TABLE service_orders ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'order_number TEXT UNIQUE NOT NULL,'
      'vehicle_id INTEGER NOT NULL,'
      'client_id INTEGER NOT NULL,'
      'employee_id INTEGER NOT NULL,'
      'service_id INTEGER NOT NULL,'
      'status TEXT NOT NULL DEFAULT \'pending\','
      'entry_photo_path TEXT,'
      'exit_photo_path TEXT,'
      'entry_time TEXT NOT NULL,'
      'completion_time TEXT,'
      'price REAL NOT NULL,'
      'payment_method TEXT NOT NULL DEFAULT \'cash\','
      'notes TEXT,'
      'created_at TEXT NOT NULL,'
      'updated_at TEXT NOT NULL,'
      'FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),'
      'FOREIGN KEY (client_id) REFERENCES clients(id),'
      'FOREIGN KEY (employee_id) REFERENCES users(id),'
      'FOREIGN KEY (service_id) REFERENCES services(id)'
      ')',
    );
    await db.execute(
      'CREATE TABLE cash_entries ('
      'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      'uuid TEXT UNIQUE NOT NULL,'
      'order_id INTEGER,'
      'type TEXT NOT NULL,'
      'amount REAL NOT NULL,'
      'description TEXT,'
      'payment_method TEXT NOT NULL DEFAULT \'cash\','
      'created_by INTEGER NOT NULL,'
      'created_at TEXT NOT NULL,'
      'FOREIGN KEY (order_id) REFERENCES service_orders(id),'
      'FOREIGN KEY (created_by) REFERENCES users(id)'
      ')',
    );
  }

  // Migração v1→v2: adiciona coluna salt
  static Future<void> _upgradeDatabase(
    Database db,
    int oldVersion,
    int newVersion,
  ) async {
    if (oldVersion < 2) {
      try {
        await db.execute('ALTER TABLE users ADD COLUMN salt TEXT');
        appLogger.i('Migração v2: coluna salt adicionada');
      } catch (_) {
        appLogger.w('Migração v2: coluna salt já existe, ignorando');
      }
    }
  }

  static Future<void> _seedDatabase(Database db) async {
    await _seedUsers(db);
    await _seedCategories(db);
    await _seedServices(db);
  }

  static Future<void> _seedUsers(Database db) async {
    try {
      final adminExists = await db.query('users',
          where: 'email = ?', whereArgs: ['andrepita@imperio022.com']);
      if (adminExists.isEmpty) {
        final hash = sha256.convert(utf8.encode('Neoqeav2020!')).toString();
        await db.insert('users', {
          'uuid': 'admin-andrepita-001',
          'email': 'andrepita@imperio022.com',
          'name': 'Andrepita',
          'phone': '(11) 98888-8888',
          'password_hash': hash,
          'salt': null,
          'role': 'admin',
          'is_active': 1,
          'is_blocked': 0,
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        });
        appLogger.i('Admin (andrepita) criado');
      }

      final empExists = await db.query('users',
          where: 'email = ?', whereArgs: ['miguel@imperio022.com']);
      if (empExists.isEmpty) {
        final hash = sha256.convert(utf8.encode('miguel123')).toString();
        await db.insert('users', {
          'uuid': 'employee-miguel-001',
          'email': 'miguel@imperio022.com',
          'name': 'Miguel',
          'phone': '(11) 99999-9999',
          'password_hash': hash,
          'salt': null,
          'role': 'employee',
          'is_active': 1,
          'is_blocked': 0,
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        });
        appLogger.i('Funcionário (miguel) criado');
      }
    } catch (e, st) {
      appLogger.e('Erro no seed de usuários', error: e, stackTrace: st);
    }
  }

  static Future<void> _seedCategories(Database db) async {
    final cats = [
      {'name': 'Moto',          'description': 'Motocicletas e scooters'},
      {'name': 'Popular',       'description': 'Carros pequenos'},
      {'name': 'Médio',         'description': 'Carros médios'},
      {'name': 'SUV',           'description': 'SUVs e crossovers'},
      {'name': 'Camionete',     'description': 'Picapes e camionetes'},
      {'name': 'Van/Utilitário','description': 'Vans e utilitários'},
    ];
    for (int i = 0; i < cats.length; i++) {
      final ex = await db.query('vehicle_categories',
          where: 'name = ?', whereArgs: [cats[i]['name']]);
      if (ex.isEmpty) {
        await db.insert('vehicle_categories', {
          'uuid': 'cat-${i + 1}',
          'name': cats[i]['name'],
          'description': cats[i]['description'],
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        });
      }
    }
  }

  static Future<void> _seedServices(Database db) async {
    final svcs = [
      {'name': 'Lavagem Simples',      'price': 30.0,  'dur': 30},
      {'name': 'Lavagem Completa',     'price': 50.0,  'dur': 60},
      {'name': 'Lavagem + Cera',       'price': 80.0,  'dur': 90},
      {'name': 'Polimento',            'price': 120.0, 'dur': 120},
      {'name': 'Higienização Interna', 'price': 100.0, 'dur': 120},
      {'name': 'Lavagem a Seco',       'price': 45.0,  'dur': 45},
    ];
    for (int i = 0; i < svcs.length; i++) {
      final ex = await db.query('services',
          where: 'name = ?', whereArgs: [svcs[i]['name']]);
      if (ex.isEmpty) {
        await db.insert('services', {
          'uuid': 'svc-${i + 1}',
          'name': svcs[i]['name'],
          'description': null,
          'base_price': svcs[i]['price'],
          'duration_minutes': svcs[i]['dur'],
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        });
      }
    }
  }
}
