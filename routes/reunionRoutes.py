from flask import Blueprint, request, jsonify
from models.reunion import Reunion

reunion_bp = Blueprint('reunion_bp', __name__)

# Ruta para obtener todas las reuniones
@reunion_bp.route('/reuniones', methods=['GET'])
def listar_reuniones():
    """Endpoint para obtener todos los registros"""
    reuniones = Reunion.listar_reuniones()
    return jsonify(reuniones), 200

# Ruta para insertar una nueva reunión
@reunion_bp.route('/reuniones', methods=['POST'])
def crear_reunion():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaReunion = data.get('fechaReunion')
    nombreReunion = data.get('nombreReunion')

    if not fechaReunion or not nombreReunion:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    reunion = Reunion(None, fechaReunion, nombreReunion)
    if reunion.crear_reunion():
        return jsonify({'mensaje': 'Reunión insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar reunión'}), 500

# Ruta para editar una reunión
@reunion_bp.route('/reuniones', methods=['PUT'])
def editar_reunion():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkReunion = data.get('pkReunion')
        fechaReunion = data.get('fechaReunion')
        nombreReunion = data.get('nombreReunion')

        if not pkReunion or not fechaReunion or not nombreReunion:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        reunion = Reunion(pkReunion, fechaReunion, nombreReunion)
        if reunion.editar_reuniones():
            return jsonify({'mensaje': 'Reunión editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la reunión'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una reunión
@reunion_bp.route('/reuniones', methods=['DELETE'])
def eliminar_reunion():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkReunion = data.get('pkReunion')

        if not pkReunion:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        reunion = Reunion(pkReunion)
        if reunion.eliminar_reuniones():
            return jsonify({'mensaje': 'Reunión eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la reunión'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
