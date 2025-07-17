from database import Database

class Telefono:
    def __init__(self, pkTelefono=None, numeroTelefono=None):
        """Inicializa un objeto"""
        self.pkTelefono = pkTelefono
        self.numeroTelefono = numeroTelefono


    @staticmethod
    def listar_telefonos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM telefonos")
        db.close()
        return resultado
    
    def crear_telefono(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO telefonos (numeroTelefono) VALUES (%s)"
        resultado = db.execute_commit(query, (self.numeroTelefono))
        db.close()
        return resultado

    def editar_telefono(self):
        """Edita un registro en la base de datos."""
        if not self.pkTelefono:
            raise ValueError("El telefono debe tener un ID para ser editado.")
        db = Database()
        print(self.pkTelefono)
        query = "UPDATE telefonos SET numeroTelefono = %s WHERE pkTelefono = %s"
        resultado = db.execute_commit(query, (self.numeroTelefono, self.pkTelefono))
        db.close()
        return resultado

    def eliminar_telefono(self):
        """Elimina un registro de la base de datos."""

        if not self.pkTelefono:
            raise ValueError("El telefono debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM telefonos WHERE pkTelefono = %s"
        resultado = db.execute_commit(query, (self.pkTelefono,))
        db.close()
        return resultado


