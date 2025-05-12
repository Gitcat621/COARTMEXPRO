from flask import Blueprint, request, jsonify
from models.numeroEmergencia import NumeroEmergencia

numero_emergencia_bp = Blueprint('numero_emergencia_bp', __name__)

# Ruta para obtener todos los números de emergencia
@numero_emergencia_bp.route('/numeros_emergencia', methods=['GET'])
def listar_numeros_emergencia():
    """Endpoint para obtener todos los registros"""
    numeros_emergencia = NumeroEmergencia.listar_numeros_emergencia()
    return jsonify(numeros_emergencia), 200

# Ruta para insertar un nuevo número de emergencia
@numero_emergencia_bp.route('/numeros_emergencia', methods=['POST'])
def crear_numero_emergencia():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroEmergencia = data.get('numeroEmergencia')
    fkEmpleado = data.get('fkEmpleado')

    if not numeroEmergencia or not fkEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    numero_emergencia = NumeroEmergencia(None, numeroEmergencia, fkEmpleado)
    if numero_emergencia.crear_numero_emergencia():
        return jsonify({'mensaje': 'Número de emergencia insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar número de emergencia'}), 500

# Ruta para editar un número de emergencia
@numero_emergencia_bp.route('/numeros_emergencia', methods=['PUT'])
def editar_numero_emergencia():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkNumeroEmergencia = data.get('pkNumeroEmergencia')
        numeroEmergencia = data.get('numeroEmergencia')

        if not pkNumeroEmergencia or not numeroEmergencia:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        numero_emergencia = NumeroEmergencia(pkNumeroEmergencia, numeroEmergencia)
        if numero_emergencia.editar_numero_emergencia():
            return jsonify({'mensaje': 'Número de emergencia editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el número de emergencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un número de emergencia
@numero_emergencia_bp.route('/numeros_emergencia', methods=['DELETE'])
def eliminar_numero_emergencia():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkNumeroEmergencia = data.get('pkNumeroEmergencia')

        if not pkNumeroEmergencia:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        numero_emergencia = NumeroEmergencia(pkNumeroEmergencia)
        if numero_emergencia.eliminar_numero_emergencia():
            return jsonify({'mensaje': 'Número de emergencia eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el número de emergencia'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
