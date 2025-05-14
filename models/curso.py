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
        consulta = "SELECT * FROM cursos"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()
        return resultado
    
    def crear_curso(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO cursos (nombreCurso) VALUES (%s)"
        valores = (self.nombreCurso,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def crear_asistencia_curso(fkEmpleado, fkCurso, fechaAsistencia):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            INSERT INTO asistencias_cursos (fkEmpleado, fkCurso, fechaAsistencia) 
            VALUES (%s, %s, %s)
        """
        valores = (fkEmpleado, fkCurso, fechaAsistencia)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_curso(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE cursos SET nombreCurso = %s WHERE pkCurso = %s"
        valores = (self.nombreCurso, self.pkCurso)
        print (consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_curso(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM cursos WHERE pkCurso = %s"
        valores = (self.pkCurso,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

