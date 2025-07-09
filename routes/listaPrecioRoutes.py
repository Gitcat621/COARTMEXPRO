from flask import Blueprint, request, jsonify
from models.listaPrecio import ListaPrecio

lista_precio_bp = Blueprint('lista_precio_bp', __name__)

# Ruta para obtener todas las listas de precios
@lista_precio_bp.route('/listas_precios', methods=['GET'])
def listar_listas_precios():
    """Endpoint para obtener todos los registros"""
    listas_precios = ListaPrecio.listar_listas_precios()
    return jsonify(listas_precios), 200

@lista_precio_bp.route('/lista_precios', methods=['GET'])
def obtener_lista_precio():
    """Endpoint para obtener todos los cursos de un empleado."""
    fkSocioComercial = request.args.get('fkSocioComercial')

    if not fkSocioComercial:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    listaPrecio = ListaPrecio(fkSocioComercial=fkSocioComercial)
    resultado = listaPrecio.obtener_lista_precio()

    # Asegura que se devuelva una lista vacía si no hay resultados
    if resultado is not None:
        return jsonify(resultado), 200
    else:
        return jsonify({'mensaje': 'Error interno'}), 500

# Ruta para insertar una nueva lista de precios
@lista_precio_bp.route('/listas_precios', methods=['POST'])
def crear_lista_precio():
    """Endpoint para insertar un registro"""
    data = request.json
    articulos = data.get('articulos')
    fkSocioComercial = data.get('fkSocioComercial')
    modo = data.get('modo')

    print(articulos)
    print(fkSocioComercial)

    if not articulos or not fkSocioComercial:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if ListaPrecio.crear_lista_precios(articulos, fkSocioComercial, modo):
        return jsonify({'mensaje': 'Lista de precio insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar lista de precio'}), 500

# Ruta para editar una lista de precios
@lista_precio_bp.route('/listas_precios', methods=['PUT'])
def editar_lista_precio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        fkArticulo = data.get('fkArticulo')
        fkSocioComercial = data.get('fkSocioComercial')
        precioArticulo = data.get('precioArticulo')

        if not fkArticulo or not fkSocioComercial or precioArticulo is None:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        lista_precio = ListaPrecio(fkArticulo, fkSocioComercial, precioArticulo)
        if lista_precio.editar_lista_precios():
            return jsonify({'mensaje': 'Lista de precio editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la lista de precio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar una lista de precios
@lista_precio_bp.route('/listas_precios', methods=['DELETE'])
def eliminar_lista_precio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        fkArticulo = data.get('fkArticulo')
        fkSocioComercial = data.get('fkSocioComercial')

        if not fkArticulo or not fkSocioComercial:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        lista_precio = ListaPrecio(fkArticulo, fkSocioComercial)
        if lista_precio.eliminar_lista_precios():
            return jsonify({'mensaje': 'Lista de precio eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la lista de precio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
