from database import Database

class Pais:
    def __init__(self, pkPais=None, nombrePais=None):
        """Inicializa un objeto"""
        self.pkPais = pkPais
        self.nombrePais = nombrePais


    @staticmethod
    def listar_paises():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM paises")
        db.close()
        return resultado
    
    def crear_pais(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO paises (nombrePais) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombrePais,))
        db.close()
        return resultado

    def editar_pais(self):
        """Edita un registro en la base de datos."""
        if not self.pkPais:
            raise ValueError("El pais debe tener un ID para ser editado.")
        db = Database()
        print(self.pkPais)
        query = "UPDATE paises SET nombrePais = %s WHERE pkPais = %s"
        resultado = db.execute_commit(query, (self.nombrePais, self.pkPais))
        db.close()
        return resultado

    def eliminar_pais(self):
        """Elimina un registro de la base de datos."""

        if not self.pkPais:
            raise ValueError("El pais debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM paises WHERE pkPais = %s"
        resultado = db.execute_commit(query, (self.pkPais,))
        db.close()
        return resultado


