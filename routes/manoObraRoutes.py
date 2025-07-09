from flask import Blueprint, request, jsonify
from models.manoObra import ManoObra

mano_obra_bp = Blueprint('mano_obra_bp', __name__)

# Ruta para obtener todas las manos de obra
@mano_obra_bp.route('/manos_obra', methods=['GET'])
def listar_manos_obra():
    """Endpoint para obtener todos los registros"""
    manos = ManoObra.listar_manos_obra()
    return jsonify(manos), 200

# Ruta para insertar una nueva mano de obra
@mano_obra_bp.route('/manos_obra', methods=['POST'])
def crear_mano_obra():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreManoObra = data.get('nombreManoObra')

    if not nombreManoObra:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    mano = ManoObra(None, nombreManoObra)
    if mano.crear_mano_obra():
        return jsonify({'mensaje': 'Mano de obra insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar mano de obra'}), 500

# Ruta para editar una mano de obra
@mano_obra_bp.route('/manos_obra', methods=['PUT'])
def editar_mano_obra():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkManoObra = data.get('pkManoObra')
        nombreManoObra = data.get('nombreManoObra')

        if not pkManoObra or not nombreManoObra:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        mano = ManoObra(pkManoObra, nombreManoObra)
        if mano.editar_mano_obra():
            return jsonify({'mensaje': 'Mano de obra editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la mano de obra'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una mano de obra
@mano_obra_bp.route('/manos_obra', methods=['DELETE'])
def eliminar_mano_obra():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkManoObra = data.get('pkManoObra')

        if not pkManoObra:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        mano = ManoObra(pkManoObra)
        if mano.eliminar_mano_obra():
            return jsonify({'mensaje': 'Mano de obra eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la mano de obra'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
