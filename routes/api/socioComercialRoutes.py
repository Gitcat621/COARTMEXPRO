from flask import Blueprint, request, jsonify, render_template
from models.socioComercial import SocioComercial

api_sociosComerciales = Blueprint('api_sociosComerciales', __name__)


#RUTAS API
@api_sociosComerciales.route('/', methods=['GET'])
def listar_sociosComerciales():
    """Endpoint para obtener todos los registros"""
    sociosComerciales = SocioComercial.listar_sociosComerciales()
    return jsonify(sociosComerciales), 200

@api_sociosComerciales.route('/tiendas', methods=['GET'])
def listar_tiendas_por_zona():
    """Endpoint para obtener todos los registros"""
    
    fkZonaRuta = request.args.get('fkZonaRuta')

    if not 'fkZonaRuta':
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos

    sociosComerciales = SocioComercial.listar_tiendas_por_zona(fkZonaRuta)
    return jsonify(sociosComerciales), 200

@api_sociosComerciales.route('/socio_comercial', methods=['GET'])
def obtener_socio():
    """Endpoint para obtener todos los registros"""
    
    pkSocioComercial = request.args.get('pkSocioComercial')

    if not pkSocioComercial:
        return jsonify({'mensaje': 'Faltan datos'}), 400  # Devuelve un error si faltan datos

    sociosComerciales = SocioComercial.obtener_socio(pkSocioComercial)
    return jsonify(sociosComerciales), 200

@api_sociosComerciales.route('/', methods=['POST'])
def crear_socioComercial():
    """Endpoint para insertar un registro"""
    data = request.json
    nombreSocio = data.get('nombreSocio')
    razonSocial = data.get('razonSocial')
    fkGrupoSocio = data.get('fkGrupoSocio')
    fkZonaRuta = data.get('fkZonaRuta')
    fkUbicacion = data.get('fkUbicacion')
    puebloCiudad = data.get('puebloCiudad')
    estado = data.get('estado')
    pais = data.get('pais')

    if SocioComercial.crear_socioComercial(nombreSocio, razonSocial, fkGrupoSocio, fkZonaRuta, fkUbicacion, puebloCiudad, estado, pais):
        return jsonify({'mensaje': 'Socio comercial insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar socio comercial'}), 500

@api_sociosComerciales.route('/', methods=['PUT'])
def editar_socioComercial():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkSocioComercial = data.get('pkSocioComercial')
        nombreSocio = data.get('nombreSocio')
        razonSocial = data.get('razonSocial')
        fkGrupoSocio = data.get('fkGrupoSocio')
        fkZonaRuta = data.get('fkZonaRuta')
        fkUbicacion = data.get('fkUbicacion')
        puebloCiudad = data.get('puebloCiudad')
        estado = data.get('estado')
        pais = data.get('pais')

        print(pkSocioComercial)
        print(nombreSocio)
        print(razonSocial)
        print(fkGrupoSocio)
        print('zona',fkZonaRuta)
        print(fkUbicacion)
        print(puebloCiudad)
        print(estado)
        print(pais)

        if SocioComercial.editar_socioComercial(pkSocioComercial,nombreSocio, razonSocial, fkGrupoSocio, fkZonaRuta, fkUbicacion, puebloCiudad, estado, pais):
            return jsonify({'mensaje': 'Socio comercial editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el socio comercial'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@api_sociosComerciales.route('/', methods=['DELETE'])
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