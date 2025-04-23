from flask import Blueprint, request, jsonify
from models.pais import Pais

pais_bp = Blueprint('pais_bp', __name__)

@pais_bp.route('/paises', methods=['GET'])
def listar_paises():
    """Endpoint para obtener todos los registros"""
    paises = Pais.listar_paises()
    return jsonify(paises), 200

@pais_bp.route('/paises', methods=['POST'])
def crear_pais():
    """Endpoint para insertar un registro"""
    data = request.json
    nombrePais = data.get('nombrePais')

    if not isinstance(nombrePais, str):
        return jsonify({'mensaje': 'nombrePais debe ser una cadena de texto'}), 400

    if not nombrePais:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Pais.crear_pais(nombrePais):
        return jsonify({'mensaje': 'País insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar país'}), 500

@pais_bp.route('/paises', methods=['PUT'])
def editar_pais():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkPais = data.get('pkPais')
        nombrePais = data.get('nombrePais')

        if Pais.editar_pais(pkPais, nombrePais):
            return jsonify({'mensaje': 'País editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el país'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@pais_bp.route('/paises', methods=['DELETE'])
def eliminar_pais():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkPais = data.get('pkPais')

        if Pais.eliminar_pais(pkPais):
            return jsonify({'mensaje': 'País eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el país'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500