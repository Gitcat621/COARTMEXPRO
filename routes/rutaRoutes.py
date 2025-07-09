from flask import Blueprint, request, jsonify
from models.ruta import Ruta

ruta_bp = Blueprint('ruta_bp', __name__)

# Ruta para obtener todas las rutas
@ruta_bp.route('/rutas', methods=['GET'])
def listar_rutas():
    """Endpoint para obtener todos los registros"""
    fechaRuta = request.args.get('fechaRuta')
    consulta = request.args.get('consulta')
    
    ruta = Ruta.listar_rutas(fechaRuta, consulta)
    return jsonify(ruta), 200

# Ruta para obtener todas las rutas
@ruta_bp.route('/destinos', methods=['GET'])
def listar_destinos_ruta():
    """Endpoint para obtener todos los registros"""
    pkRuta = request.args.get('pkRuta')
    
    ruta = Ruta.listar_destinos_ruta(pkRuta)
    return jsonify(ruta), 200

# Ruta para insertar una nueva ruta
@ruta_bp.route('/rutas', methods=['POST'])
def crear_ruta():
    """Endpoint para insertar un registro"""
    data = request.json
    fechaRuta = data.get('fechaRuta')
    fkEmpleado = data.get('fkEmpleado')
    tiendas = data.get('tiendas')

    print(tiendas)

    if not fechaRuta or not fkEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Ruta.crear_ruta(fechaRuta, fkEmpleado, tiendas):
        return jsonify({'mensaje': 'Ruta insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar ruta'}), 500

# Ruta para editar una ruta
@ruta_bp.route('/rutas', methods=['PUT'])
def editar_ruta():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkRuta = data.get('pkRuta')
        fechaRuta = data.get('fechaRuta')
        fkEmpleado = data.get('fkEmpleado')
        tiendas = data.get('tiendas')

        print(tiendas)

        if not pkRuta or not fechaRuta or not fkEmpleado:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        if Ruta.editar_ruta(pkRuta, fechaRuta, fkEmpleado, tiendas):
            return jsonify({'mensaje': 'Ruta editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la ruta'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una ruta
@ruta_bp.route('/rutas', methods=['DELETE'])
def eliminar_ruta():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkRuta = data.get('pkRuta')

        if not pkRuta:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        ruta = Ruta(pkRuta)
        if ruta.eliminar_ruta():
            return jsonify({'mensaje': 'Ruta eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la ruta'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
