import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/vehicle_provider.dart';

class EmployeeDashboardScreen extends StatefulWidget {
  const EmployeeDashboardScreen({Key? key}) : super(key: key);

  @override
  State<EmployeeDashboardScreen> createState() =>
      _EmployeeDashboardScreenState();
}

class _EmployeeDashboardScreenState extends State<EmployeeDashboardScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      context.read<VehicleProvider>().refreshDashboardStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        elevation: 0,
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Saudação
            Consumer<AuthProvider>(
              builder: (context, authProvider, _) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Olá, ${authProvider.currentUser?.name ?? 'Funcionário'}! 👋',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Bem-vindo ao Império 022',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[400],
                      ),
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 24),
            // Estatísticas
            Consumer<VehicleProvider>(
              builder: (context, vehicleProvider, _) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Estatísticas do Dia',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Grid de estatísticas
                    GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      children: [
                        _StatCard(
                          title: 'Aguardando',
                          value: '${vehicleProvider.pendingCount}',
                          icon: Icons.schedule,
                          color: const Color(0xFFF59E0B),
                        ),
                        _StatCard(
                          title: 'Em Andamento',
                          value: '${vehicleProvider.inProgressCount}',
                          icon: Icons.directions_car,
                          color: const Color(0xFF3B82F6),
                        ),
                        _StatCard(
                          title: 'Concluídos',
                          value: '${vehicleProvider.completedCount}',
                          icon: Icons.check_circle,
                          color: const Color(0xFF10B981),
                        ),
                        _StatCard(
                          title: 'Faturamento',
                          value: 'R\$ ${vehicleProvider.totalRevenue.toStringAsFixed(2)}',
                          icon: Icons.attach_money,
                          color: const Color(0xFFDC2626),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 24),
            // Menu de Ações Rápidas
            const Text(
              'Ações Rápidas',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            Column(
              children: [
                _ActionButton(
                  label: 'Fila de Atendimento',
                  icon: Icons.list,
                  onTap: () => Navigator.pushNamed(context, '/queue'),
                ),
                const SizedBox(height: 12),
                _ActionButton(
                  label: 'Novo Veículo',
                  icon: Icons.add_circle,
                  onTap: () => Navigator.pushNamed(context, '/add-vehicle'),
                ),
                const SizedBox(height: 12),
                _ActionButton(
                  label: 'Meus Dados',
                  icon: Icons.person,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Perfil - Em desenvolvimento')),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Últimos Serviços
            Consumer<VehicleProvider>(
              builder: (context, vehicleProvider, _) {
                final recentOrders = vehicleProvider.allServiceOrders.take(3).toList();
                
                if (recentOrders.isEmpty) {
                  return Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1F2937),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF374151)),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: const Center(
                      child: Text(
                        'Nenhum serviço realizado ainda',
                        style: TextStyle(color: Color(0xFF9CA3AF)),
                      ),
                    ),
                  );
                }

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Últimos Serviços',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...recentOrders.map((order) {
                      return Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF1F2937),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF374151)),
                        ),
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'OS #${order.orderNumber}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'R\$ ${order.price.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      color: Color(0xFFDC2626),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(order.status),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                _getStatusLabel(order.status),
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return const Color(0xFFF59E0B);
      case 'in_progress':
        return const Color(0xFF3B82F6);
      case 'completed':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFF6B7280);
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'pending':
        return 'Aguardando';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF374151)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF9CA3AF),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF374151)),
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFDC2626), size: 28),
            const SizedBox(width: 16),
            Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const Spacer(),
            const Icon(
              Icons.arrow_forward_ios,
              color: Color(0xFF6B7280),
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
