from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_administracionCF = Blueprint('web_administracionCF', __name__)

#RUTAS TEMPLATES
@web_administracionCF.route("/subir_reporte_metricas")
@rol_requerido('ADMINISTRACION CONTABLE Y FISCAL', 'DIRECCION GENERAL')
def analisis():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("reporte_metricas.html")