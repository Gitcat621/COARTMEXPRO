from flask import Blueprint, request, jsonify
from models.articulo import Articulo

articulo_bp = Blueprint('articulo_bp', __name__)

@articulo_bp.route('/articulos', methods=['GET'])
def listar_articulos():
    """Endpoint para obtener todos los registros"""

    articulos = Articulo.listar_articulos()
    return jsonify(articulos), 200

@articulo_bp.route('/inventario', methods=['GET'])
def listar_inventario():
    """Endpoint para obtener todos los registros"""

    # Obtener parámetros de la URL
    year = request.args.get('year') 
    month = request.args.get('month')

    if not year:
            year = 'YEAR(CURDATE())'

    if not month:
        month = 'MONTH(CURDATE())'

    articulos = Articulo.listar_inventario(year, month)
    return jsonify(articulos), 200

@articulo_bp.route('/articulos', methods=['POST'])
def crear_articulo():
    """Endpoint para insertar un registro"""
    data = request.json
    codigoArticulo = data.get('codigoArticulo')
    nombreArticulo = data.get('nombreArticulo')
    precioAlmacen = float(data.get('precioAlmacen'))  # Convertir a float
    fkProveedor = int(data.get('fkProveedor'))  # Convertir a entero
    fkCategoriaArticulo = int(data.get('fkCategoriaArticulo'))  # Convertir a entero



    if not isinstance(nombreArticulo, str):
        return jsonify({'mensaje': 'nombreArticulo debe ser una cadena de texto'}), 400

    if not isinstance(precioAlmacen, (int, float)):
        return jsonify({'mensaje': 'precioAlmacen debe ser un número'}), 400

    if not isinstance(fkProveedor, int):
        return jsonify({'mensaje': 'fkProveedor debe ser un entero'}), 400

    if not isinstance(fkCategoriaArticulo, int):
        return jsonify({'mensaje': 'fkCategoriaArticulo debe ser un entero'}), 400

    if not nombreArticulo or precioAlmacen is None or fkProveedor is None or fkCategoriaArticulo is None:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    articulo = Articulo(codigoArticulo=codigoArticulo, nombreArticulo=nombreArticulo, precioAlmacen=precioAlmacen, fkProveedor=fkProveedor, fkCategoriaArticulo=fkCategoriaArticulo)
    if articulo.crear_articulo():
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
        precioAlmacen = float(data.get('precioAlmacen'))  # Convertir a float
        fkProveedor = int(data.get('fkProveedor'))  # Convertir a entero
        fkCategoriaArticulo = int(data.get('fkCategoriaArticulo'))  # Convertir a entero

        articulo = Articulo(codigoArticulo=codigoArticulo, nombreArticulo=nombreArticulo, precioAlmacen=precioAlmacen, fkProveedor=fkProveedor, fkCategoriaArticulo=fkCategoriaArticulo)
        if articulo.editar_articulo():
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

        articulo = Articulo(codigoArticulo)
        if articulo.eliminar_articulo():
            return jsonify({'mensaje': 'Articulo eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el articulo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500