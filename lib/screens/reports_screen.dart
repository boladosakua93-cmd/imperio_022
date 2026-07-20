import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/vehicle_provider.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedPeriod = 'daily';
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();

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
                        onTap: () => setState(() => _selectedPeriod = 'daily'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Semanal',
                        isSelected: _selectedPeriod == 'weekly',
                        onTap: () => setState(() => _selectedPeriod = 'weekly'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Mensal',
                        isSelected: _selectedPeriod == 'monthly',
                        onTap: () => setState(() => _selectedPeriod = 'monthly'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _PeriodButton(
                        label: 'Customizado',
                        isSelected: _selectedPeriod == 'custom',
                        onTap: () => setState(() => _selectedPeriod = 'custom'),
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
                _BillingReportTab(period: _selectedPeriod),
                _EmployeeReportTab(period: _selectedPeriod),
                _ServiceReportTab(period: _selectedPeriod),
                _CashReportTab(period: _selectedPeriod),
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

  const _BillingReportTab({required this.period});

  @override
  Widget build(BuildContext context) {
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
                _ReportRow(label: 'Total de Serviços', value: '0'),
                _ReportRow(label: 'Faturamento Total', value: 'R\$ 0,00'),
                _ReportRow(label: 'Ticket Médio', value: 'R\$ 0,00'),
                _ReportRow(label: 'Maior Faturamento', value: 'R\$ 0,00'),
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
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Exportando PDF...')),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ExportButton(
                  label: 'Compartilhar',
                  icon: Icons.share,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Compartilhando...')),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
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
                'Nenhum dado disponível',
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
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF374151)),
            ),
            padding: const EdgeInsets.all(16),
            child: const Center(
              child: Text(
                'Nenhum dado disponível',
                style: TextStyle(color: Color(0xFF9CA3AF)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CashReportTab extends StatelessWidget {
  final String period;

  const _CashReportTab({required this.period});

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
                'Nenhum dado disponível',
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
