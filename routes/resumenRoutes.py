from flask import Blueprint, request, jsonify, render_template
from controllers.resumenController import ResumenController

resumen_bp = Blueprint('resumen_bp', __name__)

#RUTAS DE ENDPOINTS
#Resumenes         
@resumen_bp.route('/resumenes', methods=['GET'])
def listar_resumenAnalisis():
    """Endpoint para obtener todos los registros"""
    meses = request.args.getlist('items[]')  # Recibe como lista
    year = request.args.get('year')

    resumen = ResumenController.listar_resumenAnalisis(meses, year)
    if resumen:
        return jsonify(resumen), 200 # Devuelve el analisis si la consulta es exitosa
    else:
        return jsonify({'mensaje': 'Error de servidor'}), 500  # Devuelve un error si la consulta no es exitosa


#Tablas
@resumen_bp.route('/ingresos', methods=['GET'])
def listar_ingresos():
    filtro = request.args.get('foreingKey', default=0, type=int)  # Conversión directa
    fecha = request.args.get('fecha')

    data = {}
    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    ingresos = ResumenController.listar_ingresos(filtro, fecha)

    if filtro == 621:
        return jsonify(ingresos), 200
    else:
        for ingreso in ingresos:
            mes = meses_es[ingreso["fechaFactura"].strftime("%B")]
            socio = ingreso["nombreSocio"] or "SIN SOCIO"

            data.setdefault(socio, {m: 0 for m in meses_es.values()})  # Inicializar estructura
            data[socio][mes] += int(ingreso["totalFactura"])

        return jsonify(data), 200



    #return jsonify(resumen), 200

@resumen_bp.route('/ventas', methods=['GET'])
def listar_ventas():
    filtro = request.args.get('foreingKey')
    fecha = request.args.get('fecha')

    try:
        filtro = int(filtro) if filtro else None
    except ValueError:
        filtro = None

    data = {}

    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    ventas = ResumenController.listar_ventas(filtro, fecha)

    if filtro == 621:
        return jsonify(ventas), 200
    else:
        for venta in ventas:
            # mes_en = venta["fechaOrdenCompra"].strftime("%B")
            mes_en = venta["fechaVenta"].strftime("%B")
            mes = meses_es[mes_en]
            socio = venta["nombreSocio"] or "SIN SOCIO"

            if socio not in data:
                data[socio] = {m: 0 for m in meses_es.values()}

            #data[socio][mes] += int(venta["totalVenta"])
            data[socio][mes] += int(venta["montoVenta"])

        return jsonify(data), 200

@resumen_bp.route('/cuentasPorPagar', methods=['GET'])
def listar_cuentasPorPagar():
    """Endpoint para obtener todos los registros"""
    resumen = ResumenController.listar_cuentasPorPagar()
    return jsonify(resumen), 200

@resumen_bp.route('/cuentasPorCobrar', methods=['GET'])
def listar_cuentasPorCobrar():
    """Endpoint para obtener todos los registros"""
    resumen = ResumenController.listar_cuentasPorCobrar()
    return jsonify(resumen), 200

@resumen_bp.route('/servicio', methods=['GET'])
def listar_servicio():
    """Endpoint para obtener todos los registros"""

    items = request.args.getlist('items[]')  # Recibe como lista
    resumen = ResumenController.listar_servicio(items)
    return jsonify(resumen), 200

#Tops
@resumen_bp.route('/top1', methods=['GET'])
def listar_top1(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = ResumenController.listar_top1(meses)
    return resumen

@resumen_bp.route('/top2', methods=['GET'])
def listar_top2(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = ResumenController.listar_top2(meses)
    return resumen

@resumen_bp.route('/top3', methods=['GET'])
def listar_top3(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = ResumenController.listar_top3(meses)
    return resumen

@resumen_bp.route('/top4', methods=['GET'])
def listar_top4(meses):
    """Endpoint para obtener todos los registros"""
    
    resumen = ResumenController.listar_top4(meses)
    return resumen

@resumen_bp.route('/tops', methods=['GET'])
def obtener_todos_los_tops():
    meses = request.args.getlist('items[]')  # Recibe como lista
    
    top1 = listar_top1(meses)
    top2 = listar_top2(meses)
    top3 = listar_top3(meses)
    top4 = listar_top4(meses)

    
    return jsonify({
        'top1': top1,
        'top2': top2,
        'top3': top3,
        'top4': top4
    })


#Graficas
@resumen_bp.route('/grafica1', methods=['GET'])
def listar_grafica1(meses, grupo):
    """Endpoint para obtener todos los registros"""

    resumen = ResumenController.listar_grafica1(meses, grupo)
    return resumen

@resumen_bp.route('/grafica2', methods=['GET'])
def listar_grafica2(meses):
    """Endpoint para obtener todos los registros"""

    resumen = ResumenController.listar_grafica2(meses)
    return resumen

@resumen_bp.route('/grafica3', methods=['GET'])
def listar_grafica3(meses):
    """Endpoint para obtener todos los registros"""

    resumen = ResumenController.listar_grafica3(meses)
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