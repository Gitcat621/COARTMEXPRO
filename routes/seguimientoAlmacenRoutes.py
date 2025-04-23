from flask import Blueprint, request, jsonify
from models.seguimientoAlmacen import SeguiminetoAlmacen

seguimientoAlmacen_bp = Blueprint('seguimientoAlmacen_bp', __name__)

@seguimientoAlmacen_bp.route('/seguimientosAlmacen', methods=['GET'])
def listar_seguimientosAlmacen():
    """Endpoint para obtener todos los registros"""
    seguimientosAlmacen = SeguiminetoAlmacen.listar_seguimientosAlmacen()
    return jsonify(seguimientosAlmacen), 200

@seguimientoAlmacen_bp.route('/seguimientosAlmacen', methods=['POST'])
def crear_seguimientoAlmacen():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaSurtido = data.get('fechaSurtido')
    fechaEmpaque = data.get('fechaEmpaque')

    if not isinstance(fechaSurtido, str):
        return jsonify({'mensaje': 'fechaSurtido debe ser una cadena de texto'}), 400

    if not isinstance(fechaEmpaque, str):
        return jsonify({'mensaje': 'fechaEmpaque debe ser una cadena de texto'}), 400

    if not fechaSurtido or not fechaEmpaque:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if SeguiminetoAlmacen.crear_seguimientoAlmacen(fechaSurtido, fechaEmpaque):
        return jsonify({'mensaje': 'Seguimiento de almacén insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar seguimiento de almacén'}), 500

@seguimientoAlmacen_bp.route('/seguimientosAlmacen', methods=['PUT'])
def editar_seguimientoAlmacen():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkSeguimientoAlmacen = data.get('pkSeguimientoAlmacen')
        fechaSurtido = data.get('fechaSurtido')
        fechaEmpaque = data.get('fechaEmpaque')

        if SeguiminetoAlmacen.editar_seguimientoAlmacen(pkSeguimientoAlmacen, fechaSurtido, fechaEmpaque):
            return jsonify({'mensaje': 'Seguimiento de almacén editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el seguimiento de almacén'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@seguimientoAlmacen_bp.route('/seguimientosAlmacen', methods=['DELETE'])
def eliminar_seguimientoAlmacen():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkSeguimientoAlmacen = data.get('pkSeguimientoAlmacen')

        if SeguiminetoAlmacen.eliminar_seguimientoAlmacen(pkSeguimientoAlmacen):
            return jsonify({'mensaje': 'Seguimiento de almacén eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el seguimiento de almacén'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500