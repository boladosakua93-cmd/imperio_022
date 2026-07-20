import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseConfig {
  static const String databaseName = 'imperio_022.db';
  static const int databaseVersion = 1;

  static Future<Database> initializeDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, databaseName);

    return openDatabase(
      path,
      version: databaseVersion,
      onCreate: _createDatabase,
      onUpgrade: _upgradeDatabase,
    );
  }

  static Future<void> _createDatabase(Database db, int version) async {
    // Tabela de usuários
    await db.execute('''
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee',
        is_active INTEGER DEFAULT 1,
        is_blocked INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // Tabela de clientes
    await db.execute('''
      CREATE TABLE clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // Tabela de categorias de veículos
    await db.execute('''
      CREATE TABLE vehicle_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // Tabela de serviços
    await db.execute('''
      CREATE TABLE services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        base_price REAL NOT NULL,
        duration_minutes INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // Tabela de preços por categoria
    await db.execute('''
      CREATE TABLE service_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        service_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        price REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (category_id) REFERENCES vehicle_categories(id)
      )
    ''');

    // Tabela de veículos
    await db.execute('''
      CREATE TABLE vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        client_id INTEGER NOT NULL,
        plate TEXT UNIQUE NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        color TEXT,
        category_id INTEGER NOT NULL,
        year INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (category_id) REFERENCES vehicle_categories(id)
      )
    ''');

    // Tabela de ordens de serviço
    await db.execute('''
      CREATE TABLE service_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        vehicle_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        entry_photo_path TEXT,
        exit_photo_path TEXT,
        entry_time TEXT NOT NULL,
        completion_time TEXT,
        price REAL NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (employee_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    ''');

    // Tabela de fila de atendimento
    await db.execute('''
      CREATE TABLE queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        service_order_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'waiting',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (service_order_id) REFERENCES service_orders(id)
      )
    ''');

    // Tabela de caixa
    await db.execute('''
      CREATE TABLE cash_register (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        employee_id INTEGER NOT NULL,
        opening_balance REAL NOT NULL,
        closing_balance REAL,
        total_entries REAL DEFAULT 0,
        total_withdrawals REAL DEFAULT 0,
        total_withdrawals_cash REAL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'open',
        opened_at TEXT NOT NULL,
        closed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES users(id)
      )
    ''');

    // Tabela de movimentação de caixa
    await db.execute('''
      CREATE TABLE cash_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        cash_register_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        service_order_id INTEGER,
        created_at TEXT NOT NULL,
        FOREIGN KEY (cash_register_id) REFERENCES cash_register(id),
        FOREIGN KEY (service_order_id) REFERENCES service_orders(id)
      )
    ''');

    // Tabela de comissões
    await db.execute('''
      CREATE TABLE commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        employee_id INTEGER NOT NULL,
        service_order_id INTEGER NOT NULL,
        commission_amount REAL NOT NULL,
        commission_type TEXT NOT NULL DEFAULT 'fixed',
        status TEXT NOT NULL DEFAULT 'pending',
        paid_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES users(id),
        FOREIGN KEY (service_order_id) REFERENCES service_orders(id)
      )
    ''');

    // Tabela de agendamentos
    await db.execute('''
      CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        client_id INTEGER NOT NULL,
        vehicle_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        scheduled_date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    ''');

    // Tabela de notificações
    await db.execute('''
      CREATE TABLE notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        related_entity_id INTEGER,
        related_entity_type TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    ''');

    // Tabela de configurações
    await db.execute('''
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    // Criar índices para melhor performance
    await db.execute('CREATE INDEX idx_users_email ON users(email)');
    await db.execute('CREATE INDEX idx_vehicles_plate ON vehicles(plate)');
    await db.execute('CREATE INDEX idx_service_orders_status ON service_orders(status)');
    await db.execute('CREATE INDEX idx_service_orders_employee ON service_orders(employee_id)');
    await db.execute('CREATE INDEX idx_commissions_employee ON commissions(employee_id)');
    await db.execute('CREATE INDEX idx_notifications_user ON notifications(user_id)');
  }

  static Future<void> _upgradeDatabase(Database db, int oldVersion, int newVersion) async {
    // Implementar migrações aqui conforme necessário
  }
}
