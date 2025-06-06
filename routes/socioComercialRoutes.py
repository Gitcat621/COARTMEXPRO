from flask import Blueprint, request, jsonify
from models.socioComercial import SocioComercial

socioComercial_bp = Blueprint('socioComercial_bp', __name__)

@socioComercial_bp.route('/sociosComerciales', methods=['GET'])
def listar_sociosComerciales():
    """Endpoint para obtener todos los registros"""
    sociosComerciales = SocioComercial.listar_sociosComerciales()
    return jsonify(sociosComerciales), 200

@socioComercial_bp.route('/sociosComerciales', methods=['POST'])
def crear_socioComercial():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreSocio = data.get('nombreSocio')
    razonSocial = data.get('razonSocial')
    fkGrupoSocio = data.get('fkGrupoSocio')
    fkUbicacion = data.get('fkUbicacion')

    # if not isinstance(nombreSocio, str):
    #     return jsonify({'mensaje': 'nombreSocio debe ser una cadena de texto'}), 400

    if not isinstance(razonSocial, str):
        return jsonify({'mensaje': 'razonSocial debe ser una cadena de texto'}), 400

    # if not isinstance(fkGrupoSocio, int):
    #     return jsonify({'mensaje': 'fkGrupoSocio debe ser un entero'}), 400

    # if not isinstance(fkUbicacion, int):
    #     return jsonify({'mensaje': 'fkUbicacion debe ser un entero'}), 400

    if not nombreSocio or not razonSocial or fkGrupoSocio is None or fkUbicacion is None:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    socioComercial = SocioComercial(nombreSocio=nombreSocio, razonSocial=razonSocial, fkGrupoSocio=fkGrupoSocio, fkUbicacion=fkUbicacion)
    if socioComercial.crear_socioComercial():
        return jsonify({'mensaje': 'Socio comercial insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar socio comercial'}), 500

@socioComercial_bp.route('/sociosComerciales', methods=['PUT'])
def editar_socioComercial():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkSocioComercial = data.get('pkSocioComercial')
        nombreSocio = data.get('nombreSocio')
        razonSocial = data.get('razonSocial')
        fkGrupoSocio = data.get('fkGrupoSocio')
        fkUbicacion = data.get('fkUbicacion')

        print(data)

        socioComercial = SocioComercial(pkSocioComercial=pkSocioComercial, nombreSocio=nombreSocio, razonSocial=razonSocial, fkGrupoSocio=fkGrupoSocio, fkUbicacion=fkUbicacion)
        if socioComercial.editar_socioComercial():
            return jsonify({'mensaje': 'Socio comercial editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el socio comercial'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@socioComercial_bp.route('/sociosComerciales', methods=['DELETE'])
def eliminar_socioComercial():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkSocioComercial = data.get('pkSocioComercial')

        print(pkSocioComercial)

        socioComercial = SocioComercial(pkSocioComercial=pkSocioComercial)
        if socioComercial.eliminar_socioComercial():
            return jsonify({'mensaje': 'Socio comercial eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el socio comercial'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500