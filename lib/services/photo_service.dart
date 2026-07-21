import '../utils/app_logger.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

class PhotoService {
  static final PhotoService _instance = PhotoService._internal();
  final ImagePicker _imagePicker = ImagePicker();

  PhotoService._internal();

  factory PhotoService() {
    return _instance;
  }

  /// Capturar foto da câmera
  Future<String?> capturePhoto() async {
    try {
      final XFile? photo = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );

      if (photo != null) {
        return await _compressAndSavePhoto(File(photo.path));
      }
      return null;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao capturar foto', error: e);
      return null;
    }
  }

  /// Selecionar foto da galeria
  Future<String?> selectPhotoFromGallery() async {
    try {
      final XFile? photo = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );

      if (photo != null) {
        return await _compressAndSavePhoto(File(photo.path));
      }
      return null;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao selecionar foto', error: e);
      return null;
    }
  }

  /// Comprimir e salvar foto localmente
  Future<String> _compressAndSavePhoto(File photoFile) async {
    try {
      // Ler imagem original
      final bytes = await photoFile.readAsBytes();
      final image = img.decodeImage(bytes);

      if (image == null) {
        throw Exception('Não foi possível decodificar a imagem');
      }

      // Redimensionar se necessário (máximo 1200x1200)
      img.Image resized = image;
      if (image.width > 1200 || image.height > 1200) {
        resized = img.copyResize(
          image,
          width: 1200,
          height: 1200,
          maintainAspect: true,
        );
      }

      // Comprimir e salvar
      final compressedBytes = img.encodeJpg(resized, quality: 80);

      // Obter diretório de documentos
      final appDir = await getApplicationDocumentsDirectory();
      final photosDir = Directory(path.join(appDir.path, 'photos'));

      // Criar diretório se não existir
      if (!photosDir.existsSync()) {
        photosDir.createSync(recursive: true);
      }

      // Gerar nome único para a foto
      final fileName = 'photo_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final savedPath = path.join(photosDir.path, fileName);

      // Salvar arquivo comprimido
      final savedFile = File(savedPath);
      await savedFile.writeAsBytes(compressedBytes);

      appLogger.d('[PhotoService] Foto salva em: $savedPath');
      return savedPath;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao comprimir e salvar foto', error: e);
      rethrow;
    }
  }

  /// Obter foto por caminho
  Future<File?> getPhoto(String photoPath) async {
    try {
      final file = File(photoPath);
      if (await file.exists()) {
        return file;
      }
      return null;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao obter foto', error: e);
      return null;
    }
  }

  /// Deletar foto
  Future<bool> deletePhoto(String photoPath) async {
    try {
      final file = File(photoPath);
      if (await file.exists()) {
        await file.delete();
        appLogger.d('[PhotoService] Foto deletada: $photoPath');
        return true;
      }
      return false;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao deletar foto', error: e);
      return false;
    }
  }

  /// Obter tamanho da foto em MB
  Future<double> getPhotoSizeInMB(String photoPath) async {
    try {
      final file = File(photoPath);
      if (await file.exists()) {
        final bytes = await file.length();
        return bytes / (1024 * 1024);
      }
      return 0;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao obter tamanho da foto', error: e);
      return 0;
    }
  }

  /// Listar todas as fotos salvas
  Future<List<File>> getAllPhotos() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final photosDir = Directory(path.join(appDir.path, 'photos'));

      if (!photosDir.existsSync()) {
        return [];
      }

      final files = photosDir
          .listSync()
          .whereType<File>()
          .where((file) => file.path.endsWith('.jpg'))
          .toList();

      return files;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao listar fotos', error: e);
      return [];
    }
  }

  /// Limpar todas as fotos
  Future<bool> clearAllPhotos() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final photosDir = Directory(path.join(appDir.path, 'photos'));

      if (photosDir.existsSync()) {
        photosDir.deleteSync(recursive: true);
        appLogger.d('[PhotoService] Todas as fotos foram deletadas');
        return true;
      }
      return false;
    } catch (e) {
      appLogger.e('[PhotoService] Erro ao limpar fotos', error: e);
      return false;
    }
  }
}
