from flask import Blueprint, request, jsonify
from models.servicioVehiculo import ServicioVehiculo

servicio_vehiculo_bp = Blueprint('servicio_vehiculo_bp', __name__)

# Ruta para listar todos los servicios de vehículo
@servicio_vehiculo_bp.route('/servicios_vehiculo', methods=['GET'])
def listar_servicios_vehiculo():
    """Endpoint para obtener todos los registros"""
    servicios = ServicioVehiculo.listar_servicios_vehiculo()
    return jsonify(servicios), 200

@servicio_vehiculo_bp.route('/servicio_vehiculo', methods=['GET'])
def listar_servicio_vehiculo():
    """Endpoint para obtener un registro"""
    fkVehiculo = request.args.get('fkVehiculo')

    servicios = ServicioVehiculo.listar_servicio_vehiculo(fkVehiculo)
    return jsonify(servicios), 200

# Ruta para crear un nuevo servicio de vehículo
@servicio_vehiculo_bp.route('/servicios_vehiculo', methods=['POST'])
def crear_servicio_vehiculo():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroServicio = data.get('numeroServicio')
    nombreServicio = data.get('nombreServicio')
    fechaServicio = data.get('fechaServicio')
    kilometrajeInicial = data.get('kilometrajeInicial')
    kilometrajeFinal = data.get('kilometrajeFinal')
    numeroFactura = data.get('numeroFactura')
    fkVehiculo = data.get('fkVehiculo')
    fkLugarServicio = data.get('fkLugarServicio')
    fkManoObra = data.get('fkManoObra')

    campos_obligatorios = [numeroServicio, nombreServicio, fechaServicio,  kilometrajeInicial, kilometrajeFinal, numeroFactura, fkVehiculo, fkLugarServicio, fkManoObra]
    if any(c is None for c in campos_obligatorios):
        return jsonify({'mensaje': 'Faltan datos'}), 400

    servicio = ServicioVehiculo(
        None,
        numeroServicio,
        nombreServicio,
        fechaServicio,
        kilometrajeInicial,
        kilometrajeFinal,
        numeroFactura,
        fkVehiculo,
        fkLugarServicio,
        fkManoObra
    )

    if servicio.crear_servicio_vehiculo():
        return jsonify({'mensaje': 'Servicio de vehículo insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar servicio de vehículo'}), 500

# Ruta para editar un servicio de vehículo
@servicio_vehiculo_bp.route('/servicios_vehiculo', methods=['PUT'])
def editar_servicio_vehiculo():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkServicioVehiculo = data.get('pkServicioVehiculo')
        numeroServicio = data.get('numeroServicio')
        nombreServicio = data.get('nombreServicio')
        fechaServicio = data.get('fechaServicio')
        kilometrajeInicial = data.get('kilometrajeInicial')
        kilometrajeFinal = data.get('kilometrajeFinal')
        numeroFactura = data.get('numeroFactura')
        fkVehiculo = data.get('fkVehiculo')
        fkLugarServicio = data.get('fkLugarServicio')
        fkManoObra = data.get('fkManoObra')

        campos_obligatorios = [pkServicioVehiculo, numeroServicio, nombreServicio, fechaServicio, kilometrajeInicial, kilometrajeFinal, numeroFactura, fkVehiculo, fkLugarServicio, fkManoObra]
        if any(c is None for c in campos_obligatorios):
            return jsonify({'mensaje': 'Faltan datos'}), 400

        servicio = ServicioVehiculo(
            pkServicioVehiculo,
            numeroServicio,
            nombreServicio,
            fechaServicio,
            kilometrajeInicial,
            kilometrajeFinal,
            numeroFactura,
            fkVehiculo,
            fkLugarServicio,
            fkManoObra
        )

        if servicio.editar_servicio_vehiculo():
            return jsonify({'mensaje': 'Servicio de vehículo editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el servicio de vehículo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un servicio de vehículo
@servicio_vehiculo_bp.route('/servicios_vehiculo', methods=['DELETE'])
def eliminar_servicio_vehiculo():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkServicioVehiculo = data.get('pkServicioVehiculo')

        if not pkServicioVehiculo:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        servicio = ServicioVehiculo(pkServicioVehiculo)
        if servicio.eliminar_servicio_vehiculo():
            return jsonify({'mensaje': 'Servicio de vehículo eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el servicio de vehículo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
