from flask import Blueprint, request, jsonify
from models.analisis import Analisis

api_analisis = Blueprint('api_analisis', __name__)


#RUTAS DE ENDPOINTS
#Resumenes         
@api_analisis.route('/resumenes', methods=['GET'])
def listar_resumenAnalisis():
    """Endpoint para obtener todos los registros"""
    meses = request.args.getlist('items[]')  # Recibe como lista
    year = request.args.get('year')

    analisis = Analisis.listar_resumenAnalisis(meses, year)
    if analisis:
        return jsonify(analisis), 200 # Devuelve el analisis si la consulta es exitosa
    else:
        return jsonify({'mensaje': 'Error de servidor'}), 500  # Devuelve un error si la consulta no es exitosa

#Tablas
@api_analisis.route('/ingresos', methods=['GET'])
def listar_ingresos():

    grupo = request.args.get('grupo', default=0, type=int)  # Conversión directa
    year = request.args.get('year')

    try:
        grupo = int(grupo)
    except (TypeError, ValueError):
        grupo = 0

    if grupo == 0:
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

    ingresos = Analisis(foreingKey=grupo, fecha=year)
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
            data[socio][mes] += float(ingreso["totalFactura"])


        return jsonify(data), 200



    #return jsonify(analisis), 200

@api_analisis.route('/cuentas_por_pagar', methods=['GET'])
def listar_cuentasPorPagar():
    """Endpoint para obtener todos los registros"""
    analisis = Analisis.listar_cuentasPorPagar()
    return jsonify(analisis), 200

@api_analisis.route('/cuentas_por_cobrar', methods=['GET'])
def listar_cuentasPorCobrar():
    """Endpoint para obtener todos los registros"""
    analisis = Analisis.listar_cuentasPorCobrar()
    return jsonify(analisis), 200

@api_analisis.route('/servicio', methods=['GET'])
def listar_servicio(meses):
    """Endpoint para obtener todos los registros"""

    analisis = Analisis.listar_servicio(meses)
    return analisis

@api_analisis.route('/socios_en_ventas', methods=['GET'])
def listar_sociosEnVentas(meses, year):
    """Endpoint para obtener todos los registros"""

    analisis = Analisis.listar_sociosEnVentas(meses, year)
    return analisis

@api_analisis.route('/detalles', methods=['GET'])
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
@api_analisis.route('/top1', methods=['GET'])
def listar_top1(meses):
    """Endpoint para obtener todos los registros"""
    
    analisis = Analisis.listar_top1(meses)
    return analisis

@api_analisis.route('/top2', methods=['GET'])
def listar_top2(meses):
    """Endpoint para obtener todos los registros"""
    
    analisis = Analisis.listar_top2(meses)
    return analisis

@api_analisis.route('/top3', methods=['GET'])
def listar_top3(meses):
    """Endpoint para obtener todos los registros"""
    
    analisis = Analisis.listar_top3(meses)
    return analisis

@api_analisis.route('/tops', methods=['GET'])
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
@api_analisis.route('/grafica1', methods=['GET'])
def listar_grafica1(meses, grupo):
    """Endpoint para obtener todos los registros"""

    try:
        grupo = int(grupo)  # Intenta convertir grupo a entero
    except ValueError:
        grupo = 0  # Si falla, asigna 0

    foreingKey = f"gs.pkGrupoSocio = {grupo} AND" if grupo else ""

    analisis = Analisis.listar_grafica1(meses, foreingKey)
    return analisis

@api_analisis.route('/grafica2', methods=['GET'])
def listar_grafica2(meses):
    """Endpoint para obtener todos los registros"""

    analisis = Analisis.listar_grafica2(meses)
    return analisis

@api_analisis.route('/grafica3', methods=['GET'])
def listar_grafica3(meses):
    """Endpoint para obtener todos los registros"""

    analisis = Analisis.listar_grafica3(meses)
    return analisis

@api_analisis.route('/graficas', methods=['GET'])
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


