from database import Database

class Departamento:
    def __init__(self, pkDepartamento=None, nombreDepartamento=None):
        """Inicializa un objeto"""
        self.pkDepartamento = pkDepartamento
        self.nombreDepartamento = nombreDepartamento


    @staticmethod
    def listar_departamentos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM departamentos")
        db.close()
        return resultado
    
    def crear_departamento(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO departamentos (nombreDepartamento) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreDepartamento,))
        db.close()
        return resultado

    def editar_departamento(self):
        """Edita un registro en la base de datos."""
        if not self.pkDepartamento:
            raise ValueError("El Departamento debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE departamentos SET nombreDepartamento = %s WHERE pkDepartamento = %s"
        resultado = db.execute_commit(query, (self.nombreDepartamento, self.pkDepartamento))
        db.close()
        return resultado

    def eliminar_departamento(self):
        """Elimina un registro de la base de datos."""

        if not self.pkDepartamento:
            raise ValueError("El Departamento debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM departamentos WHERE pkDepartamento = %s"
        resultado = db.execute_commit(query, (self.pkDepartamento,))
        db.close()
        return resultado

