from database import Database

class Clinica:
    def __init__(self, pkClinica=None, nombreClinica=None):
        """Inicializa un objeto"""
        self.pkClinica = pkClinica
        self.nombreClinica = nombreClinica


    @staticmethod
    def listar_clinicas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM clinicas"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_clinica(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO clinicas (nombreClinica) VALUES (%s)"
        valores = (self.nombreClinica,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_clinicas(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE clinicas SET nombreClinica = %s WHERE pkClinica = %s"
        valores = (self.nombreClinica, self.pkClinica)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_clinicas(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM clinicas WHERE pkClinica = %s"
        valores = (self.pkClinica,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

