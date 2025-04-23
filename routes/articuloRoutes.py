from flask import Blueprint, request, jsonify
from models.articulo import Articulo

articulo_bp = Blueprint('articulo_bp', __name__)

@articulo_bp.route('/articulos/', methods=['GET'])
def listar_articulos():
    """Endpoint para obtener todos los registros"""

    # Obtener parámetros de la URL
    year = request.args.get('fecha') 
    month = request.args.get('mes')

    if not year:
            year = 'CURDATE()'

    if not month:
        month = 'CURDATE()'

    articulos = Articulo.listar_articulos(year, month)
    return jsonify(articulos), 200

@articulo_bp.route('/articulos', methods=['POST'])
def crear_articulo():
    """Endpoint para insertar un registro"""
    data = request.json
    codigoArticulo = data.get('codigoArticulo')
    nombreArticulo = data.get('nombreArticulo')
    precioAlmacen = data.get('precioAlmacen')
    fkProveedor = data.get('fkProveedor')
    fkCategoriaArticulo = data.get('fkCategoriaArticulo')


    if not isinstance(nombreArticulo, str):
        return jsonify({'mensaje': 'nombreArticulo debe ser una cadena de texto'}), 400

    # if not isinstance(precioAlmacen, (int, float)):
    #     return jsonify({'mensaje': 'precioAlmacen debe ser un número'}), 400

    # if not isinstance(fkProveedor, int):
    #     return jsonify({'mensaje': 'fkProveedor debe ser un entero'}), 400

    # if not isinstance(fkCategoriaArticulo, int):
    #     return jsonify({'mensaje': 'fkCategoriaArticulo debe ser un entero'}), 400

    if not nombreArticulo or precioAlmacen is None or fkProveedor is None or fkCategoriaArticulo is None:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if Articulo.crear_articulo(codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo):
        return jsonify({'mensaje': 'Articulo insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar articulo'}), 500

@articulo_bp.route('/articulos', methods=['PUT'])
def editar_articulo():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        codigoArticulo = data.get('codigoArticulo')
        nombreArticulo = data.get('nombreArticulo')
        precioAlmacen = data.get('precioAlmacen')
        fkProveedor = data.get('fkProveedor')
        fkCategoriaArticulo = data.get('fkCategoriaArticulo')

        print(data)

        if Articulo.editar_articulo(codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo):
            return jsonify({'mensaje': 'Articulo editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el articulo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@articulo_bp.route('/articulos', methods=['DELETE'])
def eliminar_articulo():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        codigoArticulo = data.get('codigoArticulo')

        if Articulo.eliminar_articulo(codigoArticulo):
            return jsonify({'mensaje': 'Articulo eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el articulo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500