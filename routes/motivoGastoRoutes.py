from flask import Blueprint, request, jsonify
from controllers.motivoGastoController import MotivoGastoController

motivoGasto_bp = Blueprint('motivoGasto_bp', __name__)

@motivoGasto_bp.route('/motivosGasto', methods=['GET'])
def listar_motivosGasto():
    """Endpoint para obtener todos los registros"""
    motivosGasto = MotivoGastoController.listar_motivosGasto()
    return jsonify(motivosGasto), 200

@motivoGasto_bp.route('/motivosGasto', methods=['POST'])
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

    if MotivoGastoController.crear_motivoGasto(nombreMotivoGasto, tipoGasto):
        return jsonify({'mensaje': 'Motivo de gasto insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar motivo de gasto'}), 500

@motivoGasto_bp.route('/motivosGasto', methods=['PUT'])
def editar_motivoGasto():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkMotivoGasto = data.get('pkMotivoGasto')
        nombreMotivoGasto = data.get('nombreMotivoGasto')
        tipoGasto = data.get('tipoGasto')

        if MotivoGastoController.editar_motivoGasto(pkMotivoGasto, nombreMotivoGasto, tipoGasto):
            return jsonify({'mensaje': 'Motivo de gasto editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el motivo de gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@motivoGasto_bp.route('/motivosGasto', methods=['DELETE'])
def eliminar_motivoGasto():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkMotivoGasto = data.get('pkMotivoGasto')

        if MotivoGastoController.eliminar_motivoGasto(pkMotivoGasto):
            return jsonify({'mensaje': 'Motivo de gasto eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el motivo de gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500