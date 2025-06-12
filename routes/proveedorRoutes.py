from flask import Blueprint, request, jsonify
from models.proveedor import Proveedor

proveedor_bp = Blueprint('proveedor_bp', __name__)

@proveedor_bp.route('/proveedores', methods=['GET'])
def listar_proveedores():
    """Endpoint para obtener todos los registros"""
    proveedores = Proveedor.listar_proveedores()
    return jsonify(proveedores), 200

@proveedor_bp.route('/proveedores', methods=['POST'])
def crear_proveedor():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreProveedor = data.get('nombreProveedor')
    correoProveedor = data.get('correoProveedor')
    diasCredito = data.get('diasCredito')
    facturaNota = data.get('facturaNota')
    diasEntrega = data.get('diasEntrega')
    flete = data.get('flete')
    codigoPostal = data.get('codigoPostal')
    puebloCiudad = data.get('puebloCiudad')
    municipio = data.get('municipio')
    estado = data.get('estado')
    numerosTelfono = data.get('numerosSeleccionados')
    paqueterias = data.get('paqueteriasSeleccionadas')

    print(nombreProveedor)
    print(correoProveedor)
    print(diasCredito)
    print(facturaNota)
    print(diasEntrega)
    print(flete)
    print(codigoPostal)
    print(puebloCiudad)
    print(municipio)
    print(estado)
    print(numerosTelfono)
    print(paqueterias)


    if not isinstance(nombreProveedor, str):
        return jsonify({'mensaje': 'nombreProveedor debe ser una cadena de texto'}), 400

    if not isinstance(correoProveedor, str):
        return jsonify({'mensaje': 'correoProveedor debe ser una cadena de texto'}), 400


    if not isinstance(facturaNota, str):
        return jsonify({'mensaje': 'facturaNota debe ser una cadena de texto'}), 400



    if not nombreProveedor or not correoProveedor or diasCredito is None or not facturaNota:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Proveedor.crear_proveedor(nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega,flete, codigoPostal, puebloCiudad, municipio, estado, numerosTelfono, paqueterias):
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

        proveedor = Proveedor(pkProveedor=pkProveedor,nombreProveedor=nombreProveedor, correoProveedor=correoProveedor, diasCredito=diasCredito, facturaNota=facturaNota, fkUbicacion=fkUbicacion)
        if proveedor.editar_proveedor():
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

        proveedor = Proveedor(pkProveedor=pkProveedor)
        if proveedor.eliminar_proveedor():
            return jsonify({'mensaje': 'Proveedor eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el proveedor'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500