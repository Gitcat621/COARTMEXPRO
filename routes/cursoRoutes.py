from flask import Blueprint, request, jsonify
from controllers.cursoController import CursoController

curso_bp = Blueprint('curso_bp', __name__)

@curso_bp.route('/cursos', methods=['GET'])
def listar_cursos():
    """Endpoint para obtener todos los registros"""
    cursos = CursoController.listar_cursos()
    return jsonify(cursos), 200

@curso_bp.route('/cursos', methods=['POST'])
def crear_curso():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreCurso = data.get('nombreCurso')

    if not isinstance(nombreCurso, str):
        return jsonify({'mensaje': 'nombreCurso debe ser una cadena de texto'}), 400

    if CursoController.crear_curso(nombreCurso):
        return jsonify({'mensaje': 'Curso insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar curso'}), 500

@curso_bp.route('/cursos', methods=['PUT'])
def editar_curso():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCurso = data.get('pkCurso')
        nombreCurso = data.get('nombreCurso')

        if CursoController.editar_curso(pkCurso, nombreCurso):
            return jsonify({'mensaje': 'Curso editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el curso'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@curso_bp.route('/cursos', methods=['DELETE'])
def eliminar_curso():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCurso = data.get('pkCurso')

        if CursoController.eliminar_curso(pkCurso):
            return jsonify({'mensaje': 'Curso eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el curso'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500