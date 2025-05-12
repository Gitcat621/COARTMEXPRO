from flask import Blueprint, request, jsonify
from models.funcionPuesto import FuncionPuesto

funcion_puesto_bp = Blueprint('funcion_puesto_bp', __name__)

# Ruta para obtener todas las funciones de puesto
@funcion_puesto_bp.route('/funciones_puesto', methods=['GET'])
def listar_funciones_puesto():
    """Endpoint para obtener todos los registros"""
    funciones_puesto = FuncionPuesto.listar_funciones_puesto()
    return jsonify(funciones_puesto), 200

# Ruta para insertar una nueva función de puesto
@funcion_puesto_bp.route('/funciones_puesto', methods=['POST'])
def crear_funcion_puesto():
    """Endpoint para insertar un registro"""
    data = request.json
    descripcionFuncion = data.get('descripcionFuncion')
    fkPuesto = data.get('fkPuesto')

    if not descripcionFuncion or not fkPuesto:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    funcion_puesto = FuncionPuesto(None, descripcionFuncion, fkPuesto)
    if funcion_puesto.crear_funcion_puesto():
        return jsonify({'mensaje': 'Función de puesto insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar función de puesto'}), 500

# Ruta para editar una función de puesto
@funcion_puesto_bp.route('/funciones_puesto', methods=['PUT'])
def editar_funcion_puesto():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkFuncionPuesto = data.get('pkFuncionPuesto')
        descripcionFuncion = data.get('descripcionFuncion')
        fkPuesto = data.get('fkPuesto')

        if not pkFuncionPuesto or not descripcionFuncion or not fkPuesto:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        funcion_puesto = FuncionPuesto(pkFuncionPuesto, descripcionFuncion, fkPuesto)
        if funcion_puesto.editar_funciones_puesto():
            return jsonify({'mensaje': 'Función de puesto editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la función de puesto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una función de puesto
@funcion_puesto_bp.route('/funciones_puesto', methods=['DELETE'])
def eliminar_funcion_puesto():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkFuncionPuesto = data.get('pkFuncionPuesto')

        if not pkFuncionPuesto:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        funcion_puesto = FuncionPuesto(pkFuncionPuesto)
        if funcion_puesto.eliminar_funciones_puesto():
            return jsonify({'mensaje': 'Función de puesto eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la función de puesto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
