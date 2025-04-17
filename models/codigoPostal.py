from database import Database

class CodigoPostal:
    def __init__(self, pkCodigoPostal=None, codigoPostal=None):
        """Inicializa un objeto"""
        self.pkCodigoPostal = pkCodigoPostal
        self.codigoPostal = codigoPostal


    @staticmethod
    def listar_codigosPostales():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM codigos_Postales")
        db.close()
        return resultado
    
    def crear_codigoPostal(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO codigos_Postales (codigoPostal) VALUES (%s)"
        resultado = db.execute_commit(query, (self.codigoPostal,))
        db.close()
        return resultado

    def editar_codigoPostal(self):
        """Edita un registro en la base de datos."""
        if not self.pkCodigoPostal:
            raise ValueError("El codigo postal debe tener un ID para ser editado.")
        db = Database()
        print(self.pkCodigoPostal)
        query = "UPDATE codigos_Postales SET codigoPostal = %s WHERE pkCodigoPostal = %s"
        resultado = db.execute_commit(query, (self.codigoPostal, self.pkCodigoPostal))
        db.close()
        return resultado

    def eliminar_codigoPostal(self):
        """Elimina un registro de la base de datos."""

        if not self.pkCodigoPostal:
            raise ValueError("El codigo postal debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM codigos_Postales WHERE pkCodigoPostal = %s"
        resultado = db.execute_commit(query, (self.pkCodigoPostal,))
        db.close()
        return resultado

