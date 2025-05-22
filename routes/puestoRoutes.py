from flask import Blueprint, request, jsonify
from models.puesto import Puesto

puesto_bp = Blueprint('puesto_bp', __name__)

@puesto_bp.route('/puestos', methods=['GET'])
def listar_puestos():
    """Endpoint para obtener todos los registros"""
    puestos = Puesto.listar_puestos()  # Parece que el método debería llamarse listar_puestos
    return jsonify(puestos), 200

@puesto_bp.route('/puestos', methods=['POST'])
def crear_puesto():
    """Endpoint para insertar un registro"""
    data = request.json
    nombrePuesto = data.get('nombrePuesto')
    fkDepartamento = data.get('fkDepartamento')

    if not nombrePuesto or not fkDepartamento:
        return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

    puesto = Puesto(nombrePuesto=nombrePuesto, fkDepartamento=fkDepartamento)

    if puesto.crear_puesto(): 
        return jsonify({'mensaje': 'Puesto creado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al crear puesto'}), 500

@puesto_bp.route('/puestos', methods=['PUT'])
def editar_puesto():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkPuesto = data.get('pkPuesto')
        nombrePuesto = data.get('nombrePuesto')
        fkDepartamento = data.get('fkDepartamento')

        if not pkPuesto or not nombrePuesto or not fkDepartamento:
            return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

        puesto = Puesto(pkPuesto=pkPuesto, nombrePuesto=nombrePuesto, fkDepartamento=fkDepartamento)

        if puesto.editar_puestos():
            return jsonify({'mensaje': 'Puesto editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'Error al editar puesto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@puesto_bp.route('/puestos', methods=['DELETE'])
def eliminar_puesto():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkPuesto = data.get('pkPuesto')

        if not pkPuesto:
            return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

        puesto = Puesto(pkPuesto=pkPuesto)

        if puesto.eliminar_puestos():  # Parece que el método debería llamarse eliminar_puesto
            return jsonify({'mensaje': 'Puesto eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'Error al eliminar puesto'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
