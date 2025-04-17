from flask import Blueprint, request, jsonify
from controllers.gastoController import GastoController

gasto_bp = Blueprint('gasto_bp', __name__)

@gasto_bp.route('/gastosFiltro', methods=['GET'])
def listar_gastos():
    """Endpoint para obtener todos los registros"""
    
    filtro = request.args.get('foreingKey')
    fecha = request.args.get('fecha')

    # Convertir filtro a entero para asegurar que sea un número
    try:
        filtro = int(filtro)  # Convierte el valor de foreingKey a un número
    except ValueError:
        filtro = 0  # Si no puede convertirse, se asigna el valor 0

    data = {}

    # Diccionario para traducir meses de inglés a español
    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    gastos = GastoController.listar_gastos(filtro,fecha)

    for gasto in gastos:
        mes_en = gasto["fechaGasto"].strftime("%B")  # Nombre del mes en inglés
        mes = meses_es.get(mes_en, "Desconocido")  # Convertir al español
        motivo = gasto["nombreMotivoGasto"]

        if motivo not in data:
            data[motivo] = {m: 0 for m in meses_es.values()}  # Usar nombres en español

        data[motivo][mes] += int(gasto["montoGasto"])

    return jsonify(data), 200


    #return jsonify(gastos), 200

@gasto_bp.route('/gastos', methods=['POST'])
def crear_gasto():
    """Endpoint para insertar un registro"""
    data = request.json
    montoGasto = data.get('montoGasto')
    fechaGasto = data.get('fechaGasto')
    fkMotivoGasto = data.get('fkMotivoGasto')

    if not isinstance(montoGasto, float):
        return jsonify({'mensaje': 'montoGasto debe ser un número decimal'}), 400

    if not isinstance(fechaGasto, str):
        return jsonify({'mensaje': 'fechaGasto debe ser una cadena de texto'}), 400

    if not isinstance(fkMotivoGasto, int):
        return jsonify({'mensaje': 'fkMotivoGasto debe ser un entero'}), 400

    if not montoGasto or not fechaGasto or not fkMotivoGasto:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if GastoController.crear_gasto(montoGasto, fechaGasto, fkMotivoGasto):
        return jsonify({'mensaje': 'Gasto insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar gasto'}), 500

@gasto_bp.route('/gastos', methods=['PUT'])
def editar_gasto():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkGasto = data.get('pkGasto')
        montoGasto = data.get('montoGasto')
        fechaGasto = data.get('fechaGasto')
        fkMotivoGasto = data.get('fkMotivoGasto')

        if GastoController.editar_gasto(pkGasto, montoGasto, fechaGasto, fkMotivoGasto):
            return jsonify({'mensaje': 'Gasto editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@gasto_bp.route('/gastos', methods=['DELETE'])
def eliminar_gasto():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkGasto = data.get('pkGasto')

        if GastoController.eliminar_gasto(pkGasto):
            return jsonify({'mensaje': 'Gasto eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el gasto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500