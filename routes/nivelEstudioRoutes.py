from flask import Blueprint, request, jsonify
from models.nivelEstudio import NivelEstudio

nivel_estudio_bp = Blueprint('nivel_estudio_bp', __name__)

# Ruta para obtener todos los niveles de estudio
@nivel_estudio_bp.route('/niveles_estudio', methods=['GET'])
def listar_niveles_estudio():
    """Endpoint para obtener todos los registros"""
    niveles_estudio = NivelEstudio.listar_niveles_estudio()
    return jsonify(niveles_estudio), 200

# Ruta para insertar un nuevo nivel de estudio
@nivel_estudio_bp.route('/niveles_estudio', methods=['POST'])
def crear_nivel_estudio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreNivel = data.get('nombreNivel')

    if not nombreNivel:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    nivel_estudio = NivelEstudio(None, nombreNivel)
    if nivel_estudio.crear_nivel_estudio():  # Posible error en el nombre del método en el modelo, debería llamarse crear_nivel_estudio()
        return jsonify({'mensaje': 'Nivel de estudio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar nivel de estudio'}), 500

# Ruta para editar un nivel de estudio
@nivel_estudio_bp.route('/niveles_estudio', methods=['PUT'])
def editar_nivel_estudio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkNivelEstudio = data.get('pkNivelEstudio')
        nombreNivel = data.get('nombreNivel')

        if not pkNivelEstudio or not nombreNivel:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        nivel_estudio = NivelEstudio(pkNivelEstudio, nombreNivel)
        if nivel_estudio.editar_niveles_estudio():
            return jsonify({'mensaje': 'Nivel de estudio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el nivel de estudio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un nivel de estudio
@nivel_estudio_bp.route('/niveles_estudio', methods=['DELETE'])
def eliminar_nivel_estudio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkNivelEstudio = data.get('pkNivelEstudio')

        if not pkNivelEstudio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        nivel_estudio = NivelEstudio(pkNivelEstudio)
        if nivel_estudio.eliminar_niveles_estudio():
            return jsonify({'mensaje': 'Nivel de estudio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el nivel de estudio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
