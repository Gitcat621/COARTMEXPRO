from database import Database

class Banco:
    def __init__(self, pkBanco=None, nombreBanco=None):
        """Inicializa un objeto"""
        self.pkBanco = pkBanco
        self.nombreBanco = nombreBanco


    @staticmethod
    def listar_bancos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM bancos")
        db.close()
        return resultado
    
    def crear_banco(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO bancos (nombreBanco) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreBanco,))
        db.close()
        return resultado

    def editar_banco(self):
        """Edita un registro en la base de datos."""
        if not self.pkBanco:
            raise ValueError("El banco debe tener un ID para ser editado.")
        db = Database()
        print(self.pkBanco)
        query = "UPDATE bancos SET nombreBanco = %s WHERE pkBanco = %s"
        resultado = db.execute_commit(query, (self.nombreBanco, self.pkBanco))
        db.close()
        return resultado

    def eliminar_banco(self):
        """Elimina un registro de la base de datos."""

        if not self.pkBanco:
            raise ValueError("El banco debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM bancos WHERE pkBanco = %s"
        resultado = db.execute_commit(query, (self.pkBanco,))
        db.close()
        return resultado

