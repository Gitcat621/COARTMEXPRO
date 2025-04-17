from database import Database

class Curso:
    def __init__(self, pkCurso=None, nombreCurso=None):
        """Inicializa un objeto"""
        self.pkCurso = pkCurso
        self.nombreCurso = nombreCurso


    @staticmethod
    def listar_cursos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM cursos")
        db.close()
        return resultado
    
    def crear_curso(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO cursos (nombreCurso) VALUES (%s,%s)"
        resultado = db.execute_commit(query, (self.nombreCurso))
        db.close()
        return resultado

    def editar_curso(self):
        """Edita un registro en la base de datos."""
        if not self.pkCurso:
            raise ValueError("El curso debe tener un ID para ser editado.")
        db = Database()
        print(self.pkCurso)
        query = "UPDATE cursos SET nombreCurso = %s WHERE pkCurso = %s"
        resultado = db.execute_commit(query, (self.nombreCurso, self.pkCurso))
        db.close()
        return resultado

    def eliminar_curso(self):
        """Elimina un registro de la base de datos."""

        if not self.pkCurso:
            raise ValueError("El curso debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM cursos WHERE pkCurso = %s"
        resultado = db.execute_commit(query, (self.pkCurso,))
        db.close()
        return resultado

