import 'package:logger/logger.dart';

/// Logger global do app. Use em vez de print().
///
/// Exemplos:
///   appLogger.d('mensagem de debug');
///   appLogger.i('informação');
///   appLogger.w('aviso');
///   appLogger.e('erro', error: e, stackTrace: st);
final appLogger = Logger(
  printer: PrettyPrinter(
    methodCount: 0,
    errorMethodCount: 5,
    lineLength: 80,
    colors: true,
    printEmojis: true,
    dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
  ),
  // Em release, só exibe warnings e erros
  level: const bool.fromEnvironment('dart.vm.product')
      ? Level.warning
      : Level.debug,
);
