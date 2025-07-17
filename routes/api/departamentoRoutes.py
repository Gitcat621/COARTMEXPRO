from flask import Blueprint, request, jsonify
from models.departamento import Departamento

api_departamentos = Blueprint('api_departamentos', __name__)

@api_departamentos.route('/', methods=['GET'])
def listar_departamentos():
    """Endpoint para obtener todos los registros"""
    departamentos = Departamento.listar_departamentos()
    return jsonify(departamentos), 200

@api_departamentos.route('/', methods=['POST'])
def crear_departamento():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreDepartamento = data.get('nombreDepartamento')

    if not isinstance(nombreDepartamento, str):
        return jsonify({'mensaje': 'nombreDepartamento debe ser una cadena de texto'}), 400

    if not nombreDepartamento:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    departamento = Departamento(nombreDepartamento=nombreDepartamento)
    if departamento.crear_departamento():
        return jsonify({'mensaje': 'Departamento insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar departamento'}), 500

@api_departamentos.route('/', methods=['PUT'])
def editar_departamento():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkDepartamento = data.get('pkDepartamento')
        nombreDepartamento = data.get('nombreDepartamento')

        departamento = Departamento(pkDepartamento, nombreDepartamento)
        if departamento.editar_departamento():
            return jsonify({'mensaje': 'Departamento editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el departamento'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_departamentos.route('/', methods=['DELETE'])
def eliminar_departamento():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkDepartamento = data.get('pkDepartamento')

        departamento = Departamento(pkDepartamento=pkDepartamento)
        if departamento.eliminar_departamento():
            return jsonify({'mensaje': 'Departamento eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el departamento'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500