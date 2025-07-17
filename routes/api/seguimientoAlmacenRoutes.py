from flask import Blueprint, request, jsonify
from models.seguimientoAlmacen import SeguimientoAlmacen

api_seguimientosAlmacen = Blueprint('api_seguimientosAlmacen', __name__)

@api_seguimientosAlmacen.route('/', methods=['GET'])
def listar_seguimientosAlmacen():
    """Endpoint para obtener todos los registros"""
    seguimientosAlmacen = SeguimientoAlmacen.listar_seguimientosAlmacen()
    return jsonify(seguimientosAlmacen), 200

@api_seguimientosAlmacen.route('/', methods=['POST'])
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

    if SeguimientoAlmacen.crear_seguimientoAlmacen(fechaSurtido, fechaEmpaque):
        return jsonify({'mensaje': 'Seguimiento de almacén insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar seguimiento de almacén'}), 500

@api_seguimientosAlmacen.route('/', methods=['PUT'])
def editar_seguimientoAlmacen():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkSeguimientoAlmacen = data.get('pkSeguimientoAlmacen')
        fechaSurtido = data.get('fechaSurtido')
        fechaEmpaque = data.get('fechaEmpaque')

        if SeguimientoAlmacen.editar_seguimientoAlmacen(pkSeguimientoAlmacen, fechaSurtido, fechaEmpaque):
            return jsonify({'mensaje': 'Seguimiento de almacén editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el seguimiento de almacén'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_seguimientosAlmacen.route('/', methods=['DELETE'])
def eliminar_seguimientoAlmacen():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkSeguimientoAlmacen = data.get('pkSeguimientoAlmacen')

        if SeguimientoAlmacen.eliminar_seguimientoAlmacen(pkSeguimientoAlmacen):
            return jsonify({'mensaje': 'Seguimiento de almacén eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el seguimiento de almacén'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500