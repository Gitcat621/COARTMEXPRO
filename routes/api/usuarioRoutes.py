from flask import Blueprint, request, jsonify, render_template, session
from models.usuario import Usuario

api_usuarios = Blueprint('api_usuarios', __name__) 

#RUTAS API
@api_usuarios.route('/', methods=['GET'])
def listar_usuarios():
    """Endpoint para obtener todos los usuarios"""
    usuarios = Usuario.listar_usuarios()
    return jsonify(usuarios), 200

@api_usuarios.route('/login', methods=['POST'])
def iniciar_sesion():
    """Endpoint para iniciar sesión de usuario."""
    data = request.get_json()  # Obtiene los datos JSON del cuerpo de la petición
    nombreUsuario = data.get('nombreUsuario')
    contrasena = data.get('contrasena')

    if not data or 'nombreUsuario' not in data or 'contrasena' not in data:
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    usuario = Usuario(nombreUsuario=nombreUsuario, contrasena=contrasena)

    if usuario.iniciar_sesion():
        session['usuario'] = usuario.nombreUsuario
        session['departamento'] = usuario.nombreDepartamento
        session['empleado'] = usuario.fkEmpleado 
        return jsonify({"mensaje": "Login exitoso"}), 200
    else:
        return jsonify({"mensaje": "Credenciales inválidas"}), 401

@api_usuarios.route('/', methods=['POST'])
def crear_usuario():
    """Endpoint para insertar un usuario"""
    data = request.json
    nombreUsuario = data.get('nombreUsuario')
    contrasena = data.get('contrasena')
    fkEmpleado = data.get('fkEmpleado') 

    if not nombreUsuario or not contrasena:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    usuario = Usuario(nombreUsuario=nombreUsuario, contrasena=contrasena, fkEmpleado=fkEmpleado)
    if usuario.crear_usuario():
        return jsonify({'mensaje': 'Usuario insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar usuario'}), 500

@api_usuarios.route('/', methods=['PUT'])
def editar_usuario():
    """Endpoint para editar un usuario"""
    try:
        data = request.json
        pkUsuario = int(data.get('pkUsuario')) 
        nombreUsuario = data.get('nombreUsuario')
        contrasena = data.get('contrasena')
        fkEmpleado = data.get('fkEmpleado') 

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkUsuario, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        # Validación de Nombre (que no esté vacío)
        if not nombreUsuario or not nombreUsuario.strip():
            return jsonify({'mensaje': 'El nombre es obligatorio'}), 400
        
        if not contrasena or not contrasena.strip():
            return jsonify({'mensaje': 'La contraseña es obligatorio'}), 400

        if not fkEmpleado or not fkEmpleado.strip():
            return jsonify({'mensaje': 'El ID del empleado es obligatorio'}), 400
        
        # Llamar al controlador para actualizar el usuario
        
        usuario = Usuario(pkUsuario=pkUsuario, nombreUsuario=nombreUsuario, contrasena=contrasena, fkEmpleado=fkEmpleado)
        if usuario.editar_usuario():
            return jsonify({'mensaje': 'Usuario editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el usuario'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@api_usuarios.route('/', methods=['DELETE'])
def eliminar_usuario():
    """Endpoint para editar un usuario"""
    try:
        data = request.json
        pkUsuario = int(data.get('pkUsuario')) 

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkUsuario, int):
            return jsonify({'mensaje': 'ID inválido'}), 400


        # Llamar al controlador para actualizar el usuario
        usuario = Usuario(pkUsuario=pkUsuario)
        if usuario.eliminar_usuario():
            return jsonify({'mensaje': 'Usuario eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el usuario'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500