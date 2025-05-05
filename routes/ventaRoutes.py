from flask import Blueprint, request, jsonify
from models.venta import Venta

venta_bp = Blueprint('venta_bp', __name__)

@venta_bp.route('/ventas', methods=['GET'])
def listar_ventas():
    
    #Obtenemos los valores en el URL de la peticion
    grupo = request.args.get('grupo')
    year = request.args.get('year')

    #Convertimos a INT
    try:
        grupo = int(grupo) if grupo else None
    except ValueError:
        grupo = None

    #Inicializamos variables
    ventaPorMes = {}

    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    #Instanciamos el objeto venta y llamamos a la funcion para obtener las ventas
    ventas = Venta(fkSocioComercial=grupo, fechaVenta=year)
    ventas = ventas.listar_ventas()

    #Formateamos la respuesta respecto al tipo de peticion hecha
    if grupo == None:
        return jsonify(ventas), 200
    else:
        for venta in ventas:
            mes_en = venta["fechaVenta"].strftime("%B")
            mes = meses_es[mes_en]
            socio = venta["nombreSocio"] or "SIN SOCIO"

            if socio not in ventaPorMes:
                ventaPorMes[socio] = {m: 0 for m in meses_es.values()}

            ventaPorMes[socio][mes] += int(venta["montoVenta"])

        return jsonify(ventaPorMes), 200

