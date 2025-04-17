from flask import Blueprint, request, jsonify
from controllers.facturaController import FacturaController

factura_bp = Blueprint('factura_bp', __name__)

@factura_bp.route('/facturas', methods=['GET'])
def listar_facturas():
    """Endpoint para obtener todos los registros"""
    facturas = FacturaController.listar_facturas()
    return jsonify(facturas), 200

@factura_bp.route('/facturas', methods=['POST'])
def crear_factura():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaFactura = data.get('fechaFactura')
    numeroAño = data.get('numeroAño')
    montoFactura = data.get('montoFactura')
    fechaVencimiento = data.get('fechaVencimiento')
    diasVencidos = data.get('diasVencidos')
    fechaPagado = data.get('fechaPagado')
    fkVenta = data.get('fkVenta')

    if not isinstance(fechaFactura, str):
        return jsonify({'mensaje': 'fechaFactura debe ser una cadena de texto'}), 400
    if not isinstance(numeroAño, int):
        return jsonify({'mensaje': 'numeroAño debe ser un entero'}), 400
    if not isinstance(montoFactura, float):
        return jsonify({'mensaje': 'montoFactura debe ser un número decimal'}), 400
    if not isinstance(fechaVencimiento, str):
        return jsonify({'mensaje': 'fechaVencimiento debe ser una cadena de texto'}), 400
    if not isinstance(diasVencidos, int):
        return jsonify({'mensaje': 'diasVencidos debe ser un entero'}), 400
    if fechaPagado and not isinstance(fechaPagado, str):
        return jsonify({'mensaje': 'fechaPagado debe ser una cadena de texto o nulo'}), 400
    if not isinstance(fkVenta, int):
        return jsonify({'mensaje': 'fkVenta debe ser un entero'}), 400

    if not fechaFactura or not numeroAño or not montoFactura or not fechaVencimiento or not diasVencidos or not fkVenta:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if FacturaController.crear_factura(fechaFactura, numeroAño, montoFactura, fechaVencimiento, diasVencidos, fechaPagado, fkVenta):
        return jsonify({'mensaje': 'Factura insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar factura'}), 500

@factura_bp.route('/facturas', methods=['PUT'])
def editar_factura():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkFactura = data.get('pkFactura')
        fechaFactura = data.get('fechaFactura')
        numeroAño = data.get('numeroAño')
        montoFactura = data.get('montoFactura')
        fechaVencimiento = data.get('fechaVencimiento')
        diasVencidos = data.get('diasVencidos')
        fechaPagado = data.get('fechaPagado')
        fkVenta = data.get('fkVenta')

        if FacturaController.editar_factura(pkFactura, fechaFactura, numeroAño, montoFactura, fechaVencimiento, diasVencidos, fechaPagado, fkVenta):
            return jsonify({'mensaje': 'Factura editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la factura'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@factura_bp.route('/facturas', methods=['DELETE'])
def eliminar_factura():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkFactura = data.get('pkFactura')

        if FacturaController.eliminar_factura(pkFactura):
            return jsonify({'mensaje': 'Factura eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la factura'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500