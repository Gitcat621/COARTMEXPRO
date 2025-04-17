from flask import Blueprint, request, jsonify
from controllers.cuentaBancoController import CuentaBancoController

cuentaBanco_bp = Blueprint('cuentaBanco_bp', __name__)

@cuentaBanco_bp.route('/cuentasBanco', methods=['GET'])
def listar_cuentas():
    """Endpoint para obtener todos los registros"""
    cuentas = CuentaBancoController.listar_cuentas()
    return jsonify(cuentas), 200

@cuentaBanco_bp.route('/cuentasBanco', methods=['POST'])
def crear_cuenta():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroCuenta = data.get('numeroCuenta')
    nombreBeneficiario = data.get('nombreBeneficiario')

    if not isinstance(numeroCuenta, str):
        return jsonify({'mensaje': 'numeroCuenta debe ser una cadena de texto'}), 400

    if not isinstance(nombreBeneficiario, str):
        return jsonify({'mensaje': 'nombreBeneficiario debe ser una cadena de texto'}), 400

    if not numeroCuenta or not nombreBeneficiario:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    if CuentaBancoController.crear_cuenta(numeroCuenta, nombreBeneficiario):
        return jsonify({'mensaje': 'Cuenta de banco insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar cuenta de banco'}), 500

@cuentaBanco_bp.route('/cuentasBanco', methods=['PUT'])
def editar_cuenta():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCuentaBanco = data.get('pkCuentaBanco')
        numeroCuenta = data.get('numeroCuenta')
        nombreBeneficiario = data.get('nombreBeneficiario')

        if CuentaBancoController.editar_cuenta(pkCuentaBanco, numeroCuenta, nombreBeneficiario):
            return jsonify({'mensaje': 'Cuenta de banco editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la cuenta de banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@cuentaBanco_bp.route('/cuentasBanco', methods=['DELETE'])
def eliminar_cuenta():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCuentaBanco = data.get('pkCuentaBanco')

        if CuentaBancoController.eliminar_cuenta(pkCuentaBanco):
            return jsonify({'mensaje': 'Cuenta de banco eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la cuenta de banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500