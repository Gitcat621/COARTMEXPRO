from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido

web_recursosHumanos = Blueprint('web_recursosHumanos', __name__)

#RUTAS TEMPLATES
@web_recursosHumanos.route("/perfiles")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def perfiles():
    return render_template("perfiles_puesto.html")

@web_recursosHumanos.route("/puesto_reabastecimiento")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto1():
    return render_template("puesto_reabastecimiento.html")

@web_recursosHumanos.route("/puesto_jefeAdministrativo")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto2():
    return render_template("puesto_jefeAdministrativo.html")

@web_recursosHumanos.route("/puesto_AdmonContable")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto3():
    return render_template("puesto_AdmonContable.html")

@web_recursosHumanos.route("/puesto_preparadorPedidos")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto4():
    return render_template("puesto_preparadorPedidos.html")

@web_recursosHumanos.route("/puesto_jrMKT")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto5():
    return render_template("puesto_jrMKT.html")

@web_recursosHumanos.route("/puesto_agenteVentas")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def puesto6():
    return render_template("puesto_agenteVentas.html")

@web_recursosHumanos.route("/colaboradores")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def colaboradores():
    return render_template("colaboradores.html")

@web_recursosHumanos.route("/perfil")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def perfil():
    return render_template("perfil.html")

@web_recursosHumanos.route("/reloj_checador")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def relojChecador():
    return render_template("reloj_checador.html")

@web_recursosHumanos.route("/datos_rh")
@rol_requerido('RECURSOS HUMANOS', 'DIRECCION GENERAL')
def datosRH():
    return render_template("datos_rh.html")