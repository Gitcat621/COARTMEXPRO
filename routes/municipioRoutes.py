from flask import Blueprint, request, jsonify
from controllers.municipioController import MunicipioController

municipio_bp = Blueprint('municipio_bp', __name__)

@municipio_bp.route('/municipios', methods=['GET'])
def listar_municipios():
    """Endpoint para obtener todos los registros"""
    municipios = MunicipioController.listar_municipios()
    return jsonify(municipios), 200

@municipio_bp.route('/municipios', methods=['POST'])
def crear_municipio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreMunicipio = data.get('nombreMunicipio')

    if not isinstance(nombreMunicipio, str):
        return jsonify({'mensaje': 'nombreMunicipio debe ser una cadena de texto'}), 400

    if not nombreMunicipio:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if MunicipioController.crear_municipio(nombreMunicipio):
        return jsonify({'mensaje': 'Municipio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar municipio'}), 500

@municipio_bp.route('/municipios', methods=['PUT'])
def editar_municipio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkMunicipio = data.get('pkMunicipio')
        nombreMunicipio = data.get('nombreMunicipio')

        if MunicipioController.editar_municipio(pkMunicipio, nombreMunicipio):
            return jsonify({'mensaje': 'Municipio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el municipio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@municipio_bp.route('/municipios', methods=['DELETE'])
def eliminar_municipio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkMunicipio = data.get('pkMunicipio')

        if MunicipioController.eliminar_municipio(pkMunicipio):
            return jsonify({'mensaje': 'Municipio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el municipio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500