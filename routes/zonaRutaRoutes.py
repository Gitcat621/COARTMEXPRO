from flask import Blueprint, request, jsonify
from models.zonaRuta import ZonaRuta

zona_ruta_bp = Blueprint('zona_ruta_bp', __name__)

# Ruta para obtener todas las zonas de ruta
@zona_ruta_bp.route('/zonas_ruta', methods=['GET'])
def listar_zonas_ruta():
    """Endpoint para obtener todos los registros"""
    zonas_ruta = ZonaRuta.listar_zonas_ruta()
    return jsonify(zonas_ruta), 200

# Ruta para insertar una nueva zona de ruta
@zona_ruta_bp.route('/zonas_ruta', methods=['POST'])
def crear_zona_ruta():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreZonaRuta = data.get('nombreZonaRuta')

    if not nombreZonaRuta:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    zona_ruta = ZonaRuta(None, nombreZonaRuta)
    if zona_ruta.crear_zona_ruta():
        return jsonify({'mensaje': 'Zona de ruta insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar zona de ruta'}), 500

# Ruta para editar una zona de ruta
@zona_ruta_bp.route('/zonas_ruta', methods=['PUT'])
def editar_zona_ruta():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkZonaRuta = data.get('pkZonaRuta')
        nombreZonaRuta = data.get('nombreZonaRuta')

        if not pkZonaRuta or not nombreZonaRuta:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        zona_ruta = ZonaRuta(pkZonaRuta, nombreZonaRuta)
        if zona_ruta.editar_zona_ruta():
            return jsonify({'mensaje': 'Zona de ruta editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la zona de ruta'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una zona de ruta
@zona_ruta_bp.route('/zonas_ruta', methods=['DELETE'])
def eliminar_zona_ruta():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkZonaRuta = data.get('pkZonaRuta')

        if not pkZonaRuta:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        zona_ruta = ZonaRuta(pkZonaRuta)
        if zona_ruta.eliminar_zona_ruta():
            return jsonify({'mensaje': 'Zona de ruta eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la zona de ruta'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
