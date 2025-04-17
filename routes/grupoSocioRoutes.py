from flask import Blueprint, request, jsonify
from controllers.grupoSocioController import GrupoSocioComercialController

grupoSocioComercial_bp = Blueprint('grupoSocioComercial_bp', __name__)

@grupoSocioComercial_bp.route('/gruposSocio', methods=['GET'])
def listar_gruposSocio():
    """Endpoint para obtener todos los registros"""
    gruposSocio = GrupoSocioComercialController.listar_gruposSocio()
    return jsonify(gruposSocio), 200

@grupoSocioComercial_bp.route('/gruposSocio', methods=['POST'])
def crear_grupoSocio():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreGrupoSocio = data.get('nombreGrupoSocio')

    if not isinstance(nombreGrupoSocio, str):
        return jsonify({'mensaje': 'nombreGrupoSocio debe ser una cadena de texto'}), 400

    if not nombreGrupoSocio:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if GrupoSocioComercialController.crear_grupoSocio(nombreGrupoSocio):
        return jsonify({'mensaje': 'Grupo de socio insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar grupo de socio'}), 500

@grupoSocioComercial_bp.route('/gruposSocio', methods=['PUT'])
def editar_grupoSocio():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkGrupoSocio = data.get('pkGrupoSocio')
        nombreGrupoSocio = data.get('nombreGrupoSocio')

        if GrupoSocioComercialController.editar_grupoSocio(pkGrupoSocio, nombreGrupoSocio):
            return jsonify({'mensaje': 'Grupo de socio editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el grupo de socio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@grupoSocioComercial_bp.route('/gruposSocio', methods=['DELETE'])
def eliminar_grupoSocio():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkGrupoSocio = data.get('pkGrupoSocio')

        if GrupoSocioComercialController.eliminar_grupoSocio(pkGrupoSocio):
            return jsonify({'mensaje': 'Grupo de socio eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el grupo de socio'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500