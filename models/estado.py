from database import Database

class Estado:
    def __init__(self, pkEstado=None, nombreEstado=None):
        """Inicializa un objeto"""
        self.pkEstado = pkEstado
        self.nombreEstado = nombreEstado


    @staticmethod
    def listar_estados():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM estados")
        db.close()
        return resultado
    
    def crear_estado(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO estados (nombreEstado) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreEstado,))
        db.close()
        return resultado

    def editar_estado(self):
        """Edita un registro en la base de datos."""
        if not self.pkEstado:
            raise ValueError("El estado debe tener un ID para ser editado.")
        db = Database()
        print(self.pkEstado)
        query = "UPDATE estados SET nombreEstado = %s WHERE pkEstado = %s"
        resultado = db.execute_commit(query, (self.nombreEstado, self.pkEstado))
        db.close()
        return resultado

    def eliminar_estado(self):
        """Elimina un registro de la base de datos."""

        if not self.pkEstado:
            raise ValueError("El estado debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM estados WHERE pkEstado = %s"
        resultado = db.execute_commit(query, (self.pkEstado,))
        db.close()
        return resultado

