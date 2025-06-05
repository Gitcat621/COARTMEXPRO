from flask import Blueprint, request, jsonify
from models.puebloCiudad import PuebloCiudad

puebloCiudad_bp = Blueprint('puebloCiudad_bp', __name__)

@puebloCiudad_bp.route('/pueblosCiudades', methods=['GET'])
def listar_pueblosCiudades():
    """Endpoint para obtener todos los registros"""
    pueblosCiudades = PuebloCiudad.listar_pueblosCiudades()
    return jsonify(pueblosCiudades), 200

@puebloCiudad_bp.route('/pueblosCiudades', methods=['POST'])
def crear_puebloCiudad():
    """Endpoint para insertar un registro"""
    data = request.json
    nombrePuebloCiudad = data.get('nombrePuebloCiudad')

    if not isinstance(nombrePuebloCiudad, str):
        return jsonify({'mensaje': 'nombrePuebloCiudad debe ser una cadena de texto'}), 400

    if not nombrePuebloCiudad:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    puebloCiudad = PuebloCiudad(nombrePuebloCiudad=nombrePuebloCiudad)
    if puebloCiudad.crear_puebloCiudad():
        return jsonify({'mensaje': 'Pueblo/Ciudad insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar pueblo/ciudad'}), 500

@puebloCiudad_bp.route('/pueblosCiudades', methods=['PUT'])
def editar_puebloCiudad():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkPuebloCiudad = data.get('pkPuebloCiudad')
        nombrePuebloCiudad = data.get('nombrePuebloCiudad')
        
        puebloCiudad = PuebloCiudad(pkPuebloCiudad, nombrePuebloCiudad)
        if puebloCiudad.editar_puebloCiudad():
            return jsonify({'mensaje': 'Pueblo/Ciudad editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el pueblo/ciudad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@puebloCiudad_bp.route('/pueblosCiudades', methods=['DELETE'])
def eliminar_puebloCiudad():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkPuebloCiudad = data.get('pkPuebloCiudad')

        puebloCiudad = PuebloCiudad(pkPuebloCiudad)
        if puebloCiudad.eliminar_puebloCiudad():
            return jsonify({'mensaje': 'Pueblo/Ciudad eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el pueblo/ciudad'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500