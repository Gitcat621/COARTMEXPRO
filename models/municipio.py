from database import Database

class Municipio:
    def __init__(self, pkMunicipio=None, nombreMunicipio=None):
        """Inicializa un objeto"""
        self.pkMunicipio = pkMunicipio
        self.nombreMunicipio = nombreMunicipio


    @staticmethod
    def listar_municipios():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM municipios")
        db.close()
        return resultado
    
    def crear_municipio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO municipios (nombreMunicipio) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreMunicipio,))
        db.close()
        return resultado

    def editar_municipio(self):
        """Edita un registro en la base de datos."""
        if not self.pkMunicipio:
            raise ValueError("El municipio debe tener un ID para ser editado.")
        db = Database()
        print(self.pkMunicipio)
        query = "UPDATE municipios SET nombreMunicipio = %s WHERE pkMunicipio = %s"
        resultado = db.execute_commit(query, (self.nombreMunicipio, self.pkMunicipio))
        db.close()
        return resultado

    def eliminar_municipio(self):
        """Elimina un registro de la base de datos."""

        if not self.pkMunicipio:
            raise ValueError("El municipio debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM municipios WHERE pkMunicipio = %s"
        resultado = db.execute_commit(query, (self.pkMunicipio,))
        db.close()
        return resultado


