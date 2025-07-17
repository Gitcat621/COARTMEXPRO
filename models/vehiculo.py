from database import Database

class Vehiculo:
    def __init__(self, pkVehiculo=None, nombreVehiculo=None):
        """Inicializa un objeto"""
        self.pkVehiculo = pkVehiculo
        self.nombreVehiculo = nombreVehiculo


    @staticmethod
    def listar_vehiculos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM vehiculos")
        db.close()
        return resultado
    
    def obtener_vehiculo(pkVehiculo):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM vehiculos WHERE pkVehiculo = %s",(pkVehiculo,))
        db.close()
        return resultado
    
    def crear_vehiculo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO vehiculos (nombreVehiculo) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreVehiculo,))
        db.close()
        return resultado

    def editar_vehiculo(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkVehiculo)
        query = "UPDATE vehiculos SET nombreVehiculo = %s WHERE pkVehiculo = %s"
        resultado = db.execute_commit(query, (self.nombreVehiculo, self.pkVehiculo))
        db.close()
        return resultado

    def eliminar_vehiculo(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM vehiculos WHERE pkVehiculo = %s"
        resultado = db.execute_commit(query, (self.pkVehiculo,))
        db.close()
        return resultado


