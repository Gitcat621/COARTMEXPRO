from flask import Blueprint, request, jsonify
from models.asistencia import Asistencia
from datetime import datetime

asistencia_bp = Blueprint('asistencia_bp', __name__)

@asistencia_bp.route('/asistencias', methods=['GET'])
def listar_asistencias():
    """Endpoint para obtener todos los registros"""
    year = request.args.get('year')
    month = request.args.get('month')
    fortnight = int(request.args.get('fortnight'))
    
    asistencias = Asistencia.listar_asistencias(year, month, fortnight)

    return jsonify(asistencias), 200

@asistencia_bp.route('/resumen_asistencias', methods=['GET'])
def listar_resumen_asistencias():
    """Endpoint para obtener todos los registros"""
    year = request.args.get('year')
    month = request.args.get('month')
    fortnight = int(request.args.get('fortnight'))

    # print(year)
    # print(month)
    # print(fortnight)
    
    asistencias = Asistencia.listar_resumen_asistencias(year, month, fortnight)

    return jsonify(asistencias), 200

@asistencia_bp.route('/observaciones', methods=['GET'])
def listar_observaciones():
    """Endpoint para obtener todos los registros"""
    year = request.args.get('year')
    month = request.args.get('month')
    fortnight = int(request.args.get('fortnight'))

    print(year)
    print(month)
    print(fortnight)
    
    asistencias = Asistencia.listar_observaciones(year, month, fortnight)

    return jsonify(asistencias), 200

@asistencia_bp.route('/asistencias', methods=['POST'])
def crear_asistencia():
    """Endpoint para insertar un registro"""
    data = request.json
    asistencia = Asistencia(
        fkEmpleado=data.get('fkEmpleado')
    )

    if asistencia.crear_asistencia():
        return jsonify({'mensaje': 'Asistencia registrada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al registrar asistencia'}), 500
    
@asistencia_bp.route('/observaciones', methods=['POST'])
def crear_observacion():
    """Endpoint para insertar un registro"""
    data = request.json
    descripcionObservacion = data.get('descripcionObservacion')
    rangoFechaInicio = data.get('rangoFechaInicio')
    rangoFechaFinal = data.get('rangoFechaFinal')

    if Asistencia.crear_observacion(descripcionObservacion,rangoFechaInicio,rangoFechaFinal):
        return jsonify({'mensaje': 'Observacion agregada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al registrar asistencia'}), 500

@asistencia_bp.route('/asistencias', methods=['PUT'])
def editar_asistencia():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        asistencia = Asistencia(
            pkAsistencia=data.get('pkAsistencia'),
        )

        if asistencia.editar_asistencia():
            return jsonify({'mensaje': 'Observacion editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la asistencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@asistencia_bp.route('/observaciones', methods=['PUT'])
def editar_observacion():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkObservacionAsistencia = data.get('pkObservacionAsistencia')
        descripcionObservacion = data.get('descripcionObservacion')
        rangoFechaInicio = data.get('rangoFechaInicio')
        rangoFechaFinal = data.get('rangoFechaFinal')

        if Asistencia.editar_observacion(pkObservacionAsistencia,descripcionObservacion,rangoFechaInicio,rangoFechaFinal):
            return jsonify({'mensaje': 'Observacion editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la asistencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@asistencia_bp.route('/asistencias', methods=['DELETE'])
def eliminar_asistencia():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        asistencia = Asistencia(pkAsistencia=data.get('pkAsistencia'))

        if asistencia.eliminar_asistencia():
            return jsonify({'mensaje': 'Asistencia eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la asistencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
