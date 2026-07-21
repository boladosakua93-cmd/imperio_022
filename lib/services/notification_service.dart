import '../utils/app_logger.dart';

// Serviço de notificações desabilitado temporariamente
// flutter_local_notifications foi removido para resolver conflito com Android Embedding v2
// Será reimplementado em versão futura com dependência compatível

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  bool _isInitialized = false;

  NotificationService._internal();

  factory NotificationService() {
    return _instance;
  }

  /// Inicializar serviço de notificações
  Future<void> initialize() async {
    if (_isInitialized) return;
    _isInitialized = true;
    appLogger.d('[NotificationService] Serviço de notificações inicializado (modo stub)');
  }

  /// Notificação de novo veículo na fila
  Future<void> notifyNewVehicleInQueue({
    required String licensePlate,
    required String clientName,
  }) async {
    appLogger.d('[NotificationService] Novo veículo na fila: $licensePlate - $clientName');
  }

  /// Notificação de serviço concluído
  Future<void> notifyServiceCompleted({
    required String licensePlate,
    required String clientName,
    required double price,
  }) async {
    appLogger.d('[NotificationService] Serviço concluído: $licensePlate - $clientName - R\$ ${price.toStringAsFixed(2)}');
  }

  /// Notificação de agendamento próximo
  Future<void> notifyUpcomingSchedule({
    required String clientName,
    required String scheduledTime,
  }) async {
    appLogger.d('[NotificationService] Agendamento próximo: $clientName - $scheduledTime');
  }

  /// Notificação de caixa aberto
  Future<void> notifyCashRegisterOpened({
    required double openingBalance,
  }) async {
    appLogger.d('[NotificationService] Caixa aberto: R\$ ${openingBalance.toStringAsFixed(2)}');
  }

  /// Notificação de caixa fechado
  Future<void> notifyCashRegisterClosed({
    required double closingBalance,
  }) async {
    appLogger.d('[NotificationService] Caixa fechado: R\$ ${closingBalance.toStringAsFixed(2)}');
  }

  /// Notificação de alerta (erro, aviso)
  Future<void> notifyAlert({
    required String title,
    required String message,
  }) async {
    appLogger.d('[NotificationService] Alerta: $title - $message');
  }

  /// Cancelar notificação
  Future<void> cancelNotification(int id) async {
    appLogger.d('[NotificationService] Notificação $id cancelada');
  }

  /// Cancelar todas as notificações
  Future<void> cancelAllNotifications() async {
    appLogger.d('[NotificationService] Todas as notificações foram canceladas');
  }
}
