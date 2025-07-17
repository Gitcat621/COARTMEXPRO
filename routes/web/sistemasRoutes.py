from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido


web_sistemas = Blueprint('web_sistemas', __name__)

#RUTAS TEMPLATES
@web_sistemas.route("/departamentos")
@rol_requerido('Sistemas', 'Administrador')
def departamentos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("departamentos.html")

@web_sistemas.route("/cursos")
@rol_requerido('Sistemas', 'Administrador')
def cursos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("cursos.html")

@web_sistemas.route("/beneficios")
@rol_requerido('Sistemas', 'Administrador')
def beneficios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("beneficios.html")

@web_sistemas.route("/empleados")
@rol_requerido('Sistemas', 'Administrador')
def empleados():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("empleados.html")

@web_sistemas.route("/usuarios")
@rol_requerido('Sistemas', 'Administrador')
def usuarios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("usuarios.html")

@web_sistemas.route("/proveedores")
@rol_requerido('Sistemas', 'Administrador')
def proveedores():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("proveedores.html")

@web_sistemas.route("/socios_comerciales")
@rol_requerido('Sistemas', 'Administrador')
def sociosComerciales():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("socios_comerciales.html")

@web_sistemas.route("/articulos")
@rol_requerido('Sistemas', 'Administrador')
def articulos():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("articulos.html")

@web_sistemas.route("/ubicaciones")
@rol_requerido('Sistemas', 'Administrador')
def ubicaciones():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("ubicaciones.html")