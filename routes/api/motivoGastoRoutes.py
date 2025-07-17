from flask import Blueprint, request, jsonify
from models.motivoGasto import MotivoGasto

api_motivosGasto = Blueprint('api_motivosGasto', __name__)

@api_motivosGasto.route('/', methods=['GET'])
def listar_motivosGasto():
    """Endpoint para obtener todos los registros"""
    motivosGasto = MotivoGasto.listar_motivosGasto()
    return jsonify(motivosGasto), 200

@api_motivosGasto.route('/', methods=['POST'])
def crear_motivoGasto():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreMotivoGasto = data.get('nombreMotivoGasto')
    tipoGasto = data.get('tipoGasto')

    if not isinstance(nombreMotivoGasto, str):
        return jsonify({'mensaje': 'nombreMotivoGasto debe ser una cadena de texto'}), 400

    if not isinstance(tipoGasto, str):
        return jsonify({'mensaje': 'tipoGasto debe ser una cadena de texto'}), 400

    if not nombreMotivoGasto or not tipoGasto:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if MotivoGasto.crear_motivoGasto(nombreMotivoGasto, tipoGasto):
        return jsonify({'mensaje': 'Motivo de gasto insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar motivo de gasto'}), 500

@api_motivosGasto.route('/', methods=['PUT'])
def editar_motivoGasto():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkMotivoGasto = data.get('pkMotivoGasto')
        nombreMotivoGasto = data.get('nombreMotivoGasto')
        tipoGasto = data.get('tipoGasto')

        if MotivoGasto.editar_motivoGasto(pkMotivoGasto, nombreMotivoGasto, tipoGasto):
            return jsonify({'mensaje': 'Motivo de gasto editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el motivo de gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_motivosGasto.route('/', methods=['DELETE'])
def eliminar_motivoGasto():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkMotivoGasto = data.get('pkMotivoGasto')

        if MotivoGasto.eliminar_motivoGasto(pkMotivoGasto):
            return jsonify({'mensaje': 'Motivo de gasto eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el motivo de gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500