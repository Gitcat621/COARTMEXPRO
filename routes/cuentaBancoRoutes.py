from flask import Blueprint, request, jsonify
from models.cuentaBanco import CuentaBanco

cuentaBanco_bp = Blueprint('cuentaBanco_bp', __name__)

@cuentaBanco_bp.route('/cuentas_banco', methods=['GET'])
def listar_cuentas():
    """Endpoint para obtener todos los registros"""
    cuentas = CuentaBanco.listar_cuentas()
    return jsonify(cuentas), 200

@cuentaBanco_bp.route('/cuentas_banco', methods=['POST'])
def crear_cuenta():
    """Endpoint para insertar un registro"""
    data = request.json
    numeroCuenta = data.get('numeroCuenta')
    nombreBeneficiario = data.get('nombreBeneficiario')
    fkBanco = data.get('fkBanco')
    fkProveedor = data.get('fkProveedor')

    print(numeroCuenta)
    print(nombreBeneficiario)
    print(fkBanco)
    print(fkProveedor)

    if not isinstance(numeroCuenta, str):
        return jsonify({'mensaje': 'numeroCuenta debe ser una cadena de texto'}), 400

    if not isinstance(nombreBeneficiario, str):
        return jsonify({'mensaje': 'nombreBeneficiario debe ser una cadena de texto'}), 400

    if not numeroCuenta or not nombreBeneficiario:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    cuentaBanco = CuentaBanco(numeroCuenta=numeroCuenta, nombreBeneficiario=nombreBeneficiario, fkBanco=fkBanco, fkProveedor=fkProveedor)
    if cuentaBanco.crear_cuenta():
        return jsonify({'mensaje': 'Cuenta de banco insertada correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al insertar cuenta de banco'}), 500

@cuentaBanco_bp.route('/cuentas_banco', methods=['PUT'])
def editar_cuenta():
    """Endpoint para editar un registro"""
    try:
        data = request.json
        pkCuentaBanco = data.get('pkCuentaBanco')
        numeroCuenta = data.get('numeroCuenta')
        nombreBeneficiario = data.get('nombreBeneficiario')
        fkBanco = data.get('fkBanco')
        fkProveedor = data.get('fkProveedor')

        print(pkCuentaBanco)
        print(numeroCuenta)
        print(nombreBeneficiario)
        print(fkBanco)
        print(fkProveedor)

        cuentaBanco = CuentaBanco(pkCuentaBanco, numeroCuenta, nombreBeneficiario, fkBanco, fkProveedor)
        if cuentaBanco.editar_cuenta():
            return jsonify({'mensaje': 'Cuenta de banco editada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar la cuenta de banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@cuentaBanco_bp.route('/cuentas_banco', methods=['DELETE'])
def eliminar_cuenta():
    """Endpoint para eliminar un registro"""
    try:
        data = request.json
        pkCuentaBanco = data.get('pkCuentaBanco')

        if CuentaBanco.eliminar_cuenta(pkCuentaBanco):
            return jsonify({'mensaje': 'Cuenta de banco eliminada correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar la cuenta de banco'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500