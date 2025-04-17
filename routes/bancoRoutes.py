from flask import Blueprint, request, jsonify
from controllers.bancoController import BancoController

banco_bp = Blueprint('banco_bp', __name__)

@banco_bp.route('/bancos', methods=['GET'])
def listar_bancos():
    """Endpoint para obtener todos los registros"""
    bancos = BancoController.listar_bancos()
    return jsonify(bancos), 200

@banco_bp.route('/bancos', methods=['POST'])
def crear_banco():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreBanco = data.get('nombreBanco')

    if not isinstance(nombreBanco, str):
        return jsonify({'mensaje': 'nombreBanco debe ser una cadena de texto'}), 400

    if BancoController.crear_banco(nombreBanco):
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

        if BancoController.editar_banco(pkBanco, nombreBanco):
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

        if BancoController.eliminar_banco(pkBanco):
            return jsonify({'mensaje': 'Banco eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500