from flask import Blueprint, request, jsonify
from models.oportunidad import Oportunidad

oportunidad_bp = Blueprint('oportunidad_bp', __name__)

@oportunidad_bp.route('/oportunidades', methods=['GET'])
def listar_oportunidades():
    """Endpoint para obtener todos los registros"""
    oportunidades = Oportunidad.listar_oportunidades()
    return jsonify(oportunidades), 200

@oportunidad_bp.route('/oportunidades', methods=['POST'])
def crear_oportunidad():
    """Endpoint para insertar un registro"""
    data = request.json
    oportunidad = data.get('oportunidad')

    if not oportunidad:
        return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

    nueva_oportunidad = Oportunidad(oportunidad=oportunidad)

    if nueva_oportunidad.crear_oportunidad():
        return jsonify({'mensaje': 'Oportunidad creada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al crear oportunidad'}), 500

@oportunidad_bp.route('/oportunidad_empleado', methods=['POST'])
def crear_oportunidad_empleado():
    """Endpoint para insertar un registro"""
    data = request.json

    fkEmpleado = str(data.get('numeroEmpleado', '')).strip()
    fkOportunidad = int(data.get('fkOportunidad'))

    if Oportunidad.crear_oportunidad_empleado(fkEmpleado, fkOportunidad):
        return jsonify({'mensaje': 'Curso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar oportunidad'}), 500

@oportunidad_bp.route('/oportunidades', methods=['PUT'])
def editar_oportunidad():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkOportunidad = data.get('pkOportunidad')
        oportunidad = data.get('oportunidad')

        if not pkOportunidad or not oportunidad:
            return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

        oportunidad_modificada = Oportunidad(pkOportunidad=pkOportunidad, oportunidad=oportunidad)

        if oportunidad_modificada.editar_oportunidad():
            return jsonify({'mensaje': 'Oportunidad editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'Error al editar oportunidad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@oportunidad_bp.route('/oportunidades', methods=['DELETE'])
def eliminar_oportunidad():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkOportunidad = data.get('pkOportunidad')

        if not pkOportunidad:
            return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

        oportunidad_eliminada = Oportunidad(pkOportunidad=pkOportunidad)

        if oportunidad_eliminada.eliminar_oportunidad():
            return jsonify({'mensaje': 'Oportunidad eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'Error al eliminar oportunidad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
