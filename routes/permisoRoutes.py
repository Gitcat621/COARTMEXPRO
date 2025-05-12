from flask import Blueprint, request, jsonify
from models.permiso import Permiso

permiso_bp = Blueprint('permiso_bp', __name__)

# Ruta para obtener todos los permisos
@permiso_bp.route('/permisos', methods=['GET'])
def listar_permisos():
    """Endpoint para obtener todos los registros"""
    permisos = Permiso.listar_permisos()
    return jsonify(permisos), 200

# Ruta para insertar un nuevo permiso
@permiso_bp.route('/permisos', methods=['POST'])
def crear_permiso():
    """Endpoint para insertar un registro"""
    data = request.json
    descripcionPermiso = data.get('descripcionPermiso')
    fechaPermiso = data.get('fechaPermiso')
    fkEmpleado = data.get('fkEmpleado')

    if not descripcionPermiso or not fechaPermiso or not fkEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    permiso = Permiso(None, descripcionPermiso, fechaPermiso, fkEmpleado)
    if permiso.crear_permiso():
        return jsonify({'mensaje': 'Permiso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar permiso'}), 500

# Ruta para editar un permiso
@permiso_bp.route('/permisos', methods=['PUT'])
def editar_permiso():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkPermiso = data.get('pkPermiso')
        descripcionPermiso = data.get('descripcionPermiso')
        fechaPermiso = data.get('fechaPermiso')

        if not pkPermiso or not descripcionPermiso or not fechaPermiso:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        permiso = Permiso(pkPermiso, descripcionPermiso, fechaPermiso)
        if permiso.editar_permisos():
            return jsonify({'mensaje': 'Permiso editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el permiso'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un permiso
@permiso_bp.route('/permisos', methods=['DELETE'])
def eliminar_permiso():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkPermiso = data.get('pkPermiso')

        if not pkPermiso:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        permiso = Permiso(pkPermiso)
        if permiso.eliminar_permisos():
            return jsonify({'mensaje': 'Permiso eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el permiso'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
