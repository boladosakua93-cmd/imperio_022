import 'package:flutter/material.dart';
import '../services/photo_service.dart';

class PhotoPickerDialog extends StatelessWidget {
  final Function(String) onPhotoSelected;
  final String title;

  const PhotoPickerDialog({
    Key? key,
    required this.onPhotoSelected,
    this.title = 'Selecionar Foto',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF1F2937),
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      content: const Text(
        'Escolha a origem da foto:',
        style: TextStyle(color: Color(0xFF9CA3AF)),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text(
            'Cancelar',
            style: TextStyle(color: Color(0xFF9CA3AF)),
          ),
        ),
        TextButton(
          onPressed: () async {
            Navigator.pop(context);
            await _capturePhoto(context);
          },
          child: const Text(
            'Câmera',
            style: TextStyle(
              color: Color(0xFFDC2626),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        TextButton(
          onPressed: () async {
            Navigator.pop(context);
            await _selectFromGallery(context);
          },
          child: const Text(
            'Galeria',
            style: TextStyle(
              color: Color(0xFFDC2626),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _capturePhoto(BuildContext context) async {
    final photoPath = await PhotoService().capturePhoto();
    if (photoPath != null && context.mounted) {
      onPhotoSelected(photoPath);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Foto capturada com sucesso!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    }
  }

  Future<void> _selectFromGallery(BuildContext context) async {
    final photoPath = await PhotoService().selectPhotoFromGallery();
    if (photoPath != null && context.mounted) {
      onPhotoSelected(photoPath);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Foto selecionada com sucesso!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    }
  }
}
