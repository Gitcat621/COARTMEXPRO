from flask import Blueprint, request, jsonify
from models.curso import Curso

curso_bp = Blueprint('curso_bp', __name__)

@curso_bp.route('/cursos', methods=['GET'])
def listar_cursos():
    """Endpoint para obtener todos los registros"""
    cursos = Curso.listar_cursos()
    return jsonify(cursos), 200

@curso_bp.route('/presentadores', methods=['GET'])
def listar_presentadores():
    """Endpoint para obtener todos los registros"""
    cursos = Curso.listar_presentadores()
    return jsonify(cursos), 200

@curso_bp.route('/cursos', methods=['POST'])
def crear_curso():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreCurso = data.get('nombreCurso')
    documentoObtenido = data.get('documentoObtenido')
    duracionCurso = data.get('duracionCurso')
    fkPresentador = data.get('presentador')

    if not isinstance(nombreCurso, str):
        return jsonify({'mensaje': 'nombreCurso debe ser una cadena de texto'}), 400
    
    if not nombreCurso or not documentoObtenido or not duracionCurso or not fkPresentador:
        return jsonify({'mensaje': 'faltan datos'}), 400

    curso = Curso(nombreCurso = nombreCurso, documentoObtenido=documentoObtenido, duracionCurso=duracionCurso, fkPresentador=fkPresentador)
    if curso.crear_curso():
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
        documentoObtenido = data.get('documentoObtenido')
        duracionCurso = data.get('duracionCurso')
        fkPresentador = data.get('presentador')

        curso = Curso(pkCurso,nombreCurso,documentoObtenido,duracionCurso,fkPresentador)
        if curso.editar_curso():
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

        curso = Curso(pkCurso=pkCurso)
        if curso.eliminar_curso():
            return jsonify({'mensaje': 'Curso eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el curso'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500