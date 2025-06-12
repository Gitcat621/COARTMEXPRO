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
    puebloCiudad = data.get('puebloCiudad')
    estado = data.get('estado')
    pais = data.get('pais')

    print(fkUbicacion)
    print(puebloCiudad)
    print(estado)
    print(pais)

    if SocioComercial.crear_socioComercial(nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, puebloCiudad, estado, pais):
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
        puebloCiudad = data.get('puebloCiudad')
        estado = data.get('estado')
        pais = data.get('pais')

        print(pkSocioComercial)
        print(nombreSocio)
        print(razonSocial)
        print(fkGrupoSocio)
        print(fkUbicacion)
        print(puebloCiudad)
        print(estado)
        print(pais)

        if SocioComercial.editar_socioComercial(pkSocioComercial,nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, puebloCiudad, estado, pais):
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