from flask import Blueprint, request, jsonify
from models.envio import Envio

envio_bp = Blueprint('envio_bp', __name__)

# Ruta para obtener todos los envíos
@envio_bp.route('/envios', methods=['GET'])
def listar_envios():
    """Endpoint para obtener todos los registros"""
    envios = Envio.listar_envios()
    return jsonify(envios), 200

# Ruta para insertar un nuevo envío
@envio_bp.route('/envios', methods=['POST'])
def crear_envio():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroGuia = data.get('numeroGuia')
    fechaEnvio = data.get('fechaEnvio')
    fkPaqueteria = data.get('fkPaqueteria')
    fkSocioComercial = data.get('fkSocioComercial')

    if not numeroGuia or not fechaEnvio or not fkPaqueteria or not fkSocioComercial:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    envio = Envio(None, numeroGuia, fechaEnvio, fkPaqueteria, fkSocioComercial)
    if envio.crear_envio():
        return jsonify({'mensaje': 'Envío creado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al crear el envío'}), 500

# Ruta para editar un envío existente
@envio_bp.route('/envios', methods=['PUT'])
def editar_envio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkEnvio = data.get('pkEnvio')
        numeroGuia = data.get('numeroGuia')
        fechaEnvio = data.get('fechaEnvio')
        fkPaqueteria = data.get('fkPaqueteria')
        fkSocioComercial = data.get('fkSocioComercial')

        if not pkEnvio or not numeroGuia or not fechaEnvio or not fkPaqueteria or not fkSocioComercial:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        envio = Envio(pkEnvio, numeroGuia, fechaEnvio, fkPaqueteria, fkSocioComercial)
        if envio.editar_envio():
            return jsonify({'mensaje': 'Envío actualizado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo actualizar el envío'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un envío
@envio_bp.route('/envios', methods=['DELETE'])
def eliminar_envio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkEnvio = data.get('pkEnvio')

        if not pkEnvio:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        envio = Envio(pkEnvio)
        if envio.eliminar_envio():
            return jsonify({'mensaje': 'Envío eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el envío'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

#////CAJAS////
@envio_bp.route('/cajas', methods=['GET'])
def listar_cajas():
    """Endpoint para obtener todos los registros"""
    pkEnvio = request.args.get('pkEnvio')
    envios = Envio.listar_cajas(pkEnvio)
    return jsonify(envios), 200

@envio_bp.route('/cajas_contenido', methods=['GET'])
def listar_caja_contenido():
    """Endpoint para obtener todos los registros"""
    pkCaja = request.args.get('pkCaja')
    envios = Envio.listar_caja_contenido(pkCaja)
    return jsonify(envios), 200

# Ruta para insertar un nuevo envío
@envio_bp.route('/cajas', methods=['POST'])
def crear_caja():
    """Endpoint para insertar un registro"""
    data = request.json
    pkEnvio = data.get('pkEnvio')
    articulos = data.get('articulos')

    if not articulos or not pkEnvio:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Envio.crear_caja(pkEnvio, articulos):
        return jsonify({'mensaje': 'Caja creada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al crear la caja'}), 500
    
@envio_bp.route('/cajas', methods=['PUT'])
def editar_caja():
    """Endpoint para insertar un registro"""
    data = request.json
    pkCaja = data.get('pkCaja')
    articulos = data.get('articulos')

    if not articulos or not pkCaja:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Envio.editar_caja(pkCaja, articulos):
        return jsonify({'mensaje': 'Caja editada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al editar la caja'}), 500
    
@envio_bp.route('/cajas', methods=['DELETE'])
def eliminar_caja():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCaja = data.get('pkCaja')

        if not pkCaja:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        if Envio.eliminar_caja(pkCaja):
            return jsonify({'mensaje': 'Caja eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la caja'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500