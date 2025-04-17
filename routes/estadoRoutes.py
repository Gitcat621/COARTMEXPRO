from flask import Blueprint, request, jsonify
from controllers.estadoController import EstadoController

estado_bp = Blueprint('estado_bp', __name__)

@estado_bp.route('/estados', methods=['GET'])
def listar_estados():
    """Endpoint para obtener todos los registros"""
    estados = EstadoController.listar_estados()
    return jsonify(estados), 200

@estado_bp.route('/estados', methods=['POST'])
def crear_estado():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreEstado = data.get('nombreEstado')

    if not isinstance(nombreEstado, str):
        return jsonify({'mensaje': 'nombreEstado debe ser una cadena de texto'}), 400

    if EstadoController.crear_estado(nombreEstado):
        return jsonify({'mensaje': 'Estado insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar estado'}), 500

@estado_bp.route('/estados', methods=['PUT'])
def editar_estado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkEstado = data.get('pkEstado')
        nombreEstado = data.get('nombreEstado')

        if EstadoController.editar_estado(pkEstado, nombreEstado):
            return jsonify({'mensaje': 'Estado editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el estado'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@estado_bp.route('/estados', methods=['DELETE'])
def eliminar_estado():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkEstado = data.get('pkEstado')

        if EstadoController.eliminar_estado(pkEstado):
            return jsonify({'mensaje': 'Estado eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el estado'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500