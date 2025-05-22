from flask import Blueprint, request, jsonify
from models.beneficio import Beneficio

beneficio_bp = Blueprint('beneficio_bp', __name__)

# Ruta para obtener todos los beneficios
@beneficio_bp.route('/beneficios', methods=['GET'])
def listar_beneficios():
    """Endpoint para obtener todos los registros"""
    beneficios = Beneficio.listar_beneficios()
    return jsonify(beneficios), 200

# Ruta para insertar un nuevo beneficio
@beneficio_bp.route('/beneficios', methods=['POST'])
def crear_beneficio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreBeneficio = data.get('nombreBeneficio')

    if not nombreBeneficio:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    beneficio = Beneficio(None, nombreBeneficio)
    if beneficio.crear_beneficio():
        return jsonify({'mensaje': 'Beneficio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar beneficio'}), 500

# Ruta para editar un beneficio
@beneficio_bp.route('/beneficios', methods=['PUT'])
def editar_beneficio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkBeneficio = data.get('pkBeneficio')
        nombreBeneficio = data.get('nombreBeneficio')

        if not pkBeneficio or not nombreBeneficio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        beneficio = Beneficio(pkBeneficio, nombreBeneficio)
        if beneficio.editar_beneficios():
            return jsonify({'mensaje': 'Beneficio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el beneficio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un beneficio
@beneficio_bp.route('/beneficios', methods=['DELETE'])
def eliminar_beneficio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkBeneficio = data.get('pkBeneficio')

        if not pkBeneficio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        beneficio = Beneficio(pkBeneficio)
        if beneficio.eliminar_beneficios():
            return jsonify({'mensaje': 'Beneficio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el beneficio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
