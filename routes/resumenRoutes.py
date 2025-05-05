from flask import Blueprint, request, jsonify, render_template
from models.resumen import Resumen

resumen_bp = Blueprint('resumen_bp', __name__)

#RUTAS DE ENDPOINTS
#Resumenes         
@resumen_bp.route('/resumenes', methods=['GET'])
def listar_resumenAnalisis():
    """Endpoint para obtener todos los registros"""
    meses = request.args.getlist('items[]')  # Recibe como lista
    year = request.args.get('year')

    resumen = Resumen.listar_resumenAnalisis(meses, year)
    if resumen:
        return jsonify(resumen), 200 # Devuelve el analisis si la consulta es exitosa
    else:
        return jsonify({'mensaje': 'Error de servidor'}), 500  # Devuelve un error si la consulta no es exitosa


#Tablas
@resumen_bp.route('/ingresos', methods=['GET'])
def listar_ingresos():

    grupo = request.args.get('grupo', default=0, type=int)  # Conversión directa
    year = request.args.get('year')

    try:
        grupo = int(grupo)
    except (TypeError, ValueError):
        grupo = 0

    if grupo is 0:
        grupo = ""
    else:
        grupo = f"AND gs.pkGrupoSocio = {grupo}"

    data = {}
    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    ingresos = Resumen(foreingKey=grupo, fecha=year)
    ingresos = ingresos.listar_ingresos()

    if grupo == None:
        return jsonify(ingresos), 200
    else:
        for ingreso in ingresos:
            if ingreso["fechaPagado"] is None:
                continue  # Saltar si no hay fecha

            mes = meses_es[ingreso["fechaPagado"].strftime("%B")]
            socio = ingreso["nombreSocio"] or "SIN SOCIO"

            data.setdefault(socio, {m: 0 for m in meses_es.values()})
            data[socio][mes] += int(ingreso["totalFactura"])


        return jsonify(data), 200



    #return jsonify(resumen), 200

@resumen_bp.route('/cuentasPorPagar', methods=['GET'])
def listar_cuentasPorPagar():
    """Endpoint para obtener todos los registros"""
    resumen = Resumen.listar_cuentasPorPagar()
    return jsonify(resumen), 200

@resumen_bp.route('/cuentasPorCobrar', methods=['GET'])
def listar_cuentasPorCobrar():
    """Endpoint para obtener todos los registros"""
    resumen = Resumen.listar_cuentasPorCobrar()
    return jsonify(resumen), 200

@resumen_bp.route('/servicio', methods=['GET'])
def listar_servicio(meses):
    """Endpoint para obtener todos los registros"""

    resumen = Resumen.listar_servicio(meses)
    return resumen

@resumen_bp.route('/sociosEnVentas', methods=['GET'])
def listar_sociosEnVentas(meses, year):
    """Endpoint para obtener todos los registros"""

    resumen = Resumen.listar_sociosEnVentas(meses, year)
    return resumen

@resumen_bp.route('/detalles', methods=['GET'])
def obtener_detalles():
    
    meses = request.args.getlist('items[]')  # Recibe como lista
    year = request.args.get('year')

    servicio = listar_servicio(meses)
    sociosEnVentas = listar_sociosEnVentas(meses, year)

    
    return jsonify({
        'servicio': servicio,
        'sociosEnVentas': sociosEnVentas,
    })

#Tops
@resumen_bp.route('/top1', methods=['GET'])
def listar_top1(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = Resumen.listar_top1(meses)
    return resumen

@resumen_bp.route('/top2', methods=['GET'])
def listar_top2(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = Resumen.listar_top2(meses)
    return resumen

@resumen_bp.route('/top3', methods=['GET'])
def listar_top3(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = Resumen.listar_top3(meses)
    return resumen

@resumen_bp.route('/tops', methods=['GET'])
def obtener_todos_los_tops():
    meses = request.args.getlist('items[]')  # Recibe como lista
    
    top1 = listar_top1(meses)
    top2 = listar_top2(meses)
    top3 = listar_top3(meses)

    
    return jsonify({
        'top1': top1,
        'top2': top2,
        'top3': top3,
    })


#Graficas
@resumen_bp.route('/grafica1', methods=['GET'])
def listar_grafica1(meses, grupo):
    """Endpoint para obtener todos los registros"""

    try:
        grupo = int(grupo)  # Intenta convertir grupo a entero
    except ValueError:
        grupo = 0  # Si falla, asigna 0

    foreingKey = f"gs.pkGrupoSocio = {grupo} AND" if grupo else ""

    resumen = Resumen.listar_grafica1(meses, foreingKey)
    return resumen

@resumen_bp.route('/grafica2', methods=['GET'])
def listar_grafica2(meses):
    """Endpoint para obtener todos los registros"""

    resumen = Resumen.listar_grafica2(meses)
    return resumen

@resumen_bp.route('/grafica3', methods=['GET'])
def listar_grafica3(meses):
    """Endpoint para obtener todos los registros"""

    resumen = Resumen.listar_grafica3(meses)
    return resumen

@resumen_bp.route('/graficas', methods=['GET'])
def obtener_todos_las_graficas():
    meses = request.args.getlist('items[]')  # Recibe como lista
    grupo = request.args.get('grupo')

    grafica1 = listar_grafica1(meses, grupo)
    grafica2 = listar_grafica2(meses)
    grafica3 = listar_grafica3(meses)

    
    return jsonify({
        'grafica1': grafica1,
        'grafica2': grafica2,
        'grafica3': grafica3,
    })