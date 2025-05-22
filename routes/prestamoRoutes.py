from flask import Blueprint, request, jsonify
from models.prestamo import Prestamo

prestamo_bp = Blueprint('prestamo_bp', __name__)

# Rutas endpoints
@prestamo_bp.route('/prestamos', methods=['GET'])
def listar_prestamos():
    """Endpoint para obtener todos los préstamos."""
    prestamos = Prestamo.listar_prestamos()
    return jsonify(prestamos), 200

@prestamo_bp.route('/prestamos', methods=['POST'])
def crear_prestamo():
    """Endpoint para crear un préstamo."""
    data = request.json
    formaPago = data.get('formaPago')
    fechaPrestamo = data.get('fechaPrestamo')
    motivoPrestamo = data.get('motivoPrestamo')
    montoPrestamo = data.get('montoPrestamo')
    montoApoyo = data.get('montoApoyo')
    fechaTerminoPago = data.get('fechaTerminoPago')
    fkEmpleado = data.get('numeroEmpleado')

    if not formaPago or not fechaPrestamo or not motivoPrestamo or not montoPrestamo or not fkEmpleado:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    prestamo = Prestamo(formaPago=formaPago, fechaPrestamo=fechaPrestamo, motivoPrestamo=motivoPrestamo,
                        montoPrestamo=montoPrestamo, montoApoyo=montoApoyo, fechaTerminoPago=fechaTerminoPago, fkEmpleado=fkEmpleado)
    
    if prestamo.crear_prestamo():
        return jsonify({'mensaje': 'Préstamo creado correctamente'}), 201
    else:
        return jsonify({'mensaje': 'Error al crear préstamo'}), 500

@prestamo_bp.route('/prestamos', methods=['PUT'])
def editar_prestamo():
    """Endpoint para editar un préstamo."""
    try:
        data = request.json
        pkPrestamo = int(data.get('pkPrestamo'))
        formaPago = data.get('formaPago')
        fechaPrestamo = data.get('fechaPrestamo')
        motivoPrestamo = data.get('motivoPrestamo')
        montoPrestamo = data.get('montoPrestamo')
        montoApoyo = data.get('montoApoyo')
        fechaTerminoPago = data.get('fechaTerminoPago')

        if not pkPrestamo or not formaPago or not fechaPrestamo or not motivoPrestamo or not montoPrestamo:
            return jsonify({'mensaje': 'Faltan datos'}), 400
        
        prestamo = Prestamo(pkPrestamo=pkPrestamo, formaPago=formaPago, fechaPrestamo=fechaPrestamo, motivoPrestamo=motivoPrestamo,
                            montoPrestamo=montoPrestamo, montoApoyo=montoApoyo, fechaTerminoPago=fechaTerminoPago)
        
        if prestamo.editar_prestamos():
            return jsonify({'mensaje': 'Préstamo editado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo editar el préstamo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500

@prestamo_bp.route('/prestamos', methods=['DELETE'])
def eliminar_prestamo():
    """Endpoint para eliminar un préstamo."""
    try:
        data = request.json
        pkPrestamo = int(data.get('pkPrestamo'))

        if not isinstance(pkPrestamo, int):
            return jsonify({'mensaje': 'ID inválido'}), 400

        prestamo = Prestamo(pkPrestamo=pkPrestamo)
        if prestamo.eliminar_prestamos():
            return jsonify({'mensaje': 'Préstamo eliminado correctamente'}), 200
        else:
            return jsonify({'mensaje': 'No se pudo eliminar el préstamo'}), 500

    except Exception as e:
        return jsonify({'mensaje': f'Error en el servidor: {str(e)}'}), 500
