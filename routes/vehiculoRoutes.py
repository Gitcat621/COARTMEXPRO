from flask import Blueprint, request, jsonify
from models.vehiculo import Vehiculo

vehiculo_bp = Blueprint('vehiculo_bp', __name__)

# Ruta para obtener todos los vehículos
@vehiculo_bp.route('/vehiculos', methods=['GET'])
def listar_vehiculos():
    """Endpoint para obtener todos los registros"""
    vehiculos = Vehiculo.listar_vehiculos()
    return jsonify(vehiculos), 200

# Ruta para obtener todos los vehículos
@vehiculo_bp.route('/vehiculo', methods=['GET'])
def obtener_vehiculo():
    """Endpoint para obtener un registro especifico"""

    pkVehiculo = request.args.get('pkVehiculo')

    if not pkVehiculo:
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos
    
    vehiculos = Vehiculo.obtener_vehiculo(pkVehiculo)
    return jsonify(vehiculos), 200

# Ruta para insertar un nuevo vehículo
@vehiculo_bp.route('/vehiculos', methods=['POST'])
def crear_vehiculo():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreVehiculo = data.get('nombreVehiculo')

    if not nombreVehiculo:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    vehiculo = Vehiculo(None, nombreVehiculo)
    if vehiculo.crear_vehiculo():
        return jsonify({'mensaje': 'Vehículo insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar vehículo'}), 500

# Ruta para editar un vehículo
@vehiculo_bp.route('/vehiculos', methods=['PUT'])
def editar_vehiculo():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkVehiculo = data.get('pkVehiculo')
        nombreVehiculo = data.get('nombreVehiculo')

        if not pkVehiculo or not nombreVehiculo:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        vehiculo = Vehiculo(pkVehiculo, nombreVehiculo)
        if vehiculo.editar_vehiculo():
            return jsonify({'mensaje': 'Vehículo editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el vehículo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un vehículo
@vehiculo_bp.route('/vehiculos', methods=['DELETE'])
def eliminar_vehiculo():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkVehiculo = data.get('pkVehiculo')

        if not pkVehiculo:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        vehiculo = Vehiculo(pkVehiculo)
        if vehiculo.eliminar_vehiculo():
            return jsonify({'mensaje': 'Vehículo eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el vehículo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
