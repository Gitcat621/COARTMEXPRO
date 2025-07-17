from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_analisis = Blueprint('web_analisis', __name__)

#RUTAS TEMPLATES
@web_analisis.route("/general")
@rol_requerido('Sistemas', 'Administrador')
def analisis():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("analisis_general.html")

@web_analisis.route("/graficas")
@rol_requerido('Sistemas', 'Administrador')
def analisisGraficas():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("analisis_graficas.html")

@web_analisis.route("/tablas")
@rol_requerido('Sistemas', 'Administrador')
def analisisTablas():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("analisis_tablas.html")

@web_analisis.route("/anio")
@rol_requerido('Sistemas', 'Administrador')
def analisisAnio():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("analisis_anio.html")

@web_analisis.route("/mes")
@rol_requerido('Sistemas', 'Administrador')
def analisisMes():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("analisis_mes.html")