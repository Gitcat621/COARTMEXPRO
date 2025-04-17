from database import Database

class Paqueteria:
    def __init__(self, pkPaqueteria=None, nombrePaqueteria=None):
        """Inicializa un objeto"""
        self.pkPaqueteria = pkPaqueteria
        self.nombrePaqueteria = nombrePaqueteria


    @staticmethod
    def listar_paqueterias():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM paqueterias")
        db.close()
        return resultado
    
    def crear_paqueteria(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO paqueterias (nombrePaqueteria) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombrePaqueteria,))
        db.close()
        return resultado

    def editar_paqueteria(self):
        """Edita un registro en la base de datos."""
        if not self.pkPaqueteria:
            raise ValueError("La paqueteria debe tener un ID para ser editado.")
        db = Database()
        print(self.pkPaqueteria)
        query = "UPDATE paqueterias SET nombrePaqueteria = %s WHERE pkPaqueteria = %s"
        resultado = db.execute_commit(query, (self.nombrePaqueteria, self.pkPaqueteria))
        db.close()
        return resultado

    def eliminar_paqueteria(self):
        """Elimina un registro de la base de datos."""

        if not self.pkPaqueteria:
            raise ValueError("La paqueteria debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM paqueterias WHERE pkPaqueteria = %s"
        resultado = db.execute_commit(query, (self.pkPaqueteria,))
        db.close()
        return resultado


