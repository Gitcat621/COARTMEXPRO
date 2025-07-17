from flask import Blueprint, request, jsonify
from models.categoriaArticulo import CategoriaArticulo

api_categoriasArticulo = Blueprint('api_categoriasArticulo', __name__)

@api_categoriasArticulo.route('/', methods=['GET'])
def listar_categoriaArticulos():
    """Endpoint para obtener todos los registros"""
    categoriaArticulos = CategoriaArticulo.listar_categoriaArticulos()
    return jsonify(categoriaArticulos), 200

@api_categoriasArticulo.route('/', methods=['POST'])
def crear_categoriaArticulo():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreCategoriaArticulo = data.get('nombreCategoriaArticulo')

    print('aqui', nombreCategoriaArticulo)

    if not isinstance(nombreCategoriaArticulo, str):
        return jsonify({'mensaje': 'nombreCategoriaArticulo debe ser una cadena de texto'}), 400

    if not nombreCategoriaArticulo:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    categoriaArticulo = CategoriaArticulo(nombreCategoriaArticulo=nombreCategoriaArticulo)
    if categoriaArticulo.crear_categoriaArticulo():
        return jsonify({'mensaje': 'Categoria de articulo insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar categoria de articulo'}), 500

@api_categoriasArticulo.route('/', methods=['PUT'])
def editar_categoriaArticulo():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCategoriaArticulo = data.get('pkCategoriaArticulo')
        nombreCategoriaArticulo = data.get('nombreCategoriaArticulo')

        categoriaArticulo = CategoriaArticulo(pkCategoriaArticulo, nombreCategoriaArticulo)
        if categoriaArticulo.editar_categoriaArticulo():
            return jsonify({'mensaje': 'Categoria de articulo editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la categoria de articulo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_categoriasArticulo.route('/', methods=['DELETE'])
def eliminar_categoriaArticulo():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCategoriaArticulo = data.get('pkCategoriaArticulo')

        categoriaArticulo = CategoriaArticulo(pkCategoriaArticulo)
        if categoriaArticulo.eliminar_categoriaArticulo():
            return jsonify({'mensaje': 'Categoria de articulo eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la categoria de articulo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500