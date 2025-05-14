from flask import Blueprint, request, jsonify, render_template
from models.empleado import Empleado

empleado_bp = Blueprint('empleado_bp', __name__)

#Ruta endpoints
@empleado_bp.route('/empleados', methods=['GET'])
def listar_empleados():
    """Endpoint para obtener todos los registros"""
    empleados = Empleado.listar_empleados()
    return jsonify(empleados), 200

@empleado_bp.route('/empleado', methods=['GET'])
def otener_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_empleado()

    if resultado:
       return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500  # Devuelve un error si hay un error en el backend
    
@empleado_bp.route('/cursos_empleado', methods=['GET'])
def otener_cursos_empleado():
    """Endpoint para obtener todos los cursos de un empleado."""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not numeroEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    empleado = Empleado(numeroEmpleado=numeroEmpleado)
    resultado = empleado.otener_cursos_empleado()

    # Asegura que se devuelva una lista vacía si no hay resultados
    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500

    
@empleado_bp.route('/permisos_empleado', methods=['GET'])
def otener_permisos_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_permisos_empleado()

    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500
    
@empleado_bp.route('/oportunidades_empleado', methods=['GET'])
def otener_oportunidades_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_oportunidades_empleado()

    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500

@empleado_bp.route('/empleados', methods=['POST'])
def crear_empleado():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroEmpleado = data.get('numeroEmpleado')
    rfc = data.get('rfc')
    nombreEmpleado = data.get('nombreEmpleado')
    fechaIngreso = data.get('fechaIngreso')
    fechaNacimiento = data.get('fechaNacimiento')
    nomina = data.get('nomina')
    vale = data.get('vale')
    estado = data.get('estado')
    fkPuesto = data.get('fkPuesto')
    fkNivelEstudio = data.get('fkNivelEstudio')
    fkUbicacion = data.get('fkUbicacion')

    if not nombreEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    empleado = Empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion)
    if empleado.crear_empleado():
        return jsonify({'mensaje': 'Empleado insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar empleado'}), 500
    
@empleado_bp.route('/colaborador', methods=['POST'])
def crear_colaborador():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroEmpleado = data.get('numeroEmpleado')
    rfc = None
    nombreEmpleado = data.get('nombreEmpleado')
    fechaIngreso = data.get('fechaIngreso')
    fechaNacimiento = None
    nomina = data.get('nomina')
    vale = data.get('vale')
    estado = data.get('estado')
    fkPuesto = data.get('fkPuesto')
    fkNivelEstudio = None
    fkUbicacion = None

    if not nombreEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    empleado = Empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion)
    if empleado.crear_empleado():
        return jsonify({'mensaje': 'Empleado insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar empleado'}), 500

@empleado_bp.route('/empleados', methods=['PUT'])
def editar_empleado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        numeroEmpleado = data.get('numeroEmpleado')
        rfc = data.get('rfc')
        nombreEmpleado = data.get('nombreEmpleado')
        fechaIngreso = data.get('fechaIngreso')
        fechaNacimiento = data.get('fechaNacimiento')
        nomina = data.get('nomina')
        vale = data.get('vale')
        estado = data.get('estado')
        fkPuesto = data.get('fkPuesto')
        fkNivelEstudio = data.get('fkNivelEstudio')
        fkUbicacion = data.get('fkUbicacion')

        # # Validación de ID (debe ser un número entero)
        # if not isinstance(id, int):
        #     return jsonify({'mensaje': 'ID inválido'}), 400

        # # Validación de Nombre (que no esté vacío)
        # if not nombre or not nombre.strip():
        #     return jsonify({'mensaje': 'El nombre es obligatorio'}), 400

        # Llamar al controlador para actualizar el registro
        empleado = Empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion)
        if empleado.editar_empleado():
            return jsonify({'mensaje': 'Empleado editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el empleado'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@empleado_bp.route('/empleados', methods=['DELETE'])
def eliminar_empleado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        numeroEmpleado = data.get('numeroEmpleado')

        # # Validación de ID (debe ser un número entero)
        # if not isinstance(id, int):
        #     return jsonify({'mensaje': 'ID inválido'}), 400


        # Llamar al controlador para actualizar el registro
        empleado = Empleado(numeroEmpleado)
        if empleado.eliminar_empleado():
            return jsonify({'mensaje': 'Empleado eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el empleado'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500