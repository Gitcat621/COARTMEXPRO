from database import Database

class PuebloCiudad:
    def __init__(self, pkPuebloCiudad=None, nombrePuebloCiudad=None):
        """Inicializa un objeto"""
        self.pkPuebloCiudad = pkPuebloCiudad
        self.nombrePuebloCiudad = nombrePuebloCiudad


    @staticmethod
    def listar_pueblosCiudades():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM pueblos_ciudades")
        db.close()
        return resultado
    
    def crear_puebloCiudad(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombrePuebloCiudad,))
        db.close()
        return resultado

    def editar_puebloCiudad(self):
        """Edita un registro en la base de datos."""
        if not self.pkPuebloCiudad:
            raise ValueError("El puebloCiudad debe tener un ID para ser editado.")
        db = Database()
        print(self.pkPuebloCiudad)
        query = "UPDATE pueblos_ciudades SET nombrePuebloCiudad = %s WHERE pkPuebloCiudad = %s"
        resultado = db.execute_commit(query, (self.nombrePuebloCiudad, self.pkPuebloCiudad))
        db.close()
        return resultado

    def eliminar_puebloCiudad(self):
        """Elimina un registro de la base de datos."""

        if not self.pkPuebloCiudad:
            raise ValueError("El puebloCiudad debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM pueblos_ciudades WHERE pkPuebloCiudad = %s"
        resultado = db.execute_commit(query, (self.pkPuebloCiudad,))
        db.close()
        return resultado


