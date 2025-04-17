from flask import Blueprint, request, jsonify
from controllers.ubicacionController import UbicacionController

ubicacion_bp = Blueprint('ubicacion_bp', __name__)

@ubicacion_bp.route('/ubicaciones', methods=['GET'])
def listar_ubicaciones():
    """Endpoint para obtener todos los registros"""
    ubicaciones = UbicacionController.listar_ubicaciones()
    return jsonify(ubicaciones), 200

@ubicacion_bp.route('/ubicaciones', methods=['POST'])
def crear_ubicacion():
    """Endpoint para insertar un registro"""
    data = request.json
    fkPuebloCiudad = data.get('fkPuebloCiudad')
    fkCodigoPostal = data.get('fkCodigoPostal')
    fkMunicipio = data.get('fkMunicipio')
    fkEstado = data.get('fkEstado')
    fkPais = data.get('fkPais')

    # if not isinstance(fkPuebloCiudad, int):
    #     return jsonify({'mensaje': 'fkPuebloCiudad debe ser un entero'}), 400
    # if not isinstance(fkCodigoPostal, int):
    #     return jsonify({'mensaje': 'fkCodigoPostal debe ser un entero'}), 400
    # if not isinstance(fkMunicipio, int):
    #     return jsonify({'mensaje': 'fkMunicipio debe ser un entero'}), 400
    # if not isinstance(fkEstado, int):
    #     return jsonify({'mensaje': 'fkEstado debe ser un entero'}), 400
    # if not isinstance(fkPais, int):
    #     return jsonify({'mensaje': 'fkPais debe ser un entero'}), 400

    if not fkPuebloCiudad or not fkCodigoPostal or not fkMunicipio or not fkEstado or not fkPais:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if UbicacionController.crear_ubicacion(fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais):
        return jsonify({'mensaje': 'Ubicación insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar ubicación'}), 500

@ubicacion_bp.route('/ubicaciones', methods=['PUT'])
def editar_ubicacion():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkUbicacion = data.get('pkUbicacion')
        fkPuebloCiudad = data.get('fkPuebloCiudad')
        fkCodigoPostal = data.get('fkCodigoPostal')
        fkMunicipio = data.get('fkMunicipio')
        fkEstado = data.get('fkEstado')
        fkPais = data.get('fkPais')

        if UbicacionController.editar_ubicacion(pkUbicacion, fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais):
            return jsonify({'mensaje': 'Ubicación editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la ubicación'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@ubicacion_bp.route('/ubicaciones', methods=['DELETE'])
def eliminar_ubicacion():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkUbicacion = data.get('pkUbicacion')

        if UbicacionController.eliminar_ubicacion(pkUbicacion):
            return jsonify({'mensaje': 'Ubicación eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la ubicación'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500