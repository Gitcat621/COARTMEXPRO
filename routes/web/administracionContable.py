from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_administracionContable = Blueprint('web_administracionContable', __name__)

#RUTAS TEMPLATES
@web_administracionContable.route("/rutas_entrega")
@rol_requerido('Sistemas', 'Administrador')
def rutasEntrega():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("rutas_entrega.html")

@web_administracionContable.route("/cuentas_por_cobrar")
@rol_requerido('Sistemas', 'Administrador')
def cxc():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("cuentas_por_cobrar.html")

@web_administracionContable.route("/cuentas_por_pagar")
@rol_requerido('Sistemas', 'Administrador')
def cxp():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("cuentas_por_pagar.html")

@web_administracionContable.route("/constancia_situacion_fiscal")
@rol_requerido('Sistemas', 'Administrador')
def csf():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("constancia_situacion_fiscal.html")