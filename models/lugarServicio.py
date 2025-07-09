from database import Database

class LugarServicio:
    def __init__(self, pkLugarServicio=None, nombreLugarServicio=None):
        """Inicializa un objeto"""
        self.pkLugarServicio = pkLugarServicio
        self.nombreLugarServicio = nombreLugarServicio


    @staticmethod
    def listar_lugares_servicio():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM lugares_servicios_vehiculos")
        db.close()
        return resultado
    
    def crear_lugar_servicio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO lugares_servicios_vehiculos (nombreLugarServicio) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreLugarServicio,))
        db.close()
        return resultado

    def editar_lugar_servicio(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkLugarServicio)
        query = "UPDATE lugares_servicios_vehiculos SET nombreLugarServicio = %s WHERE pkLugarServicio = %s"
        resultado = db.execute_commit(query, (self.nombreLugarServicio, self.pkLugarServicio))
        db.close()
        return resultado

    def eliminar_lugar_servicio(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM lugares_servicios_vehiculos WHERE pkLugarServicio = %s"
        resultado = db.execute_commit(query, (self.pkLugarServicio,))
        db.close()
        return resultado


