from database import Database

class ManoObra:
    def __init__(self, pkManoObra=None, nombreManoObra=None):
        """Inicializa un objeto"""
        self.pkManoObra = pkManoObra
        self.nombreManoObra = nombreManoObra


    @staticmethod
    def listar_manos_obra():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM manos_obra")
        db.close()
        return resultado
    
    def crear_mano_obra(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO manos_obra (nombreManoObra) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreManoObra,))
        db.close()
        return resultado

    def editar_mano_obra(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkManoObra)
        query = "UPDATE manos_obra SET nombreManoObra = %s WHERE pkManoObra = %s"
        resultado = db.execute_commit(query, (self.nombreManoObra, self.pkManoObra))
        db.close()
        return resultado

    def eliminar_mano_obra(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM manos_obra WHERE pkManoObra = %s"
        resultado = db.execute_commit(query, (self.pkManoObra,))
        db.close()
        return resultado


