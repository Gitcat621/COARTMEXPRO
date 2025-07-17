from flask import Blueprint, render_template, redirect, session
from utils.decoradores import rol_requerido

web_usuarios = Blueprint('web_usuario', __name__)

#RUTAS TEMPLATES
@web_usuarios.route("/")
@rol_requerido('Sistemas', 'Administrador')
def home_usuarios():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template("usuarios.html")