from flask import Blueprint, request, jsonify, render_template
from flask_cors import cross_origin
from controllers.usuarioController import UsuarioController
import re

usuario_bp = Blueprint('usuario_bp', __name__)

#Rutas endpoints
@usuario_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    """Endpoint para obtener todos los usuarios"""
    usuarios = UsuarioController.listar_usuarios()
    return jsonify(usuarios), 200

@usuario_bp.route('/usuarios/login', methods=['POST'])
def iniciar_sesion():
    """Endpoint para iniciar sesión de usuario."""
    data = request.get_json()  # Obtiene los datos JSON del cuerpo de la petición
    nombreUsuario = data.get('nombreUsuario')
    contrasena = data.get('contrasena')

    # if not datos or 'nombreUsuario' not in datos or 'contrasena' not in datos:
    #     return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    usuario = UsuarioController.iniciar_sesion(nombreUsuario, contrasena)

    if usuario:
        return jsonify(usuario), 200  # Devuelve los datos del usuario si el inicio de sesión es exitoso
    else:
        return jsonify({'mensaje': 'Credenciales inválidas'}), 401  # Devuelve un error si las credenciales son inválidas

@usuario_bp.route('/usuarios', methods=['POST'])
def crear_usuario():
    """Endpoint para insertar un usuario"""
    data = request.json
    nombreUsuario = data.get('nombreUsuario')
    contrasena = data.get('contrasena')
    fkEmpleado = data.get('fkEmpleado')
    print(data)

    if not nombreUsuario or not contrasena:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    if UsuarioController.crear_usuario(nombreUsuario, contrasena, fkEmpleado):
        return jsonify({'mensaje': 'Usuario insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar usuario'}), 500

@usuario_bp.route('/usuarios', methods=['PUT'])
def editar_usuario():
    """Endpoint para editar un usuario"""
    try:
        data = request.json
        pkUsuario = data.get('pkUsuario')
        nombreUsuario = data.get('nombreUsuario')
        contrasena = data.get('contrasena')
        fkEmpleado = data.get('fkEmpleado')

        # # Validación de ID (debe ser un número entero)
        # if not isinstance(id, int):
        #     return jsonify({'mensaje': 'ID inválido'}), 400

        # # Validación de Nombre (que no esté vacío)
        # if not nombre or not nombre.strip():
        #     return jsonify({'mensaje': 'El nombre es obligatorio'}), 400

        # Validación de Correo (expresión regular para emails)
        # email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        # if not correo or not re.match(email_regex, correo):
        #     return jsonify({'mensaje': 'Correo inválido'}), 400

        # Llamar al controlador para actualizar el usuario
        if UsuarioController.editar_usuario(pkUsuario, nombreUsuario, contrasena, fkEmpleado):
            return jsonify({'mensaje': 'Usuario editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el usuario'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@usuario_bp.route('/usuarios', methods=['DELETE'])
def eliminar_usuario():
    """Endpoint para editar un usuario"""
    try:
        data = request.json
        pkUsuario = data.get('pkUsuario')

        # # Validación de ID (debe ser un número entero)
        # if not isinstance(id, int):
        #     return jsonify({'mensaje': 'ID inválido'}), 400


        # Llamar al controlador para actualizar el usuario
        if UsuarioController.eliminar_usuario(pkUsuario):
            return jsonify({'mensaje': 'Usuario eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el usuario'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500