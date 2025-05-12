from database import Database

class Reunion:
    def __init__(self, pkReunion=None, fechaReunion=None, nombreReunion=None):
        """Inicializa un objeto"""
        self.pkReunion = pkReunion
        self.fechaReunion = fechaReunion
        self.nombreReunion = nombreReunion


    @staticmethod
    def listar_reuniones():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM reuniones"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_reunion(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO reuniones (fechaReunion, nombreReunion) VALUES (%s,%s)"
        valores = (self.fechaReunion, self.nombreReunion)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_reuniones(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE reuniones SET fechaReunion = %s, nombreReunion = %s WHERE pkReunion = %s"
        valores = (self.fechaReunion, self.nombreReunion, self.pkReunion)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_reuniones(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM reuniones WHERE pkReunion = %s"
        valores = (self.pkReunion,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

