from flask import Blueprint, request, jsonify
from models.clinica import Clinica

clinica_bp = Blueprint('clinica_bp', __name__)

# Rutas endpoints
@clinica_bp.route('/clinicas', methods=['GET'])
def listar_clinicas():
    """Endpoint para obtener todas las clínicas"""
    clinicas = Clinica.listar_clinicas()
    return jsonify(clinicas), 200

@clinica_bp.route('/clinicas', methods=['POST'])
def crear_clinica():
    """Endpoint para insertar una clínica"""
    data = request.json
    nombreClinica = data.get('nombreClinica')

    if not nombreClinica or not nombreClinica.strip():
        return jsonify({'mensaje': 'El nombre de la clínica es obligatorio'}), 400
    
    clinica = Clinica(nombreClinica=nombreClinica)
    if clinica.crear_clinica():
        return jsonify({'mensaje': 'Clínica insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar clínica'}), 500

@clinica_bp.route('/clinicas', methods=['PUT'])
def editar_clinica():
    """Endpoint para editar una clínica"""
    try:
        data = request.json
        pkClinica = data.get('pkClinica')
        nombreClinica = data.get('nombreClinica')

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkClinica, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        # Validación de Nombre (que no esté vacío)
        if not nombreClinica or not nombreClinica.strip():
            return jsonify({'mensaje': 'El nombre de la clínica es obligatorio'}), 400
        
        clinica = Clinica(pkClinica=pkClinica, nombreClinica=nombreClinica)
        if clinica.editar_clinicas():
            return jsonify({'mensaje': 'Clínica editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la clínica'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@clinica_bp.route('/clinicas', methods=['DELETE'])
def eliminar_clinica():
    """Endpoint para eliminar una clínica"""
    try:
        data = request.json
        pkClinica = data.get('pkClinica')

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkClinica, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        clinica = Clinica(pkClinica=pkClinica)
        if clinica.eliminar_clinicas():
            return jsonify({'mensaje': 'Clínica eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la clínica'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
