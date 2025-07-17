from flask import Blueprint, request, jsonify
from models.grupoSocioComercial import GrupoSocioComercial

api_gruposSocioComercial = Blueprint('api_gruposSocioComercial', __name__)

@api_gruposSocioComercial.route('/', methods=['GET'])
def listar_gruposSocio():
    """Endpoint para obtener todos los registros"""
    gruposSocio = GrupoSocioComercial.listar_gruposSocio()
    return jsonify(gruposSocio), 200

@api_gruposSocioComercial.route('/', methods=['POST'])
def crear_grupoSocio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreGrupoSocio = data.get('nombreGrupoSocio')

    if not isinstance(nombreGrupoSocio, str):
        return jsonify({'mensaje': 'nombreGrupoSocio debe ser una cadena de texto'}), 400

    if not nombreGrupoSocio:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    grupoSocioComercial = GrupoSocioComercial(nombreGrupoSocio=nombreGrupoSocio)
    if grupoSocioComercial.crear_grupoSocio():
        return jsonify({'mensaje': 'Grupo de socio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar grupo de socio'}), 500

@api_gruposSocioComercial.route('/', methods=['PUT'])
def editar_grupoSocio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkGrupoSocio = data.get('pkGrupoSocio')
        nombreGrupoSocio = data.get('nombreGrupoSocio')

        grupoSocioComercial = GrupoSocioComercial(pkGrupoSocio, nombreGrupoSocio)
        if grupoSocioComercial.editar_grupoSocio():
            return jsonify({'mensaje': 'Grupo de socio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el grupo de socio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_gruposSocioComercial.route('/', methods=['DELETE'])
def eliminar_grupoSocio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkGrupoSocio = data.get('pkGrupoSocio')

        grupoSocioComercial = GrupoSocioComercial(pkGrupoSocio)
        if grupoSocioComercial.eliminar_grupoSocio():
            return jsonify({'mensaje': 'Grupo de socio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el grupo de socio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500