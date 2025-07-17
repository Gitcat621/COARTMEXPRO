from flask import Blueprint, request, jsonify
from models.metodoPago import MetodoPago

api_metodosPago = Blueprint('api_metodosPago', __name__)

# Ruta para obtener todos los métodos de pago
@api_metodosPago.route('/', methods=['GET'])
def listar_metodos_pago():
    """Endpoint para obtener todos los registros"""
    metodos_pago = MetodoPago.listar_metodos_pago()
    return jsonify(metodos_pago), 200

# Ruta para insertar un nuevo método de pago
@api_metodosPago.route('/', methods=['POST'])
def crear_metodo_pago():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreMetodoPago = data.get('nombreMetodoPago')

    if not nombreMetodoPago:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    metodo_pago = MetodoPago(None, nombreMetodoPago)
    if metodo_pago.crear_metodoPago():
        return jsonify({'mensaje': 'Método de pago insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar método de pago'}), 500

# Ruta para editar un método de pago
@api_metodosPago.route('/', methods=['PUT'])
def editar_metodo_pago():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkMetodoPago = data.get('pkMetodoPago')
        nombreMetodoPago = data.get('nombreMetodoPago')

        if not pkMetodoPago or not nombreMetodoPago:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        metodo_pago = MetodoPago(pkMetodoPago, nombreMetodoPago)
        if metodo_pago.editar_metodoPago():
            return jsonify({'mensaje': 'Método de pago editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el método de pago'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un método de pago
@api_metodosPago.route('/', methods=['DELETE'])
def eliminar_metodo_pago():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkMetodoPago = data.get('pkMetodoPago')

        if not pkMetodoPago:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        metodo_pago = MetodoPago(pkMetodoPago)
        if metodo_pago.eliminar_metodoPago():
            return jsonify({'mensaje': 'Método de pago eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el método de pago'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
