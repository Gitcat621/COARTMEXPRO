from database import Database

class ServicioPac:
    def __init__(self, pkServicioPac=None, numeroSesion=None, fechaSesion=None, costoSesion=None, montoApoyo=None, fkEmpleado=None, fkBeneficio=None, fkClinica=None):
        """Inicializa un objeto"""
        self.pkServicioPac = pkServicioPac
        self.numeroSesion = numeroSesion
        self.fechaSesion = fechaSesion
        self.costoSesion = costoSesion
        self.montoApoyo = montoApoyo
        self.fkEmpelado = fkEmpleado
        self.fkBeneficio = fkBeneficio
        self.fkClinica = fkClinica


    @staticmethod
    def listar_servicio_pac():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM servicio_pac"
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_servicio_pac(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO servicio_pac (numeroSesion, fechaSesion, costoSesion, montoApoyo, fkEmpleado, fkBeneficio, fkClinica) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        valores = (self.numeroSesion,self.fechaSesion,self.costoSesion,self.montoApoyo, self.fkEmpelado, self.fkBeneficio, self.fkClinica)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_servicio_pac(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE servicio_pac SET numeroSesion = %s, fechaSesion = %s, costoSesion = %s, montoApoyo = %s, fkBeneficio = %s, fkClinica = %s WHERE pkServicioPac = %s"
        valores = (self.numeroSesion, self.fechaSesion, self.costoSesion, self.montoApoyo, self.fkBeneficio, self.fkClinica, self.pkServicioPac)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_servicio_pac(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM servicio_pac WHERE pkServicioPac = %s"
        valores = (self.pkServicioPac,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

