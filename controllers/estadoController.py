from models.estado import Estado

class EstadoController:
    @staticmethod
    def listar_estados():
        """Devuelve todos los registros registrados"""
        return Estado.listar_estados()

    @staticmethod
    def crear_estado(nombreEstado):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        estado = Estado(nombreEstado=nombreEstado)
        return estado.crear_estado()

    @staticmethod
    def editar_estado(pkEstado, nombreEstado):
        """Edita un registro"""
        estado = Estado(pkEstado=pkEstado, nombreEstado=nombreEstado)
        return estado.editar_estado()

    @staticmethod
    def eliminar_estado(pkEstado):
        """Elimina un registro"""
        estado = Estado(pkEstado=pkEstado)
        return estado.eliminar_estado()