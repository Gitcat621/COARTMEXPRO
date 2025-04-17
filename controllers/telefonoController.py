from models.telefono import Telefono

class TelefonoController:
    @staticmethod
    def listar_telefonos():
        """Devuelve todos los registros registrados"""
        return Telefono.listar_telefonos()

    @staticmethod
    def crear_telefono(numeroTelefono):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        telefono = Telefono(numeroTelefono=numeroTelefono)
        return telefono.crear_telefono()

    @staticmethod
    def editar_telefono(pkTelefono, numeroTelefono):
        """Edita un registro"""
        telefono = Telefono(pkTelefono=pkTelefono, numeroTelefono=numeroTelefono)
        return telefono.editar_telefono()

    @staticmethod
    def eliminar_telefono(pkTelefono):
        """Elimina un registro"""
        telefono = Telefono(pkTelefono=pkTelefono)
        return telefono.eliminar_telefono()