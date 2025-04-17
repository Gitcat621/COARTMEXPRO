from models.departamento import Departamento

class DepartamentoController:
    @staticmethod
    def listar_departamentos():
        """Devuelve todos los registros registrados"""
        return Departamento.listar_departamentos()

    @staticmethod
    def crear_departamento(nombreDepartamento):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        departamento = Departamento(nombreDepartamento=nombreDepartamento)
        return departamento.crear_departamento()

    @staticmethod
    def editar_departamento(pkDepartamento, nombreDepartamento):
        """Edita un registro"""
        departamento = Departamento(pkDepartamento=pkDepartamento, nombreDepartamento=nombreDepartamento)
        return departamento.editar_departamento()

    @staticmethod
    def eliminar_departamento(pkDepartamento):
        """Elimina un registro"""
        departamento = Departamento(pkDepartamento=pkDepartamento)
        return departamento.eliminar_departamento()