from flask import Blueprint, request, jsonify
from models.visitaTienda import VisitaTienda

visita_tienda_bp = Blueprint('visita_tienda_bp', __name__)

# Ruta para obtener todas las visitas a tienda
@visita_tienda_bp.route('/visitas_tienda', methods=['GET'])
def listar_visitas_tienda():
    """Endpoint para obtener todos los registros"""
    visitas = VisitaTienda.listar_visitas_tiendas()
    return jsonify(visitas), 200

# Ruta para insertar una nueva visita a tienda
@visita_tienda_bp.route('/visitas_tienda', methods=['POST'])
def crear_visita_tienda():
    """Endpoint para insertar un registro"""
    data = request.json
    observacion = data.get('observacion')
    fechaVisita = data.get('fechaVisita')
    venta = data.get('venta')
    servicio = data.get('servicio')
    fkSocioComercial = data.get('fkSocioComercial')

    if not fechaVisita or fkSocioComercial is None:
        return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

    visita = VisitaTienda(None, observacion, fechaVisita, venta, servicio, fkSocioComercial)
    if visita.crear_visita_tienda():
        return jsonify({'mensaje': 'Visita registrada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al registrar la visita'}), 500

# Ruta para editar una visita a tienda
@visita_tienda_bp.route('/visitas_tienda', methods=['PUT'])
def editar_visita_tienda():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkVisitaTienda = data.get('pkVisitaTienda')
        observacion = data.get('observacion')
        fechaVisita = data.get('fechaVisita')
        venta = data.get('venta')
        servicio = data.get('servicio')
        fkSocioComercial = data.get('fkSocioComercial')

        if not pkVisitaTienda or not fechaVisita or fkSocioComercial is None:
            return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

        visita = VisitaTienda(pkVisitaTienda, observacion, fechaVisita, venta, servicio, fkSocioComercial)
        if visita.editar_visita_tienda():
            return jsonify({'mensaje': 'Visita editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la visita'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una visita a tienda
@visita_tienda_bp.route('/visitas_tienda', methods=['DELETE'])
def eliminar_visita_tienda():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkVisitaTienda = data.get('pkVisitaTienda')

        if not pkVisitaTienda:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        visita = VisitaTienda(pkVisitaTienda)
        if visita.eliminar_visita_tienda():
            return jsonify({'mensaje': 'Visita eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la visita'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
