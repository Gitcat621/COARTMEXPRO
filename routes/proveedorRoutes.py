from flask import Blueprint, request, jsonify
from controllers.proveedorController import ProveedorController

proveedor_bp = Blueprint('proveedor_bp', __name__)

@proveedor_bp.route('/proveedores', methods=['GET'])
def listar_proveedores():
    """Endpoint para obtener todos los registros"""
    proveedores = ProveedorController.listar_proveedores()
    return jsonify(proveedores), 200

@proveedor_bp.route('/proveedores', methods=['POST'])
def crear_proveedor():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreProveedor = data.get('nombreProveedor')
    correoProveedor = data.get('correoProveedor')
    diasCredito = data.get('diasCredito')
    facturaNota = data.get('facturaNota')
    fkUbicacion = data.get('fkUbicacion')
    fkInfoPaqueteria = data.get('fkInfoPaqueteria')

    if not isinstance(nombreProveedor, str):
        return jsonify({'mensaje': 'nombreProveedor debe ser una cadena de texto'}), 400

    if not isinstance(correoProveedor, str):
        return jsonify({'mensaje': 'correoProveedor debe ser una cadena de texto'}), 400

    # if not isinstance(diasCredito, int):
    #     return jsonify({'mensaje': 'diasCredito debe ser un entero'}), 400

    if not isinstance(facturaNota, str):
        return jsonify({'mensaje': 'facturaNota debe ser una cadena de texto'}), 400

    # if not isinstance(fkUbicacion, int):
    #     return jsonify({'mensaje': 'fkUbicacion debe ser un entero'}), 400

    # if not isinstance(fkInfoPaqueteria, int):
    #     return jsonify({'mensaje': 'fkInfoPaqueteria debe ser un entero'}), 400

    if not nombreProveedor or not correoProveedor or diasCredito is None or not facturaNota or fkUbicacion is None or fkInfoPaqueteria is None:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if ProveedorController.crear_proveedor(nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion, fkInfoPaqueteria):
        return jsonify({'mensaje': 'Proveedor insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar proveedor'}), 500

@proveedor_bp.route('/proveedores', methods=['PUT'])
def editar_proveedor():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkProveedor = data.get('pkProveedor')
        nombreProveedor = data.get('nombreProveedor')
        correoProveedor = data.get('correoProveedor')
        diasCredito = data.get('diasCredito')
        facturaNota = data.get('facturaNota')
        fkUbicacion = data.get('fkUbicacion')
        fkInfoPaqueteria = data.get('fkInfoPaqueteria')

        if ProveedorController.editar_proveedor(pkProveedor, nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion, fkInfoPaqueteria):
            return jsonify({'mensaje': 'Proveedor editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el proveedor'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@proveedor_bp.route('/proveedores', methods=['DELETE'])
def eliminar_proveedor():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkProveedor = data.get('pkProveedor')

        if ProveedorController.eliminar_proveedor(pkProveedor):
            return jsonify({'mensaje': 'Proveedor eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el proveedor'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500