import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/vehicle_models.dart';
import '../providers/vehicle_provider.dart';
import '../providers/auth_provider.dart';

class AddVehicleScreen extends StatefulWidget {
  const AddVehicleScreen({Key? key}) : super(key: key);

  @override
  State<AddVehicleScreen> createState() => _AddVehicleScreenState();
}

class _AddVehicleScreenState extends State<AddVehicleScreen> {
  final _formKey = GlobalKey<FormState>();
  final _clientNameController = TextEditingController();
  final _clientPhoneController = TextEditingController();
  final _plateController = TextEditingController();
  final _brandController = TextEditingController();
  final _modelController = TextEditingController();
  final _colorController = TextEditingController();
  final _yearController = TextEditingController();

  int? _selectedCategoryId;
  int? _selectedServiceId;

  @override
  void dispose() {
    _clientNameController.dispose();
    _clientPhoneController.dispose();
    _plateController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _colorController.dispose();
    _yearController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Novo Veículo'),
        elevation: 0,
      ),
      body: Consumer<VehicleProvider>(
        builder: (context, vehicleProvider, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Seção de Cliente
                  const Text(
                    'Dados do Cliente',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _clientNameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Nome do Cliente'),
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Nome do cliente é obrigatório';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _clientPhoneController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Telefone'),
                    keyboardType: TextInputType.phone,
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Telefone é obrigatório';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  // Seção de Veículo
                  const Text(
                    'Dados do Veículo',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _plateController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Placa'),
                    textCapitalization: TextCapitalization.characters,
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Placa é obrigatória';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _brandController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Marca'),
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Marca é obrigatória';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _modelController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Modelo'),
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Modelo é obrigatório';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _colorController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Cor'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _yearController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _buildInputDecoration('Ano'),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 12),
                  // Categoria
                  DropdownButtonFormField<int>(
                    value: _selectedCategoryId,
                    style: const TextStyle(color: Colors.white),
                    dropdownColor: const Color(0xFF1F2937),
                    decoration: _buildInputDecoration('Categoria'),
                    items: vehicleProvider.categories.map((category) {
                      return DropdownMenuItem<int>(
                        value: category.id,
                        child: Text(category.name),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedCategoryId = value;
                      });
                    },
                    validator: (value) {
                      if (value == null) {
                        return 'Selecione uma categoria';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  // Seção de Serviço
                  const Text(
                    'Serviço',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<int>(
                    value: _selectedServiceId,
                    style: const TextStyle(color: Colors.white),
                    dropdownColor: const Color(0xFF1F2937),
                    decoration: _buildInputDecoration('Serviço'),
                    items: vehicleProvider.services.map((service) {
                      return DropdownMenuItem<int>(
                        value: service.id,
                        child: Text('${service.name} - R\$ ${service.basePrice.toStringAsFixed(2)}'),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedServiceId = value;
                      });
                    },
                    validator: (value) {
                      if (value == null) {
                        return 'Selecione um serviço';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 32),
                  // Botão Enviar
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: vehicleProvider.isLoading
                          ? null
                          : () => _handleSubmit(context, vehicleProvider),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDC2626),
                        disabledBackgroundColor: const Color(0xFF6B7280),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: vehicleProvider.isLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Adicionar à Fila',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  InputDecoration _buildInputDecoration(String label) {
    return InputDecoration(
      hintText: label,
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
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFDC2626)),
      ),
    );
  }

  void _handleSubmit(BuildContext context, VehicleProvider vehicleProvider) async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    try {
      final authProvider = context.read<AuthProvider>();
      final currentUser = authProvider.currentUser;

      if (currentUser == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erro: Usuário não autenticado')),
        );
        return;
      }

      // Criar cliente
      final client = ClientModel(
        id: 0,
        uuid: _generateUUID(),
        name: _clientNameController.text,
        phone: _clientPhoneController.text,
        email: null,
        address: null,
        city: null,
        state: null,
        zipCode: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final clientCreated = await vehicleProvider.createClient(client);
      if (!clientCreated) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(vehicleProvider.error ?? 'Erro ao criar cliente')),
          );
        }
        return;
      }

      // Obter cliente criado
      final createdClient = await vehicleProvider.getClientByPhone(_clientPhoneController.text);
      if (createdClient == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Erro ao recuperar cliente')),
          );
        }
        return;
      }

      // Criar veículo
      final vehicle = VehicleModel(
        id: 0,
        uuid: _generateUUID(),
        clientId: createdClient.id,
        plate: _plateController.text,
        brand: _brandController.text,
        model: _modelController.text,
        color: _colorController.text.isEmpty ? null : _colorController.text,
        categoryId: _selectedCategoryId!,
        year: _yearController.text.isEmpty ? null : int.tryParse(_yearController.text),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final vehicleCreated = await vehicleProvider.createVehicle(vehicle);
      if (!vehicleCreated) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(vehicleProvider.error ?? 'Erro ao criar veículo')),
          );
        }
        return;
      }

      // Obter veículo criado
      final createdVehicle = await vehicleProvider.getVehicleByPlate(_plateController.text);
      if (createdVehicle == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Erro ao recuperar veículo')),
          );
        }
        return;
      }

      // Gerar número de OS
      final orderNumber = await vehicleProvider.generateOrderNumber();

      // Criar ordem de serviço
      final serviceOrder = ServiceOrderModel(
        id: 0,
        uuid: _generateUUID(),
        orderNumber: orderNumber,
        vehicleId: createdVehicle.id,
        clientId: createdClient.id,
        employeeId: currentUser.id,
        serviceId: _selectedServiceId!,
        status: 'pending',
        entryPhotoPath: null,
        exitPhotoPath: null,
        entryTime: DateTime.now(),
        completionTime: null,
        price: vehicleProvider.services
            .firstWhere((s) => s.id == _selectedServiceId)
            .basePrice,
        notes: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final orderCreated = await vehicleProvider.createServiceOrder(serviceOrder);
      if (!orderCreated) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(vehicleProvider.error ?? 'Erro ao criar ordem')),
          );
        }
        return;
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Veículo adicionado à fila! OS: $orderNumber')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e')),
        );
      }
    }
  }

  String _generateUUID() {
    return '${DateTime.now().millisecondsSinceEpoch}-${(DateTime.now().microsecond).toString()}';
  }
}
