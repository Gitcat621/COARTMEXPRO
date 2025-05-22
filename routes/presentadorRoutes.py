from flask import Blueprint, request, jsonify
from models.presentador import Presentador

presentador_bp = Blueprint('presentador_bp', __name__)

# Rutas endpoints
@presentador_bp.route('/presentadores', methods=['GET'])
def listar_presentadores():
    """Endpoint para obtener todos los presentadores"""
    presentadores = Presentador.listar_presentadores()
    return jsonify(presentadores), 200

@presentador_bp.route('/presentadores', methods=['POST'])
def crear_presentador():
    """Endpoint para insertar un presentador"""
    data = request.json
    nombrePresentador = data.get('nombrePresentador')

    if not nombrePresentador or not nombrePresentador.strip():
        return jsonify({'mensaje': 'El nombre del presentador es obligatorio'}), 400
    
    presentador = Presentador(nombrePresentador=nombrePresentador)
    if presentador.crear_presentador():
        return jsonify({'mensaje': 'Presentador insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar presentador'}), 500

@presentador_bp.route('/presentadores', methods=['PUT'])
def editar_presentador():
    """Endpoint para editar un presentador"""
    try:
        data = request.json
        pkPresentador = data.get('pkPresentador')
        nombrePresentador = data.get('nombrePresentador')

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkPresentador, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        # Validación de Nombre (que no esté vacío)
        if not nombrePresentador or not nombrePresentador.strip():
            return jsonify({'mensaje': 'El nombre del presentador es obligatorio'}), 400
        
        presentador = Presentador(pkPresentador=pkPresentador, nombrePresentador=nombrePresentador)
        if presentador.editar_presentador():
            return jsonify({'mensaje': 'Presentador editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el presentador'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
    
@presentador_bp.route('/presentadores', methods=['DELETE'])
def eliminar_presentador():
    """Endpoint para eliminar un presentador"""
    try:
        data = request.json
        pkPresentador = data.get('pkPresentador')

        # Validación de ID (debe ser un número entero)
        if not isinstance(pkPresentador, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        presentador = Presentador(pkPresentador=pkPresentador)
        if presentador.eliminar_presentador():
            return jsonify({'mensaje': 'Presentador eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el presentador'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
