from database import Database

class Prestamo:
    def __init__(self, 
                pkPrestamo=None, 
                formaPago=None, 
                fechaPrestamo=None,
                motivoPrestamo=None,
                montoPrestamo=None,
                montoApoyo=None,
                fechaTerminoPago=None,
                fkEmpleado=None):
        """Inicializa un objeto"""
        self.pkPrestamo = pkPrestamo
        self.formaPago = formaPago
        self.fechaPrestamo = fechaPrestamo
        self.motivoPrestamo = motivoPrestamo
        self.montoPrestamo = montoPrestamo
        self.montoApoyo = montoApoyo
        self.fechaTerminoPago = fechaTerminoPago
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_prestamos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM prestamos"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_prestamo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO prestamos (formaPago, fechaPrestamo, motivoPrestamo, montoPrestamo, montoApoyo, fechaTerminoPago, fkEmpleado) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        valores = (self.formaPago, self.fechaPrestamo, self.motivoPrestamo, self.montoPrestamo, self.montoApoyo, self.fechaTerminoPago, self.fkEmpleado)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_prestamos(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE prestamos SET formaPago = %s, fechaPrestamo = %s, motivoPrestamo = %s, montoPrestamo = %s, montoApoyo = %s, fechaTerminoPago = %s WHERE pkPrestamo = %s"
        valores = (self.formaPago, self.fechaPrestamo, self.motivoPrestamo, self.montoPrestamo, self.montoApoyo, self.fechaTerminoPago, self.pkPrestamo)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_prestamos(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM prestamos WHERE pkPrestamo = %s"
        valores = (self.pkPrestamo,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

