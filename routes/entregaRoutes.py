from flask import Blueprint, request, jsonify
from controllers.entregaController import EntregaController

entrega_bp = Blueprint('entrega_bp', __name__)

@entrega_bp.route('/entregas', methods=['GET'])
def listar_entregas():
    """Endpoint para obtener todos los registros"""
    entregas = EntregaController.listar_entregas()
    return jsonify(entregas), 200

@entrega_bp.route('/entregas', methods=['POST'])
def crear_entrega():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaEntrega = data.get('fechaEntrega')
    fkSeguimientoAlmacen = data.get('fkSeguimientoAlmacen')

    if not isinstance(fechaEntrega, str):
        return jsonify({'mensaje': 'fechaEntrega debe ser una cadena de texto'}), 400

    if not isinstance(fkSeguimientoAlmacen, int):
        return jsonify({'mensaje': 'fkSeguimientoAlmacen debe ser un entero'}), 400

    if not fechaEntrega or not fkSeguimientoAlmacen:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if EntregaController.crear_entrega(fechaEntrega, fkSeguimientoAlmacen):
        return jsonify({'mensaje': 'Entrega insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar entrega'}), 500

@entrega_bp.route('/entregas', methods=['PUT'])
def editar_entrega():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkEntrega = data.get('pkEntrega')
        fechaEntrega = data.get('fechaEntrega')
        fkSeguimientoAlmacen = data.get('fkSeguimientoAlmacen')

        if EntregaController.editar_entrega(pkEntrega, fechaEntrega, fkSeguimientoAlmacen):
            return jsonify({'mensaje': 'Entrega editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la entrega'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@entrega_bp.route('/entregas', methods=['DELETE'])
def eliminar_entrega():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkEntrega = data.get('pkEntrega')

        if EntregaController.eliminar_entrega(pkEntrega):
            return jsonify({'mensaje': 'Entrega eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la entrega'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500