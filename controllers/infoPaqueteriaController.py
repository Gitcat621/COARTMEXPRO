from models.infoPaqueteria import InfoPaqueteria

class InfoPaqueteriaController:
    @staticmethod
    def listar_infoPaqueterias():
        """Devuelve todos los registros registrados"""
        return InfoPaqueteria.listar_infoPaqueterias()

    @staticmethod
    def crear_infoPaqueteria(diasEntrega, flete):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        infoPaqueteria = InfoPaqueteria(diasEntrega=diasEntrega, flete=flete)
        return infoPaqueteria.crear_infoPaqueteria()

    @staticmethod
    def editar_infoPaqueteria(pkInfoPaqueteria, diasEntrega, flete):
        """Edita un registro"""
        infoPaqueteria = InfoPaqueteria(pkInfoPaqueteria=pkInfoPaqueteria, diasEntrega=diasEntrega, flete=flete)
        return infoPaqueteria.editar_infoPaqueteria()

    @staticmethod
    def eliminar_infoPaqueteria(pkInfoPaqueteria):
        """Elimina un registro"""
        infoPaqueteria = InfoPaqueteria(pkInfoPaqueteria=pkInfoPaqueteria)
        return infoPaqueteria.eliminar_infoPaqueteria()