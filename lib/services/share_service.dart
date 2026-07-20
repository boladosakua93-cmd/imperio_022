import 'package:url_launcher/url_launcher.dart';
import 'dart:io';

class ShareService {
  static final ShareService _instance = ShareService._internal();

  ShareService._internal();

  factory ShareService() {
    return _instance;
  }

  /// Compartilhar via WhatsApp
  Future<bool> shareViaWhatsApp({
    required String phoneNumber,
    required String message,
  }) async {
    try {
      // Remover caracteres especiais do número
      final cleanPhone = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');
      
      // Adicionar código do país se não tiver (Brasil: 55)
      final fullPhone = cleanPhone.startsWith('55') ? cleanPhone : '55$cleanPhone';

      final String url = 'https://wa.me/$fullPhone?text=${Uri.encodeComponent(message)}';

      if (await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(
          Uri.parse(url),
          mode: LaunchMode.externalApplication,
        );
        print('[ShareService] Compartilhado via WhatsApp');
        return true;
      } else {
        print('[ShareService] WhatsApp não está instalado');
        return false;
      }
    } catch (e) {
      print('[ShareService] Erro ao compartilhar via WhatsApp: $e');
      return false;
    }
  }

  /// Compartilhar via SMS
  Future<bool> shareViaSMS({
    required String phoneNumber,
    required String message,
  }) async {
    try {
      final String url = 'sms:$phoneNumber?body=${Uri.encodeComponent(message)}';

      if (await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(Uri.parse(url));
        print('[ShareService] Compartilhado via SMS');
        return true;
      } else {
        print('[ShareService] SMS não disponível');
        return false;
      }
    } catch (e) {
      print('[ShareService] Erro ao compartilhar via SMS: $e');
      return false;
    }
  }

  /// Compartilhar via Email
  Future<bool> shareViaEmail({
    required String email,
    required String subject,
    required String body,
  }) async {
    try {
      final String url =
          'mailto:$email?subject=${Uri.encodeComponent(subject)}&body=${Uri.encodeComponent(body)}';

      if (await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(Uri.parse(url));
        print('[ShareService] Compartilhado via Email');
        return true;
      } else {
        print('[ShareService] Email não disponível');
        return false;
      }
    } catch (e) {
      print('[ShareService] Erro ao compartilhar via Email: $e');
      return false;
    }
  }

  /// Gerar mensagem de ordem de serviço para WhatsApp
  String generateServiceOrderMessage({
    required String orderNumber,
    required String clientName,
    required String licensePlate,
    required String vehicleInfo,
    required String serviceName,
    required double price,
  }) {
    return '''
*Ordem de Serviço #$orderNumber*

Olá $clientName! 👋

Seu veículo foi recebido no Império 022.

*Informações do Veículo:*
📋 Placa: $licensePlate
🚗 $vehicleInfo

*Serviço Solicitado:*
🛠️ $serviceName
💰 Valor: R\$ ${price.toStringAsFixed(2)}

Obrigado por escolher o Império 022!
Qualidade e confiança em cada lavagem.

*Império 022 - Gestão de Lava-Jato*
''';
  }

  /// Gerar mensagem de conclusão de serviço
  String generateServiceCompletionMessage({
    required String orderNumber,
    required String clientName,
    required String licensePlate,
    required double price,
  }) {
    return '''
*Serviço Concluído! ✅*

Olá $clientName! 

Seu veículo está pronto! 🚗

*Detalhes:*
📋 Ordem: #$orderNumber
📍 Placa: $licensePlate
💰 Valor: R\$ ${price.toStringAsFixed(2)}

Agradecemos sua confiança no Império 022!

*Volte sempre!* 🙌
''';
  }

  /// Gerar mensagem de agendamento
  String generateScheduleMessage({
    required String clientName,
    required String scheduledDate,
    required String scheduledTime,
    required String serviceName,
  }) {
    return '''
*Agendamento Confirmado! 📅*

Olá $clientName!

Seu agendamento foi confirmado:

*Data:* $scheduledDate
*Horário:* $scheduledTime
*Serviço:* $serviceName

Nos vemos em breve! 

*Império 022 - Gestão de Lava-Jato*
''';
  }

  /// Gerar relatório para compartilhamento
  String generateReportMessage({
    required String reportType,
    required String period,
    required double totalAmount,
    required int totalItems,
  }) {
    return '''
*Relatório de $reportType*

Período: $period

📊 Total de Itens: $totalItems
💰 Valor Total: R\$ ${totalAmount.toStringAsFixed(2)}

Relatório gerado pelo sistema Império 022

Data: ${DateTime.now().toString().split('.')[0]}
''';
  }

  /// Abrir WhatsApp para conversa
  Future<bool> openWhatsAppChat({
    required String phoneNumber,
  }) async {
    try {
      final cleanPhone = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');
      final fullPhone = cleanPhone.startsWith('55') ? cleanPhone : '55$cleanPhone';

      final String url = 'https://wa.me/$fullPhone';

      if (await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(
          Uri.parse(url),
          mode: LaunchMode.externalApplication,
        );
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('[ShareService] Erro ao abrir WhatsApp: $e');
      return false;
    }
  }

  /// Fazer chamada telefônica
  Future<bool> makePhoneCall({
    required String phoneNumber,
  }) async {
    try {
      final String url = 'tel:$phoneNumber';

      if (await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(Uri.parse(url));
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('[ShareService] Erro ao fazer chamada: $e');
      return false;
    }
  }
}
