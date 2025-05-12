from database import Database

class NumeroEmergencia:
    def __init__(self, pkNumeroEmergencia=None, numeroEmergencia=None, fkEmpleado = None):
        """Inicializa un objeto"""
        self.pkNumeroEmergencia = pkNumeroEmergencia
        self.numeroEmergencia = numeroEmergencia
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_numeros_emergencia():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM numeros_emergencia"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()
        return resultado
    
    def crear_numero_emergencia(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO numeros_emergencia (numeroEmergencia, fkEmpleado) VALUES (%s,%s)"
        valores = (self.numeroEmergencia, self.fkEmpleado)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def editar_numero_emergencia(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE numeros_emergencia SET numeroEmergencia = %s WHERE pkNumeroEmergencia = %s"
        valores = (self.numeroEmergencia, self.pkNumeroEmergencia)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def eliminar_numero_emergencia(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM numeros_emergencia WHERE pkNumeroEmergencia = %s"
        valores = (self.pkNumeroEmergencia,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

