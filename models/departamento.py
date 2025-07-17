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
        consulta = "SELECT * FROM departamentos"
        print (consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_departamento(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO departamentos (nombreDepartamento) VALUES (%s)"
        valores = (self.nombreDepartamento,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_departamento(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE departamentos SET nombreDepartamento = %s WHERE pkDepartamento = %s"
        valores = (self.nombreDepartamento, self.pkDepartamento)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_departamento(self):
        """Elimina un registro de la base de datos."""
        db = Database()  
        consulta = "DELETE FROM departamentos WHERE pkDepartamento = %s"
        valores = (self.pkDepartamento,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

