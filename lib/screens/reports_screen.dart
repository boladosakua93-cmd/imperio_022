import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/vehicle_provider.dart';
import '../services/pdf_report_service.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedPeriod = 'monthly';
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();
  final _pdfService = PdfReportService();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _updatePeriod(String period) {
    setState(() {
      _selectedPeriod = period;
      final now = DateTime.now();
      switch (period) {
        case 'daily':
          _startDate = now;
          _endDate = now;
          break;
        case 'weekly':
          _startDate = now.subtract(const Duration(days: 7));
          _endDate = now;
          break;
        case 'monthly':
          _startDate = now.subtract(const Duration(days: 30));
          _endDate = now;
          break;
        case 'custom':
          // Manter datas customizadas
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Relatórios'),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Faturamento'),
            Tab(text: 'Funcionários'),
            Tab(text: 'Serviços'),
            Tab(text: 'Caixa'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Filtros
          Container(
            color: const Color(0xFF111827),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Período',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _PeriodButton(
                        label: 'Diário',
                        isSelected: _selectedPeriod == 'daily',
                        onTap: () => _updatePeriod('daily'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Semanal',
                        isSelected: _selectedPeriod == 'weekly',
                        onTap: () => _updatePeriod('weekly'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Mensal',
                        isSelected: _selectedPeriod == 'monthly',
                        onTap: () => _updatePeriod('monthly'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Customizado',
                        isSelected: _selectedPeriod == 'custom',
                        onTap: () => _updatePeriod('custom'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Conteúdo das abas
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _BillingReportTab(
                  period: _selectedPeriod,
                  startDate: _startDate,
                  endDate: _endDate,
                  pdfService: _pdfService,
                ),
                _EmployeeReportTab(period: _selectedPeriod),
                _ServiceReportTab(period: _selectedPeriod),
                _CashReportTab(
                  period: _selectedPeriod,
                  pdfService: _pdfService,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BillingReportTab extends StatelessWidget {
  final String period;
  final DateTime startDate;
  final DateTime endDate;
  final PdfReportService pdfService;

  const _BillingReportTab({
    required this.period,
    required this.startDate,
    required this.endDate,
    required this.pdfService,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<VehicleProvider>(
      builder: (context, vehicleProvider, _) {
        final stats = vehicleProvider.dashboardStats;
        final totalRevenue = stats['total_revenue'] ?? 0.0;
        final completedCount = stats['completed'] ?? 0;
        final avgTicket = completedCount > 0 ? totalRevenue / completedCount : 0.0;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Resumo
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF374151)),
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Resumo de Faturamento',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ReportRow(
                      label: 'Total de Serviços',
                      value: completedCount.toString(),
                    ),
                    _ReportRow(
                      label: 'Faturamento Total',
                      value: 'R\$ ${totalRevenue.toStringAsFixed(2)}',
                    ),
                    _ReportRow(
                      label: 'Ticket Médio',
                      value: 'R\$ ${avgTicket.toStringAsFixed(2)}',
                    ),
                    _ReportRow(
                      label: 'Período',
                      value: '${startDate.day}/${startDate.month} - ${endDate.day}/${endDate.month}',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Botões de ação
              Row(
                children: [
                  Expanded(
                    child: _ExportButton(
                      label: 'Exportar PDF',
                      icon: Icons.picture_as_pdf,
                      onTap: () async {
                        try {
                          await pdfService.generateBillingReport(
                            startDate: startDate,
                            endDate: endDate,
                            totalServices: completedCount,
                            totalRevenue: totalRevenue,
                            averageTicket: avgTicket,
                          );
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('PDF gerado com sucesso!'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Erro ao gerar PDF: $e'),
                                backgroundColor: const Color(0xFFDC2626),
                              ),
                            );
                          }
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ExportButton(
                      label: 'Compartilhar',
                      icon: Icons.share,
                      onTap: () async {
                        try {
                          await pdfService.generateBillingReport(
                            startDate: startDate,
                            endDate: endDate,
                            totalServices: completedCount,
                            totalRevenue: totalRevenue,
                            averageTicket: avgTicket,
                          );
                          await pdfService.sharePdf();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Compartilhando PDF...'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Erro ao compartilhar: $e'),
                                backgroundColor: const Color(0xFFDC2626),
                              ),
                            );
                          }
                        }
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _EmployeeReportTab extends StatelessWidget {
  final String period;

  const _EmployeeReportTab({required this.period});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Desempenho de Funcionários',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF374151)),
            ),
            padding: const EdgeInsets.all(16),
            child: const Center(
              child: Text(
                'Funcionalidade em desenvolvimento',
                style: TextStyle(color: Color(0xFF9CA3AF)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ServiceReportTab extends StatelessWidget {
  final String period;

  const _ServiceReportTab({required this.period});

  @override
  Widget build(BuildContext context) {
    return Consumer<VehicleProvider>(
      builder: (context, vehicleProvider, _) {
        final services = vehicleProvider.services;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Relatório de Serviços',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),
              if (services.isEmpty)
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F2937),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF374151)),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: const Center(
                    child: Text(
                      'Nenhum serviço registrado',
                      style: TextStyle(color: Color(0xFF9CA3AF)),
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: services.length,
                  itemBuilder: (context, index) {
                    final service = services[index];
                    return Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1F2937),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF374151)),
                      ),
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  service.name,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  service.description,
                                  style: const TextStyle(
                                    color: Color(0xFF9CA3AF),
                                    fontSize: 12,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          Text(
                            'R\$ ${service.basePrice.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: Color(0xFFDC2626),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
        );
      },
    );
  }
}

class _CashReportTab extends StatelessWidget {
  final String period;
  final PdfReportService pdfService;

  const _CashReportTab({
    required this.period,
    required this.pdfService,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Relatório de Caixa',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF374151)),
            ),
            padding: const EdgeInsets.all(16),
            child: const Center(
              child: Text(
                'Funcionalidade em desenvolvimento',
                style: TextStyle(color: Color(0xFF9CA3AF)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PeriodButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _PeriodButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFDC2626) : const Color(0xFF374151),
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF9CA3AF),
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }
}

class _ReportRow extends StatelessWidget {
  final String label;
  final String value;

  const _ReportRow({
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

class _ExportButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _ExportButton({
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
          color: const Color(0xFFDC2626),
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(height: 4),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
