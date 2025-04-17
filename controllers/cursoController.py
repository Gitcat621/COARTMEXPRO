from models.curso import Curso

class CursoController:
    @staticmethod
    def listar_cursos():
        """Devuelve todos los registros registrados"""
        return Curso.listar_cursos()

    @staticmethod
    def crear_curso(nombreCurso):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        curso = Curso(nombreCurso=nombreCurso)
        return curso.crear_curso()

    @staticmethod
    def editar_curso(pkCurso, nombreCurso):
        """Edita un registro"""
        curso = Curso(pkCurso=pkCurso, nombreCurso=nombreCurso)
        return curso.editar_curso()

    @staticmethod
    def eliminar_curso(pkCurso):
        """Elimina un registro"""
        curso = Curso(pkCurso=pkCurso)
        return curso.eliminar_curso()