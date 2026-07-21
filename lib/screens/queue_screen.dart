import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/vehicle_models.dart';
import '../providers/vehicle_provider.dart';

class QueueScreen extends StatefulWidget {
  const QueueScreen({Key? key}) : super(key: key);

  @override
  State<QueueScreen> createState() => _QueueScreenState();
}

class _QueueScreenState extends State<QueueScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedStatus = 'pending';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(_onTabChanged);
    Future.microtask(() {
      context.read<VehicleProvider>().refreshDashboardStats();
    });
  }

  void _onTabChanged() {
    setState(() {
      _selectedStatus = ['pending', 'in_progress', 'completed'][_tabController.index];
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fila de Atendimento'),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Aguardando'),
            Tab(text: 'Em Andamento'),
            Tab(text: 'Concluído'),
          ],
        ),
      ),
      body: Consumer<VehicleProvider>(
        builder: (context, vehicleProvider, _) {
          return FutureBuilder<List<ServiceOrderModel>>(
            future: vehicleProvider.getServiceOrdersByStatus(_selectedStatus),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFDC2626)),
                  ),
                );
              }

              if (snapshot.hasError) {
                return Center(
                  child: Text('Erro: ${snapshot.error}'),
                );
              }

              final orders = snapshot.data ?? [];

              if (orders.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _selectedStatus == 'pending'
                            ? Icons.schedule
                            : _selectedStatus == 'in_progress'
                                ? Icons.directions_car
                                : Icons.check_circle,
                        color: const Color(0xFF6B7280),
                        size: 64,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _selectedStatus == 'pending'
                            ? 'Nenhum veículo aguardando'
                            : _selectedStatus == 'in_progress'
                                ? 'Nenhum veículo em andamento'
                                : 'Nenhum veículo concluído',
                        style: const TextStyle(
                          color: Color(0xFF9CA3AF),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return _QueueCard(
                    order: order,
                    onStatusChanged: () {
                      setState(() {});
                    },
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

class _QueueCard extends StatelessWidget {
  final ServiceOrderModel order;
  final VoidCallback onStatusChanged;

  const _QueueCard({
    required this.order,
    required this.onStatusChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF374151)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Número da OS
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'OS: ${order.orderNumber}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFDC2626),
                      ),
                    ),
                    _StatusBadge(status: order.status),
                  ],
                ),
                const SizedBox(height: 12),
                // Informações do veículo
                Row(
                  children: [
                    const Icon(Icons.directions_car, color: Color(0xFF9CA3AF), size: 20),
                    const SizedBox(width: 8),
                    FutureBuilder<VehicleModel?>(
                      future: context.read<VehicleProvider>().getVehicleById(order.vehicleId),
                      builder: (context, snapshot) {
                        final vehicle = snapshot.data;
                        return Text(
                          'Placa: ${vehicle?.plate ?? "N/A"}',
                          style: const TextStyle(color: Color(0xFF9CA3AF)),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Preço
                Row(
                  children: [
                    const Icon(Icons.attach_money, color: Color(0xFF9CA3AF), size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'R\$ ${order.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Horário de entrada
                Row(
                  children: [
                    const Icon(Icons.access_time, color: Color(0xFF9CA3AF), size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Entrada: ${_formatTime(order.entryTime)}',
                      style: const TextStyle(color: Color(0xFF9CA3AF)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Botões de ação
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: Color(0xFF374151))),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _ActionButton(
                    label: 'Fotos',
                    icon: Icons.camera_alt,
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Câmera - Em desenvolvimento')),
                      );
                    },
                  ),
                ),
                Container(
                  width: 1,
                  height: 50,
                  color: const Color(0xFF374151),
                ),
                Expanded(
                  child: _ActionButton(
                    label: 'Detalhes',
                    icon: Icons.info,
                    onTap: () {
                      _showOrderDetails(context, order);
                    },
                  ),
                ),
                Container(
                  width: 1,
                  height: 50,
                  color: const Color(0xFF374151),
                ),
                Expanded(
                  child: _ActionButton(
                    label: 'Próximo Status',
                    icon: Icons.arrow_forward,
                    onTap: () {
                      _updateOrderStatus(context, order);
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _updateOrderStatus(BuildContext context, ServiceOrderModel order) async {
    String newStatus;
    if (order.status == 'pending') {
      newStatus = 'in_progress';
    } else if (order.status == 'in_progress') {
      newStatus = 'completed';
    } else {
      return;
    }

    final vehicleProvider = context.read<VehicleProvider>();
    final updatedOrder = ServiceOrderModel(
      id: order.id,
      uuid: order.uuid,
      orderNumber: order.orderNumber,
      vehicleId: order.vehicleId,
      clientId: order.clientId,
      employeeId: order.employeeId,
      serviceId: order.serviceId,
      status: newStatus,
      entryPhotoPath: order.entryPhotoPath,
      exitPhotoPath: order.exitPhotoPath,
      entryTime: order.entryTime,
      completionTime: newStatus == 'completed' ? DateTime.now() : order.completionTime,
      price: order.price,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: DateTime.now(),
    );

    final success = await vehicleProvider.updateServiceOrder(updatedOrder);
    if (success && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Status atualizado para: $newStatus')),
      );
      onStatusChanged();
    }
  }

  void _showOrderDetails(BuildContext context, ServiceOrderModel order) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1F2937),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Detalhes da Ordem',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),
              _DetailRow(label: 'OS', value: order.orderNumber),
              _DetailRow(label: 'Status', value: order.status),
              _DetailRow(label: 'Preço', value: 'R\$ ${order.price.toStringAsFixed(2)}'),
              _DetailRow(label: 'Entrada', value: _formatDateTime(order.entryTime)),
              if (order.completionTime != null)
                _DetailRow(label: 'Conclusão', value: _formatDateTime(order.completionTime!)),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                  ),
                  child: const Text('Fechar'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${_formatTime(dateTime)}';
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    String label;
    IconData icon;

    switch (status) {
      case 'pending':
        backgroundColor = const Color(0xFFF59E0B);
        label = 'Aguardando';
        icon = Icons.schedule;
        break;
      case 'in_progress':
        backgroundColor = const Color(0xFF3B82F6);
        label = 'Em Andamento';
        icon = Icons.directions_car;
        break;
      case 'completed':
        backgroundColor = const Color(0xFF10B981);
        label = 'Concluído';
        icon = Icons.check_circle;
        break;
      default:
        backgroundColor = const Color(0xFF6B7280);
        label = 'Desconhecido';
        icon = Icons.help;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor.withOpacity(0.2),
        border: Border.all(color: backgroundColor),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: backgroundColor, size: 16),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: backgroundColor,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
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
        height: 50,
        color: Colors.transparent,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFFDC2626), size: 20),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFFDC2626),
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 14,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
