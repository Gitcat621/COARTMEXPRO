from models.paqueteria import Paqueteria

class PaqueteriaController:
    @staticmethod
    def listar_paqueterias():
        """Devuelve todos los registros registrados"""
        return Paqueteria.listar_paqueterias()

    @staticmethod
    def crear_paqueteria(nombrePaqueteria):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        paqueteria = Paqueteria(nombrePaqueteria=nombrePaqueteria)
        return paqueteria.crear_paqueteria()

    @staticmethod
    def editar_paqueteria(pkPaqueteria, nombrePaqueteria):
        """Edita un registro"""
        paqueteria = Paqueteria(pkPaqueteria=pkPaqueteria, nombrePaqueteria=nombrePaqueteria)
        return paqueteria.editar_paqueteria()

    @staticmethod
    def eliminar_paqueteria(pkPaqueteria):
        """Elimina un registro"""
        paqueteria = Paqueteria(pkPaqueteria=pkPaqueteria)
        return paqueteria.eliminar_paqueteria()