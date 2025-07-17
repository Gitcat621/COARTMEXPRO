from flask import Blueprint, request, jsonify
from models.proveedor import Proveedor

api_proveedores = Blueprint('api_proveedores', __name__)

@api_proveedores.route('/', methods=['GET'])
def listar_proveedores():
    """Endpoint para obtener todos los registros"""
    proveedores = Proveedor.listar_proveedores()
    return jsonify(proveedores), 200

@api_proveedores.route('/', methods=['POST'])
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
    metodosPago = data.get('metodosSeleccionados')
    numerosTelefono = data.get('numerosSeleccionados')
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
    print(metodosPago)
    print(numerosTelefono)
    print(paqueterias)


    if not isinstance(nombreProveedor, str):
        return jsonify({'mensaje': 'nombreProveedor debe ser una cadena de texto'}), 400

    if not isinstance(correoProveedor, str):
        return jsonify({'mensaje': 'correoProveedor debe ser una cadena de texto'}), 400


    if not isinstance(facturaNota, str):
        return jsonify({'mensaje': 'facturaNota debe ser una cadena de texto'}), 400



    if not nombreProveedor or not correoProveedor or diasCredito is None or not facturaNota:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Proveedor.crear_proveedor(nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega,flete, codigoPostal, puebloCiudad, municipio, estado, metodosPago, numerosTelefono, paqueterias):
        return jsonify({'mensaje': 'Proveedor insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar proveedor'}), 500

@api_proveedores.route('/', methods=['PUT'])
def editar_proveedor():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkProveedor = data.get('pkProveedor')
        nombreProveedor = data.get('nombreProveedor')
        correoProveedor = data.get('correoProveedor')
        diasCredito = data.get('diasCredito')
        facturaNota = data.get('facturaNota')
        diasEntrega = data.get('diasEntrega')
        flete = data.get('flete')
        fkUbicacion = data.get('fkUbicacion')
        codigoPostal = data.get('codigoPostal')
        puebloCiudad = data.get('puebloCiudad')
        municipio = data.get('municipio')
        estado = data.get('estado')
        metodosPago = data.get('metodosSeleccionados')
        numerosTelefono = data.get('numerosSeleccionados')
        pkTelefonos = data.get('pkTelefonos')
        paqueterias = data.get('paqueteriasSeleccionadas')

        print("pkProveedor ", pkProveedor)
        print("nombreProveedor ", nombreProveedor)
        print("correoProveedor ", correoProveedor)
        print("diasCredito ", diasCredito)
        print("facturaNota ", facturaNota)
        print("diasEntrega ", diasEntrega)
        print("flete ", flete)
        print("fkUbicacion ", fkUbicacion)
        print("codigoPostal ", codigoPostal)
        print("puebloCiudad ", puebloCiudad)
        print("municipio ", municipio)
        print("estado ", estado)
        print("Metodos ", metodosPago)
        print("numerosTelfono ", numerosTelefono)
        print("pkTelefonos ", pkTelefonos)
        print("Paqueterías ", paqueterias)

        if Proveedor.editar_proveedor(pkProveedor, nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete, fkUbicacion, codigoPostal, puebloCiudad, municipio, estado, metodosPago, numerosTelefono, pkTelefonos, paqueterias):
            return jsonify({'mensaje': 'Proveedor editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el proveedor'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_proveedores.route('/', methods=['DELETE'])
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