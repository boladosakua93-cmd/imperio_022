import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  late FlutterLocalNotificationsPlugin _notificationsPlugin;
  bool _isInitialized = false;

  NotificationService._internal();

  factory NotificationService() {
    return _instance;
  }

  /// Inicializar serviço de notificações
  Future<void> initialize() async {
    if (_isInitialized) return;

    _notificationsPlugin = FlutterLocalNotificationsPlugin();

    // Configurações Android
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // Configurações iOS
    final DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
      onDidReceiveLocalNotification: _onDidReceiveLocalNotification,
    );

    final InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    _isInitialized = true;
    print('[NotificationService] Serviço de notificações inicializado');
  }

  /// Notificação de novo veículo na fila
  Future<void> notifyNewVehicleInQueue({
    required String licensePlate,
    required String clientName,
  }) async {
    await _showNotification(
      id: 1,
      title: 'Novo Veículo na Fila',
      body: '$clientName - Placa: $licensePlate',
      payload: 'vehicle_queue',
    );
  }

  /// Notificação de serviço concluído
  Future<void> notifyServiceCompleted({
    required String licensePlate,
    required String clientName,
    required double price,
  }) async {
    await _showNotification(
      id: 2,
      title: 'Serviço Concluído',
      body: '$clientName - Placa: $licensePlate - R\$ ${price.toStringAsFixed(2)}',
      payload: 'service_completed',
    );
  }

  /// Notificação de agendamento próximo
  Future<void> notifyUpcomingSchedule({
    required String clientName,
    required String scheduledTime,
  }) async {
    await _showNotification(
      id: 3,
      title: 'Agendamento Próximo',
      body: '$clientName - Horário: $scheduledTime',
      payload: 'upcoming_schedule',
    );
  }

  /// Notificação de caixa aberto
  Future<void> notifyCashRegisterOpened({
    required double openingBalance,
  }) async {
    await _showNotification(
      id: 4,
      title: 'Caixa Aberto',
      body: 'Saldo Inicial: R\$ ${openingBalance.toStringAsFixed(2)}',
      payload: 'cash_opened',
    );
  }

  /// Notificação de caixa fechado
  Future<void> notifyCashRegisterClosed({
    required double closingBalance,
  }) async {
    await _showNotification(
      id: 5,
      title: 'Caixa Fechado',
      body: 'Saldo Final: R\$ ${closingBalance.toStringAsFixed(2)}',
      payload: 'cash_closed',
    );
  }

  /// Notificação de alerta (erro, aviso)
  Future<void> notifyAlert({
    required String title,
    required String message,
  }) async {
    await _showNotification(
      id: 6,
      title: title,
      body: message,
      payload: 'alert',
    );
  }

  /// Mostrar notificação genérica
  Future<void> _showNotification({
    required int id,
    required String title,
    required String body,
    required String payload,
  }) async {
    try {
      const AndroidNotificationDetails androidDetails =
          AndroidNotificationDetails(
        'imperio_022_channel',
        'Notificações do Império 022',
        channelDescription: 'Notificações do sistema de gestão de lava-jato',
        importance: Importance.max,
        priority: Priority.high,
        showWhen: true,
      );

      const DarwinNotificationDetails iosDetails =
          DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      );

      final NotificationDetails details = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      await _notificationsPlugin.show(
        id,
        title,
        body,
        details,
        payload: payload,
      );

      print('[NotificationService] Notificação exibida: $title');
    } catch (e) {
      print('[NotificationService] Erro ao exibir notificação: $e');
    }
  }

  /// Agendar notificação para um horário específico
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
    required String payload,
  }) async {
    try {
      const AndroidNotificationDetails androidDetails =
          AndroidNotificationDetails(
        'imperio_022_channel',
        'Notificações do Império 022',
        channelDescription: 'Notificações do sistema de gestão de lava-jato',
      );

      const DarwinNotificationDetails iosDetails =
          DarwinNotificationDetails();

      final NotificationDetails details = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      await _notificationsPlugin.zonedSchedule(
        id,
        title,
        body,
        tz.TZDateTime.from(scheduledTime, tz.local),
        details,
        payload: payload,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
      );

      print('[NotificationService] Notificação agendada para: $scheduledTime');
    } catch (e) {
      print('[NotificationService] Erro ao agendar notificação: $e');
    }
  }

  /// Cancelar notificação
  Future<void> cancelNotification(int id) async {
    try {
      await _notificationsPlugin.cancel(id);
      print('[NotificationService] Notificação $id cancelada');
    } catch (e) {
      print('[NotificationService] Erro ao cancelar notificação: $e');
    }
  }

  /// Cancelar todas as notificações
  Future<void> cancelAllNotifications() async {
    try {
      await _notificationsPlugin.cancelAll();
      print('[NotificationService] Todas as notificações foram canceladas');
    } catch (e) {
      print('[NotificationService] Erro ao cancelar notificações: $e');
    }
  }

  /// Callback quando notificação é recebida em foreground (iOS)
  void _onDidReceiveLocalNotification(
    int id,
    String? title,
    String? body,
    String? payload,
  ) {
    print('[NotificationService] Notificação recebida (iOS): $title - $body');
  }

  /// Callback quando notificação é tocada
  void _onNotificationTapped(NotificationResponse response) {
    print('[NotificationService] Notificação tocada: ${response.payload}');
    // Aqui você pode navegar para uma tela específica baseado no payload
  }
}
