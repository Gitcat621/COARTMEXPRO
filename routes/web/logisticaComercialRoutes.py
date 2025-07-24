from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_logisticaComercial = Blueprint('web_logisticaComercial', __name__)

#RUTAS TEMPLATES
@web_logisticaComercial.route("/socios_comerciales")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def sociosComerciales():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("socios_comercialesLC.html")

@web_logisticaComercial.route("/lista_precios")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def listaPrecios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("lista_precios.html")

@web_logisticaComercial.route("/armar_lista_precios")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def armarListaPrecios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("armar_lista_precios.html")

@web_logisticaComercial.route("/rutas")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def rutas():
    if 'usuario' not in session:
        return redirect('/')
    
    empleado = session.get('empleado')
    return render_template("rutas.html", empleado=empleado)

@web_logisticaComercial.route("/visitas")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def visitas():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("visitas.html")

@web_logisticaComercial.route("/documentosLC")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def DocsLC():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("documentosLC.html")

@web_logisticaComercial.route("/vehiculos")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def vehiculos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("vehiculos.html")

@web_logisticaComercial.route("/servicios_vehiculo")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def serviciosVehiculo():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("servicios_vehiculo.html")

@web_logisticaComercial.route("/bitacora_envios")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def BitacoraEnvios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("bitacora_envios.html")

@web_logisticaComercial.route("/cajas")
@rol_requerido('LOGISTICA COMERCIAL', 'DIRECCION GENERAL')
def cajas():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("cajas.html")