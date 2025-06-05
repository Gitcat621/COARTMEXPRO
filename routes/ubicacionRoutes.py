from flask import Blueprint, request, jsonify
from models.ubicacion import Ubicacion

ubicacion_bp = Blueprint('ubicacion_bp', __name__)

@ubicacion_bp.route('/ubicaciones', methods=['GET'])
def listar_ubicaciones():
    """Endpoint para obtener todos los registros"""
    ubicaciones = Ubicacion.listar_ubicaciones()
    return jsonify(ubicaciones), 200

@ubicacion_bp.route('/ubicaciones', methods=['POST'])
def crear_ubicacion():
    """Endpoint para insertar un registro"""
    data = request.json
    fkPuebloCiudad = int(data.get('fkPuebloCiudad'))
    fkCodigoPostal = int(data.get('fkCodigoPostal'))
    fkMunicipio = int(data.get('fkMunicipio'))
    fkEstado = int(data.get('fkEstado'))
    fkPais = int(data.get('fkPais'))

    

    if not fkPuebloCiudad or not fkCodigoPostal or not fkMunicipio or not fkEstado or not fkPais:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    ubicacion = Ubicacion(None,fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais)
    if ubicacion.crear_ubicacion():
        return jsonify({'mensaje': 'Ubicación insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar ubicación'}), 500

@ubicacion_bp.route('/ubicaciones', methods=['PUT'])
def editar_ubicacion():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkUbicacion = int(data.get('pkUbicacion'))
        fkPuebloCiudad = int(data.get('fkPuebloCiudad'))
        fkCodigoPostal = int(data.get('fkCodigoPostal'))
        fkMunicipio = int(data.get('fkMunicipio'))
        fkEstado = int(data.get('fkEstado'))
        fkPais = int(data.get('fkPais'))

        if not isinstance(fkPuebloCiudad, int):
            return jsonify({'mensaje': 'fkPuebloCiudad debe ser un entero'}), 400
        if not isinstance(fkCodigoPostal, int):
            return jsonify({'mensaje': 'fkCodigoPostal debe ser un entero'}), 400
        if not isinstance(fkMunicipio, int):
            return jsonify({'mensaje': 'fkMunicipio debe ser un entero'}), 400
        if not isinstance(fkEstado, int):
            return jsonify({'mensaje': 'fkEstado debe ser un entero'}), 400
        if not isinstance(fkPais, int):
            return jsonify({'mensaje': 'fkPais debe ser un entero'}), 400

        ubicacion = Ubicacion(pkUbicacion, fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais)
        if ubicacion.editar_ubicacion():
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
        pkUbicacion = int(data.get('pkUbicacion'))

        if not isinstance(pkUbicacion, int):
            return jsonify({'mensaje': 'fkPuebloCiudad debe ser un entero'}), 400

        ubicacion = Ubicacion(pkUbicacion)
        if ubicacion.eliminar_ubicacion():
            return jsonify({'mensaje': 'Ubicación eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la ubicación'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500