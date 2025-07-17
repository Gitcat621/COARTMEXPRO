from flask import Blueprint, request, jsonify
from models.codigoPostal import CodigoPostal

api_codigosPostales = Blueprint('api_codigosPostales', __name__)

@api_codigosPostales.route('/', methods=['GET'])
def listar_codigosPostales():
    """Endpoint para obtener todos los registros"""
    codigosPostales = CodigoPostal.listar_codigosPostales()
    return jsonify(codigosPostales), 200

@api_codigosPostales.route('/', methods=['POST'])
def crear_codigoPostal():
    """Endpoint para insertar un registro"""
    data = request.json
    codigoPostal = data.get('codigoPostal')
    if not isinstance(codigoPostal, str):
        return jsonify({'mensaje': 'codigoPostal debe ser una cadena de texto'}), 400

    codigoPostal = CodigoPostal(codigoPostal=codigoPostal)

    if codigoPostal.crear_codigoPostal():
        return jsonify({'mensaje': 'Código postal insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar código postal'}), 500

@api_codigosPostales.route('/', methods=['PUT'])
def editar_codigoPostal():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCodigoPostal = data.get('pkCodigoPostal')
        codigoPostal = data.get('codigoPostal')

        codigoPostal = CodigoPostal(pkCodigoPostal,codigoPostal)
        if codigoPostal.editar_codigoPostal():
            return jsonify({'mensaje': 'Código postal editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el código postal'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_codigosPostales.route('/', methods=['DELETE'])
def eliminar_codigoPostal():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCodigoPostal = data.get('pkCodigoPostal')

        codigoPostal = CodigoPostal(pkCodigoPostal)
        if codigoPostal.eliminar_codigoPostal():
            return jsonify({'mensaje': 'Código postal eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el código postal'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500