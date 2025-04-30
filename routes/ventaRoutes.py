from flask import Blueprint, request, jsonify
from models.venta import Venta

venta_bp = Blueprint('venta_bp', __name__)

@venta_bp.route('/ventas', methods=['GET'])
def listar_ventas():
    
    grupo = request.args.get('grupo')
    year = request.args.get('year')

    try:
        grupo = int(grupo) if grupo else None
    except ValueError:
        grupo = None

    data = {}

    meses_es = {
        "January": "Enero", "February": "Febrero", "March": "Marzo",
        "April": "Abril", "May": "Mayo", "June": "Junio",
        "July": "Julio", "August": "Agosto", "September": "Septiembre",
        "October": "Octubre", "November": "Noviembre", "December": "Diciembre"
    }

    ventas = Venta(fkSocioComercial=grupo, fechaVenta=year)
    ventas = ventas.listar_ventas()

    if grupo == None:
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

