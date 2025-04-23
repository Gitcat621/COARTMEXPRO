from flask import Blueprint, request, jsonify
from models.paqueteria import Paqueteria

paqueteria_bp = Blueprint('paqueteria_bp', __name__)

@paqueteria_bp.route('/paqueterias', methods=['GET'])
def listar_paqueterias():
    """Endpoint para obtener todos los registros"""
    paqueterias = Paqueteria.listar_paqueterias()
    return jsonify(paqueterias), 200

@paqueteria_bp.route('/paqueterias', methods=['POST'])
def crear_paqueteria():
    """Endpoint para insertar un registro"""
    data = request.json
    nombrePaqueteria = data.get('nombrePaqueteria')

    if not isinstance(nombrePaqueteria, str):
        return jsonify({'mensaje': 'nombrePaqueteria debe ser una cadena de texto'}), 400

    if not nombrePaqueteria:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Paqueteria.crear_paqueteria(nombrePaqueteria):
        return jsonify({'mensaje': 'Paquetería insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar paquetería'}), 500

@paqueteria_bp.route('/paqueterias', methods=['PUT'])
def editar_paqueteria():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkPaqueteria = data.get('pkPaqueteria')
        nombrePaqueteria = data.get('nombrePaqueteria')

        if Paqueteria.editar_paqueteria(pkPaqueteria, nombrePaqueteria):
            return jsonify({'mensaje': 'Paquetería editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la paquetería'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@paqueteria_bp.route('/paqueterias', methods=['DELETE'])
def eliminar_paqueteria():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkPaqueteria = data.get('pkPaqueteria')

        if Paqueteria.eliminar_paqueteria(pkPaqueteria):
            return jsonify({'mensaje': 'Paquetería eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la paquetería'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500