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
    
#### OBTENER TABLAS RELACIONADAS #####

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
    
@empleado_bp.route('/oportunidad_empleado', methods=['GET'])
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
    
@empleado_bp.route('/prestamos_empleado', methods=['GET'])
def otener_prestamos_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_prestamos_empleado()

    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500

@empleado_bp.route('/serviciosPac_empleado', methods=['GET'])
def otener_serviciosPac_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_serviciosPac_empleado()

    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500
    
@empleado_bp.route('/reunionesIntegracion_empleado', methods=['GET'])
def otener_reunionesIntegracion_empleado():
    """Endpoint para obtener todos los registros"""
    numeroEmpleado = request.args.get('numeroEmpleado')

    if not 'numeroEmpleado':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos


    empleado = Empleado(numeroEmpleado=numeroEmpleado)

    resultado = empleado.otener_reunionesIntegracion_empleado()

    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500

#### CREAR TABLAS RELACIONADAS #####

@empleado_bp.route('/asistencia_cursos', methods=['POST'])
def crear_asistencia_curso():
    """Endpoint para insertar un registro"""
    data = request.json

    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fkCurso = int(data.get('fkCurso'))
    fechaAsistencia = str(data.get('fechaAsistencia', '')).strip()

    if not fechaAsistencia:
        return jsonify({'mensaje': 'Faltan datos'}), 200

    if Empleado.crear_asistencia_curso(fkEmpleado, fkCurso, fechaAsistencia):
        return jsonify({'mensaje': 'Curso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar curso'}), 500
    
@empleado_bp.route('/oportunidad_empleado', methods=['POST'])
def crear_oportunidad_empleado():
    """Endpoint para insertar un registro"""
    data = request.json

    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fkOportunidad = int(data.get('fkOportunidad'))

    if Empleado.crear_oportunidad_empleado(fkEmpleado, fkOportunidad):
        return jsonify({'mensaje': 'Curso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar oportunidad'}), 500

@empleado_bp.route('/reunionesIntegracion_empleado', methods=['POST'])
def crear_reunionIntegracion_empleado():
    """Endpoint para insertar un registro"""
    data = request.json
    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fechaIngreso = data.get('fechaAsistencia')

    if Empleado.crear_reunionIntegracion_empleado(fechaIngreso, fkEmpleado):
        return jsonify({'mensaje': 'Curso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar oportunidad'}), 500 
    

#### EDITAR TABLAS RELACIONADAS #####

@empleado_bp.route('/asistencia_cursos', methods=['PUT'])
def editar_asistencia_curso():
    """Endpoint para insertar un registro"""
    data = request.json

    pkAsistenciaCurso = data.get('pkAsistenciaCurso')
    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fkCurso = int(data.get('fkCurso'))
    fechaAsistencia = str(data.get('fechaAsistencia', '')).strip()

    if not pkAsistenciaCurso or not fechaAsistencia or not fkEmpleado or not fkCurso:
        return jsonify({'mensaje': 'Faltan datos'}), 200

    if Empleado.editar_asistencia_curso(fkEmpleado, fkCurso, fechaAsistencia, pkAsistenciaCurso):
        return jsonify({'mensaje': 'Curso editado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al editar curso'}), 500
    
@empleado_bp.route('/oportunidad_empleado', methods=['PUT'])
def editar_oportunidad_empleado():
    """Endpoint para insertar un registro"""
    data = request.json
    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fkOportunidadAnterior = int(data.get('fkOportunidadAnterior'))
    fkOportunidadNueva = int(data.get('fkOportunidadNueva'))

    if Empleado.editar_oportunidad_empleado(fkEmpleado, fkOportunidadAnterior, fkOportunidadNueva):
        return jsonify({'mensaje': 'oportunidad editada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al editar oportunidad'}), 500
    
@empleado_bp.route('/reunionesIntegracion_empleado', methods=['PUT'])
def editar_reunionIntegracion_empleado():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaAsistencia = str(data.get('fechaAsistencia', '')).strip()
    pkReunionIntegracion = int(data.get('pkReunionIntegracion'))

    if Empleado.editar_reunionIntegracion_empleado(fechaAsistencia, pkReunionIntegracion):
        return jsonify({'mensaje': 'oportunidad editada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al editar oportunidad'}), 500

#### ELIMINAR TABLAS RELACIONADAS #####

@empleado_bp.route('/cursos_empleado', methods=['DELETE'])
def eliminar_curso_empleado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkAsistenciaCurso = data.get('pkAsistenciaCurso')

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkAsistenciaCurso, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        # Llamar al controlador para actualizar el registro
        #ESTO FUNCIONA ASI // NO SERIALIZA EN EL JSONIFY
        if Empleado.eliminar_curso_empleado(pkAsistenciaCurso):
            return jsonify({'mensaje': 'Asistencia eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la asistencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@empleado_bp.route('/oportunidad_empleado', methods=['DELETE'])
def eliminar_oportunidad_empleado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        fkOportunidad = int(data.get('fkOportunidad'))
        fkEmpleado = data.get('fkEmpleado')

        # Validación de ID (debe ser un número entero)
        if not isinstance(fkOportunidad, int):
            return jsonify({'mensaje': 'ID inválido'}), 400
        
        if not isinstance(fkEmpleado, str):
            return jsonify({'mensaje': 'ID inválido'}), 400

        # Llamar al controlador para actualizar el registro
        #ESTO FUNCIONA ASI // NO SERIALIZA EN EL JSONIFY
        if Empleado.eliminar_oportunidad_empleado(fkOportunidad,fkEmpleado):
            return jsonify({'mensaje': 'Oportunidad eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la oportunidad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@empleado_bp.route('/reunionesIntegracion_empleado', methods=['DELETE'])
def eliminar_reunionIntegracion_empleado():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkReunionIntegracion = int(data.get('pkReunionIntegracion'))

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkReunionIntegracion, int):
            return jsonify({'mensaje': 'ID inválido'}), 400


        # Llamar al controlador para actualizar el registro
        #ESTO FUNCIONA ASI // NO SERIALIZA EN EL JSONIFY
        if Empleado.eliminar_reunionIntegracion_empleado(pkReunionIntegracion):
            return jsonify({'mensaje': 'Oportunidad eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la oportunidad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500