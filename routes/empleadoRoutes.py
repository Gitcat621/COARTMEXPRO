from flask import Blueprint, request, jsonify, render_template
from models.empleado import Empleado

empleado_bp = Blueprint('empleado_bp', __name__)

#Ruta endpoints
@empleado_bp.route('/empleados', methods=['GET'])
def listar_empleados():
    """Endpoint para obtener todos los registros"""
    empleados = Empleado.listar_empleados()
    return jsonify(empleados), 200

@empleado_bp.route('/empleados', methods=['POST'])
def crear_empleado():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroEmpleado = data.get('numeroEmpleado')
    rfc = data.get('rfc')
    nombreEmpleado = data.get('nombreEmpleado')
    fechaIngreso = data.get('fechaIngreso')
    sueldo = data.get('sueldo')
    permisosPedidos = data.get('permisosPedidos')
    fkDepartamento = data.get('fkDepartamento')

    if not nombreEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    if Empleado.crear_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento):
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
        sueldo = data.get('sueldo')
        permisosPedidos = data.get('permisosPedidos')
        fkDepartamento = data.get('fkDepartamento')

        # # Validación de ID (debe ser un número entero)
        # if not isinstance(id, int):
        #     return jsonify({'mensaje': 'ID inválido'}), 400

        # # Validación de Nombre (que no esté vacío)
        # if not nombre or not nombre.strip():
        #     return jsonify({'mensaje': 'El nombre es obligatorio'}), 400

        # Llamar al controlador para actualizar el registro
        if Empleado.editar_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento):
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
        if Empleado.eliminar_empleado(numeroEmpleado):
            return jsonify({'mensaje': 'Empleado eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el empleado'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500