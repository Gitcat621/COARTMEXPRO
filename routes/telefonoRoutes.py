from flask import Blueprint, request, jsonify
from models.telefono import Telefono

telefono_bp = Blueprint('telefono_bp', __name__)

@telefono_bp.route('/telefonos', methods=['GET'])
def listar_telefonos():
    """Endpoint para obtener todos los registros"""
    telefonos = Telefono.listar_telefonos()
    return jsonify(telefonos), 200

@telefono_bp.route('/telefonos', methods=['POST'])
def crear_telefono():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroTelefono = data.get('numeroTelefono')

    if not isinstance(numeroTelefono, str):
        return jsonify({'mensaje': 'numeroTelefono debe ser una cadena de texto'}), 400

    if not numeroTelefono:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Telefono.crear_telefono(numeroTelefono):
        return jsonify({'mensaje': 'Teléfono insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar teléfono'}), 500

@telefono_bp.route('/telefonos', methods=['PUT'])
def editar_telefono():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkTelefono = data.get('pkTelefono')
        numeroTelefono = data.get('numeroTelefono')

        if Telefono.editar_telefono(pkTelefono, numeroTelefono):
            return jsonify({'mensaje': 'Teléfono editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el teléfono'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@telefono_bp.route('/telefonos', methods=['DELETE'])
def eliminar_telefono():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkTelefono = data.get('pkTelefono')

        if Telefono.eliminar_telefono(pkTelefono):
            return jsonify({'mensaje': 'Teléfono eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el teléfono'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500