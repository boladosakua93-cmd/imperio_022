import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/vehicle_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/add_vehicle_screen.dart';
import 'screens/queue_screen.dart';
import 'screens/cash_register_screen.dart';
import 'screens/reports_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..initialize(),
        ),
        ChangeNotifierProvider(
          create: (_) => VehicleProvider()..initialize(),
        ),
      ],
      child: MaterialApp(
        title: 'Império 022',
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          primaryColor: const Color(0xFFDC2626),
          scaffoldBackgroundColor: const Color(0xFF0A0E27),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF1F2937),
            elevation: 0,
            centerTitle: true,
            titleTextStyle: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          textTheme: const TextTheme(
            bodyLarge: TextStyle(color: Colors.white),
            bodyMedium: TextStyle(color: Colors.white),
            titleLarge: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        home: const SplashScreen(),
        routes: {
          '/splash': (context) => const SplashScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/admin-dashboard': (context) => const AdminDashboardScreen(),
          '/employee-dashboard': (context) => const EmployeeDashboardPlaceholder(),
          '/add-vehicle': (context) => const AddVehicleScreen(),
          '/queue': (context) => const QueueScreen(),
          '/cash-register': (context) => const CashRegisterScreen(),
          '/reports': (context) => const ReportsScreen(),
        },
      ),
    );
  }
}

// Placeholders para os dashboards (serão implementados nas próximas fases)
class AdminDashboardPlaceholder extends StatelessWidget {
  const AdminDashboardPlaceholder({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Admin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: const Center(
        child: Text('Dashboard Admin - Em desenvolvimento'),
      ),
    );
  }
}

class EmployeeDashboardPlaceholder extends StatelessWidget {
  const EmployeeDashboardPlaceholder({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Funcionário'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: const Center(
        child: Text('Dashboard Funcionário - Em desenvolvimento'),
      ),
    );
  }
}






