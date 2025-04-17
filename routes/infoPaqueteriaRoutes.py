from flask import Blueprint, request, jsonify
from controllers.infoPaqueteriaController import InfoPaqueteriaController

infoPaqueteria_bp = Blueprint('infoPaqueteria_bp', __name__)

@infoPaqueteria_bp.route('/infoPaqueterias', methods=['GET'])
def listar_infoPaqueterias():
    """Endpoint para obtener todos los registros"""
    infoPaqueterias = InfoPaqueteriaController.listar_infoPaqueterias()
    return jsonify(infoPaqueterias), 200

@infoPaqueteria_bp.route('/infoPaqueterias', methods=['POST'])
def crear_infoPaqueteria():
    """Endpoint para insertar un registro"""
    data = request.json
    diasEntrega = data.get('diasEntrega')
    flete = data.get('flete')

    if not isinstance(diasEntrega, int):
        return jsonify({'mensaje': 'diasEntrega debe ser un entero'}), 400

    if not isinstance(flete, float):
        return jsonify({'mensaje': 'flete debe ser un número decimal'}), 400

    if not diasEntrega or not flete:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if InfoPaqueteriaController.crear_infoPaqueteria(diasEntrega, flete):
        return jsonify({'mensaje': 'Información de paquetería insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar información de paquetería'}), 500

@infoPaqueteria_bp.route('/infoPaqueterias', methods=['PUT'])
def editar_infoPaqueteria():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkInfoPaqueteria = data.get('pkInfoPaqueteria')
        diasEntrega = data.get('diasEntrega')
        flete = data.get('flete')

        if InfoPaqueteriaController.editar_infoPaqueteria(pkInfoPaqueteria, diasEntrega, flete):
            return jsonify({'mensaje': 'Información de paquetería editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la información de paquetería'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@infoPaqueteria_bp.route('/infoPaqueterias', methods=['DELETE'])
def eliminar_infoPaqueteria():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkInfoPaqueteria = data.get('pkInfoPaqueteria')

        if InfoPaqueteriaController.eliminar_infoPaqueteria(pkInfoPaqueteria):
            return jsonify({'mensaje': 'Información de paquetería eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la información de paquetería'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500