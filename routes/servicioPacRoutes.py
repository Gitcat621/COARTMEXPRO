from flask import Blueprint, request, jsonify
from models.servicioPac import ServicioPac

servicio_pac_bp = Blueprint('servicios_pac_bp', __name__)

# Ruta para obtener todos los servicios PAC
@servicio_pac_bp.route('/servicios_pac', methods=['GET'])
def listar_servicio_pac():
    """Endpoint para obtener todos los registros"""
    servicios_pac = ServicioPac.listar_servicio_pac()
    return jsonify(servicios_pac), 200

# Ruta para insertar un nuevo servicio PAC
@servicio_pac_bp.route('/servicios_pac', methods=['POST'])
def crear_servicio_pac():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroSesion = data.get('numeroSesion')
    fechaSesion = data.get('fechaSesion')
    costoSesion = data.get('costoSesion')
    montoApoyo = data.get('montoApoyo')
    fkEmpleado = data.get('numeroEmpleado')
    fkBeneficio = data.get('fkBeneficio')
    fkClinica = data.get('fkClinica')

    if not numeroSesion or not fechaSesion or not costoSesion or not montoApoyo or not fkEmpleado or not fkBeneficio or not fkClinica:
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    servicio_pac = ServicioPac(None, numeroSesion, fechaSesion, costoSesion, montoApoyo, fkEmpleado, fkBeneficio, fkClinica)
    if servicio_pac.crear_servicio_pac():
        return jsonify({'mensaje': 'Servicio PAC insertado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar servicio PAC'}), 500

# Ruta para editar un servicio PAC
@servicio_pac_bp.route('/servicios_pac', methods=['PUT'])
def editar_servicio_pac():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkServicioPac = data.get('pkServicioPac')
        numeroSesion = data.get('numeroSesion')
        fechaSesion = data.get('fechaSesion')
        costoSesion = data.get('costoSesion')
        montoApoyo = data.get('montoApoyo')
        fkBeneficio = data.get('fkBeneficio')
        fkClinica = data.get('fkClinica')

        if not pkServicioPac or not numeroSesion or not fechaSesion or not costoSesion or not montoApoyo or not fkBeneficio or not fkClinica:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        servicio_pac = ServicioPac(pkServicioPac=pkServicioPac, numeroSesion=numeroSesion, fechaSesion=fechaSesion, costoSesion=costoSesion, montoApoyo=montoApoyo, fkBeneficio=fkBeneficio, fkClinica=fkClinica)
        if servicio_pac.editar_servicio_pac():
            return jsonify({'mensaje': 'Servicio PAC editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el servicio PAC'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

# Ruta para eliminar un servicio PAC
@servicio_pac_bp.route('/servicios_pac', methods=['DELETE'])
def eliminar_servicio_pac():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkServicioPac = data.get('pkServicioPac')

        if not pkServicioPac:
            return jsonify({'mensaje': 'Faltan datos'}), 400

        servicio_pac = ServicioPac(pkServicioPac)
        if servicio_pac.eliminar_servicio_pac():
            return jsonify({'mensaje': 'Servicio PAC eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el servicio PAC'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
