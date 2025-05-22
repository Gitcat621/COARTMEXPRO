from database import Database

class Presentador:
    def __init__(self, pkPresentador=None, nombrePresentador=None):
        """Inicializa un objeto"""
        self.pkPresentador = pkPresentador
        self.nombrePresentador = nombrePresentador


    @staticmethod
    def listar_presentadores():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM presentadores")
        db.close()
        return resultado
    
    def crear_presentador(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO presentadores (nombrePresentador) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombrePresentador,))
        db.close()
        return resultado

    def editar_presentador(self):
        """Edita un registro en la base de datos."""

        db = Database()
        query = "UPDATE presentadores SET nombrePresentador = %s WHERE pkPresentador = %s"
        resultado = db.execute_commit(query, (self.nombrePresentador, self.pkPresentador))
        db.close()
        return resultado

    def eliminar_presentador(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM presentadores WHERE pkPresentador = %s"
        resultado = db.execute_commit(query, (self.pkPresentador,))
        db.close()
        return resultado


