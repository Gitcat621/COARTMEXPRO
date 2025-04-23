from flask import Blueprint, request, jsonify
from models.codigoPostal import CodigoPostal

codigoPostal_bp = Blueprint('codigoPostal_bp', __name__)

@codigoPostal_bp.route('/codigosPostales', methods=['GET'])
def listar_codigosPostales():
    """Endpoint para obtener todos los registros"""
    codigosPostales = CodigoPostal.listar_codigosPostales()
    return jsonify(codigosPostales), 200

@codigoPostal_bp.route('/codigosPostales', methods=['POST'])
def crear_codigoPostal():
    """Endpoint para insertar un registro"""
    data = request.json
    codigoPostal = data.get('codigoPostal')
    if not isinstance(codigoPostal, str):
        return jsonify({'mensaje': 'codigoPostal debe ser una cadena de texto'}), 400

    if CodigoPostal.crear_codigoPostal(codigoPostal):
        return jsonify({'mensaje': 'Código postal insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar código postal'}), 500

@codigoPostal_bp.route('/codigosPostales', methods=['PUT'])
def editar_codigoPostal():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCodigoPostal = data.get('pkCodigoPostal')
        codigoPostal = data.get('codigoPostal')

        if CodigoPostal.editar_codigoPostal(pkCodigoPostal, codigoPostal):
            return jsonify({'mensaje': 'Código postal editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el código postal'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@codigoPostal_bp.route('/codigosPostales', methods=['DELETE'])
def eliminar_codigoPostal():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCodigoPostal = data.get('pkCodigoPostal')

        if CodigoPostal.eliminar_codigoPostal(pkCodigoPostal):
            return jsonify({'mensaje': 'Código postal eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el código postal'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500