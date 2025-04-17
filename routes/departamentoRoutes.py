from flask import Blueprint, request, jsonify
from controllers.departamentoController import DepartamentoController

departamento_bp = Blueprint('departamento_bp', __name__)

@departamento_bp.route('/departamentos', methods=['GET'])
def listar_departamentos():
    """Endpoint para obtener todos los registros"""
    departamentos = DepartamentoController.listar_departamentos()
    return jsonify(departamentos), 200

@departamento_bp.route('/departamentos', methods=['POST'])
def crear_departamento():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreDepartamento = data.get('nombreDepartamento')

    if not isinstance(nombreDepartamento, str):
        return jsonify({'mensaje': 'nombreDepartamento debe ser una cadena de texto'}), 400

    if not nombreDepartamento:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if DepartamentoController.crear_departamento(nombreDepartamento):
        return jsonify({'mensaje': 'Departamento insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar departamento'}), 500

@departamento_bp.route('/departamentos', methods=['PUT'])
def editar_departamento():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkDepartamento = data.get('pkDepartamento')
        nombreDepartamento = data.get('nombreDepartamento')

        if DepartamentoController.editar_departamento(pkDepartamento, nombreDepartamento):
            return jsonify({'mensaje': 'Departamento editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el departamento'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@departamento_bp.route('/departamentos', methods=['DELETE'])
def eliminar_departamento():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkDepartamento = data.get('pkDepartamento')

        if DepartamentoController.eliminar_departamento(pkDepartamento):
            return jsonify({'mensaje': 'Departamento eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el departamento'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500