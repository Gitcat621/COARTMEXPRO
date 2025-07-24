from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_sistemas = Blueprint('web_sistemas', __name__)

#RUTAS TEMPLATES
@web_sistemas.route("/departamentos")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def departamentos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("departamentos.html")

@web_sistemas.route("/cursos")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def cursos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("cursos.html")

@web_sistemas.route("/beneficios")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def beneficios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("beneficios.html")

@web_sistemas.route("/empleados")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def empleados():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("empleados.html")

@web_sistemas.route("/usuarios")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def usuarios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("usuarios.html")

@web_sistemas.route("/proveedores")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def proveedores():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("proveedores.html")

@web_sistemas.route("/socios_comerciales")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def sociosComerciales():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("socios_comerciales.html")

@web_sistemas.route("/articulos")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def articulos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("articulos.html")

@web_sistemas.route("/ubicaciones")
@rol_requerido('SISTEMAS', 'DIRECCION GENERAL')
def ubicaciones():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("ubicaciones.html")