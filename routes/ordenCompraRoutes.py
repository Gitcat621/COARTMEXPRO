from flask import Blueprint, request, jsonify
from models.ordenCompra import OrdenCompra

ordenCompra_bp = Blueprint('ordenCompra_bp', __name__)

@ordenCompra_bp.route('/ordenesCompra', methods=['GET'])
def listar_ordenesCompra():
    """Endpoint para obtener todos los registros"""
    ordenesCompra = OrdenCompra.listar_ordenesCompra()
    return jsonify(ordenesCompra), 200

@ordenCompra_bp.route('/ordenesCompra', methods=['POST'])
def crear_ordenCompra():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaOrdenCompra = data.get('fechaOrdenCompra')
    fkSocioComercial = data.get('fkSocioComercial')

    if not isinstance(fechaOrdenCompra, str):
        return jsonify({'mensaje': 'fechaOrdenCompra debe ser una cadena de texto'}), 400

    if not isinstance(fkSocioComercial, int):
        return jsonify({'mensaje': 'fkSocioComercial debe ser un entero'}), 400

    if not fechaOrdenCompra or not fkSocioComercial:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if OrdenCompra.crear_ordenCompra(fechaOrdenCompra, fkSocioComercial):
        return jsonify({'mensaje': 'Orden de compra insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar orden de compra'}), 500

@ordenCompra_bp.route('/ordenesCompra', methods=['PUT'])
def editar_ordenCompra():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkOrdenCompra = data.get('pkOrdenCompra')
        fechaOrdenCompra = data.get('fechaOrdenCompra')
        fkSocioComercial = data.get('fkSocioComercial')

        if OrdenCompra.editar_ordenCompra(pkOrdenCompra, fechaOrdenCompra, fkSocioComercial):
            return jsonify({'mensaje': 'Orden de compra editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la orden de compra'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@ordenCompra_bp.route('/ordenesCompra', methods=['DELETE'])
def eliminar_ordenCompra():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkOrdenCompra = data.get('pkOrdenCompra')

        if OrdenCompra.eliminar_ordenCompra(pkOrdenCompra):
            return jsonify({'mensaje': 'Orden de compra eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la orden de compra'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500