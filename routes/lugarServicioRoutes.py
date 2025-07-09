from flask import Blueprint, request, jsonify
from models.lugarServicio import LugarServicio

lugar_servicio_bp = Blueprint('lugar_servicio_bp', __name__)

# Ruta para obtener todos los lugares de servicio
@lugar_servicio_bp.route('/lugares_servicio', methods=['GET'])
def listar_lugares_servicio():
    """Endpoint para obtener todos los registros"""
    lugares = LugarServicio.listar_lugares_servicio()
    return jsonify(lugares), 200

# Ruta para insertar un nuevo lugar de servicio
@lugar_servicio_bp.route('/lugares_servicio', methods=['POST'])
def crear_lugar_servicio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreLugarServicio = data.get('nombreLugarServicio')

    if not nombreLugarServicio:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    lugar = LugarServicio(None, nombreLugarServicio)
    if lugar.crear_lugar_servicio():
        return jsonify({'mensaje': 'Lugar de servicio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar lugar de servicio'}), 500

# Ruta para editar un lugar de servicio
@lugar_servicio_bp.route('/lugares_servicio', methods=['PUT'])
def editar_lugar_servicio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkLugarServicio = data.get('pkLugarServicio')
        nombreLugarServicio = data.get('nombreLugarServicio')

        if not pkLugarServicio or not nombreLugarServicio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        lugar = LugarServicio(pkLugarServicio, nombreLugarServicio)
        if lugar.editar_lugar_servicio():
            return jsonify({'mensaje': 'Lugar de servicio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el lugar de servicio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un lugar de servicio
@lugar_servicio_bp.route('/lugares_servicio', methods=['DELETE'])
def eliminar_lugar_servicio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkLugarServicio = data.get('pkLugarServicio')

        if not pkLugarServicio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        lugar = LugarServicio(pkLugarServicio)
        if lugar.eliminar_lugar_servicio():
            return jsonify({'mensaje': 'Lugar de servicio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el lugar de servicio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
