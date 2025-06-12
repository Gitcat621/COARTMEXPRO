from flask import Blueprint, request, jsonify
from models.banco import Banco

banco_bp = Blueprint('banco_bp', __name__)

@banco_bp.route('/bancos', methods=['GET'])
def listar_bancos():
    """Endpoint para obtener todos los registros"""
    bancos = Banco.listar_bancos()
    return jsonify(bancos), 200

@banco_bp.route('/bancos', methods=['POST'])
def crear_banco():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreBanco = data.get('nombreBanco')

    if not isinstance(nombreBanco, str):
        return jsonify({'mensaje': 'nombreBanco debe ser una cadena de texto'}), 400

    banco = Banco(nombreBanco=nombreBanco)
    if banco.crear_banco():
        return jsonify({'mensaje': 'Banco insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar banco'}), 500

@banco_bp.route('/bancos', methods=['PUT'])
def editar_banco():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkBanco = data.get('pkBanco')
        nombreBanco = data.get('nombreBanco')

        banco = Banco(pkBanco, nombreBanco)
        if banco.editar_banco():
            return jsonify({'mensaje': 'Banco editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@banco_bp.route('/bancos', methods=['DELETE'])
def eliminar_banco():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkBanco = data.get('pkBanco')

        banco = Banco(pkBanco)
        if banco.eliminar_banco():
            return jsonify({'mensaje': 'Banco eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500