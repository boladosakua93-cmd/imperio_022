import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/vehicle_provider.dart';

class CashRegisterScreen extends StatefulWidget {
  const CashRegisterScreen({Key? key}) : super(key: key);

  @override
  State<CashRegisterScreen> createState() => _CashRegisterScreenState();
}

class _CashRegisterScreenState extends State<CashRegisterScreen> {
  final _openingBalanceController = TextEditingController();
  bool _isOpen = false;
  double _currentBalance = 0;
  double _totalEntries = 0;
  double _totalWithdrawals = 0;

  @override
  void dispose() {
    _openingBalanceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Caixa'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status do Caixa
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1F2937),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _isOpen ? const Color(0xFF10B981) : const Color(0xFFDC2626),
                  width: 2,
                ),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Status do Caixa',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: _isOpen
                              ? const Color(0xFF10B981).withOpacity(0.2)
                              : const Color(0xFFDC2626).withOpacity(0.2),
                          border: Border.all(
                            color: _isOpen ? const Color(0xFF10B981) : const Color(0xFFDC2626),
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _isOpen ? 'ABERTO' : 'FECHADO',
                          style: TextStyle(
                            color: _isOpen ? const Color(0xFF10B981) : const Color(0xFFDC2626),
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Saldo atual
                  _BalanceCard(
                    label: 'Saldo Atual',
                    value: _currentBalance,
                    color: const Color(0xFF8B5CF6),
                  ),
                  const SizedBox(height: 12),
                  // Entradas
                  _BalanceCard(
                    label: 'Total de Entradas',
                    value: _totalEntries,
                    color: const Color(0xFF10B981),
                  ),
                  const SizedBox(height: 12),
                  // Saídas
                  _BalanceCard(
                    label: 'Total de Saídas',
                    value: _totalWithdrawals,
                    color: const Color(0xFFDC2626),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Ações
            if (!_isOpen)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Abertura de Caixa',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _openingBalanceController,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: 'Saldo Inicial',
                      hintStyle: const TextStyle(color: Color(0xFF6B7280)),
                      filled: true,
                      fillColor: const Color(0xFF1F2937),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF374151)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF374151)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFDC2626)),
                      ),
                      prefixIcon: const Icon(Icons.attach_money, color: Color(0xFF6B7280)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _openCashRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Abrir Caixa',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              )
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Movimentações',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _ActionButton(
                          label: 'Entrada',
                          icon: Icons.add_circle,
                          color: const Color(0xFF10B981),
                          onTap: () => _showMovementDialog(context, 'entry'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ActionButton(
                          label: 'Saída',
                          icon: Icons.remove_circle,
                          color: const Color(0xFFDC2626),
                          onTap: () => _showMovementDialog(context, 'withdrawal'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _ActionButton(
                          label: 'Sangria',
                          icon: Icons.money_off,
                          color: const Color(0xFFF59E0B),
                          onTap: () => _showMovementDialog(context, 'withdrawal_cash'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ActionButton(
                          label: 'Fechar Caixa',
                          icon: Icons.lock,
                          color: const Color(0xFF6B7280),
                          onTap: _closeCashRegister,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Histórico de movimentações
                  const Text(
                    'Últimas Movimentações',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1F2937),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF374151)),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: const Center(
                      child: Text(
                        'Nenhuma movimentação registrada',
                        style: TextStyle(
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  void _openCashRegister() async {
    final balance = double.tryParse(_openingBalanceController.text);
    if (balance == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Insira um valor válido')),
      );
      return;
    }

    final vehicleProvider = context.read<VehicleProvider>();
    final success = await vehicleProvider.openCashRegister(balance);

    if (success && mounted) {
      setState(() {
        _isOpen = true;
        _currentBalance = balance;
        _totalEntries = 0;
        _totalWithdrawals = 0;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Caixa aberto com R\$ ${balance.toStringAsFixed(2)}')),
      );
    }
  }

  void _closeCashRegister() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1F2937),
        title: const Text(
          'Fechar Caixa',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _DetailRow(
              label: 'Saldo Inicial',
              value: 'R\$ 0,00',
            ),
            _DetailRow(
              label: 'Entradas',
              value: 'R\$ ${_totalEntries.toStringAsFixed(2)}',
            ),
            _DetailRow(
              label: 'Saídas',
              value: 'R\$ ${_totalWithdrawals.toStringAsFixed(2)}',
            ),
            const Divider(color: Color(0xFF374151)),
            _DetailRow(
              label: 'Saldo Final',
              value: 'R\$ ${_currentBalance.toStringAsFixed(2)}',
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF9CA3AF))),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _isOpen = false;
                _openingBalanceController.clear();
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Caixa fechado com sucesso')),
              );
            },
            child: const Text('Confirmar', style: TextStyle(color: Color(0xFFDC2626))),
          ),
        ],
      ),
    );
  }

  void _showMovementDialog(BuildContext context, String type) {
    final amountController = TextEditingController();
    final descriptionController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1F2937),
        title: Text(
          type == 'entry'
              ? 'Registrar Entrada'
              : type == 'withdrawal'
                  ? 'Registrar Saída'
                  : 'Registrar Sangria',
          style: const TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amountController,
              style: const TextStyle(color: Colors.white),
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                hintText: 'Valor',
                hintStyle: const TextStyle(color: Color(0xFF6B7280)),
                filled: true,
                fillColor: const Color(0xFF374151),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descriptionController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Descrição',
                hintStyle: const TextStyle(color: Color(0xFF6B7280)),
                filled: true,
                fillColor: const Color(0xFF374151),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF9CA3AF))),
          ),
          TextButton(
            onPressed: () {
              final amount = double.tryParse(amountController.text);
              if (amount == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Insira um valor válido')),
                );
                return;
              }

              setState(() {
                if (type == 'entry') {
                  _totalEntries += amount;
                  _currentBalance += amount;
                } else {
                  _totalWithdrawals += amount;
                  _currentBalance -= amount;
                }
              });

              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Movimentação registrada: R\$ ${amount.toStringAsFixed(2)}')),
              );
            },
            child: const Text('Confirmar', style: TextStyle(color: Color(0xFFDC2626))),
          ),
        ],
      ),
    );
  }
}

class _BalanceCard extends StatelessWidget {
  final String label;
  final double value;
  final Color color;

  const _BalanceCard({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(12),
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
            'R\$ ${value.toStringAsFixed(2)}',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 16,
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
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          border: Border.all(color: color, width: 2),
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: color,
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
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
