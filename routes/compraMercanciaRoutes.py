from flask import Blueprint, request, jsonify
from controllers.compraMercanciaController import CompraMercanciaController

compraMercancia_bp = Blueprint('compraMercancia_bp', __name__)

@compraMercancia_bp.route('/comprasMercancia', methods=['GET'])
def listar_compras():
    """Endpoint para obtener todos los registros"""
    filtro = request.args.get('foreingKey')
    fecha = request.args.get('fecha')

    data = {}
    
    # Diccionario para traducir meses de inglés a español
    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }
    compras = CompraMercanciaController.listar_compras(fecha)
    for compra in compras:
        mes_en = compra["fechaMercancia"].strftime("%B")  # Nombre del mes en inglés
        mes = meses_es[mes_en]  # Convertir al español
        socio = compra["nombreProveedor"]

        if socio not in data:
            data[socio] = {m: 0 for m in meses_es.values()}  # Usar los nombres en español

        data[socio][mes] += int(compra["montoMercancia"])

    return jsonify(data), 200
    #return jsonify(compras), 200

@compraMercancia_bp.route('/comprasMercancia', methods=['POST'])
def crear_compra():
    """Endpoint para insertar un registro"""
    data = request.json
    montoMercancia = data.get('montoMercancia')
    fechaMercancia = data.get('fechaMercancia')
    fkProveedor = data.get('fkProveedor')

    if not isinstance(montoMercancia, float):
        return jsonify({'mensaje': 'montoMercancia debe ser un número decimal'}), 400

    if not isinstance(fechaMercancia, str):
        return jsonify({'mensaje': 'fechaMercancia debe ser una cadena de texto'}), 400

    if not isinstance(fkProveedor, int):
        return jsonify({'mensaje': 'fkProveedor debe ser un entero'}), 400

    if not montoMercancia or not fechaMercancia or not fkProveedor:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if CompraMercanciaController.crear_compra(montoMercancia, fechaMercancia, fkProveedor):
        return jsonify({'mensaje': 'Compra de mercancía insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar compra de mercancía'}), 500

@compraMercancia_bp.route('/comprasMercancia', methods=['PUT'])
def editar_compra():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCompraMercancia = data.get('pkCompraMercancia')
        montoMercancia = data.get('montoMercancia')
        fechaMercancia = data.get('fechaMercancia')
        fkProveedor = data.get('fkProveedor')

        if CompraMercanciaController.editar_compra(pkCompraMercancia, montoMercancia, fechaMercancia, fkProveedor):
            return jsonify({'mensaje': 'Compra de mercancía editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la compra de mercancía'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@compraMercancia_bp.route('/comprasMercancia', methods=['DELETE'])
def eliminar_compra():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCompraMercancia = data.get('pkCompraMercancia')

        if CompraMercanciaController.eliminar_compra(pkCompraMercancia):
            return jsonify({'mensaje': 'Compra de mercancía eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la compra de mercancía'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500