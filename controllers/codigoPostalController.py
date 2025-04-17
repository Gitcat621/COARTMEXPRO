from models.codigoPostal import CodigoPostal

class CodigoPostalController:
    @staticmethod
    def listar_codigosPostales():
        """Devuelve todos los registros registrados"""
        return CodigoPostal.listar_codigosPostales()

    @staticmethod
    def crear_codigoPostal(codigoPostal):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        codigoPostal_obj = CodigoPostal(codigoPostal=codigoPostal)
        return codigoPostal_obj.crear_codigoPostal()

    @staticmethod
    def editar_codigoPostal(pkCodigoPostal, codigoPostal):
        """Edita un registro"""
        codigoPostal_obj = CodigoPostal(pkCodigoPostal=pkCodigoPostal, codigoPostal=codigoPostal)
        return codigoPostal_obj.editar_codigoPostal()

    @staticmethod
    def eliminar_codigoPostal(pkCodigoPostal):
        """Elimina un registro"""
        codigoPostal_obj = CodigoPostal(pkCodigoPostal=pkCodigoPostal)
        return codigoPostal_obj.eliminar_codigoPostal()