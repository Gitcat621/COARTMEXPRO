from models.pais import Pais

class PaisController:
    @staticmethod
    def listar_paises():
        """Devuelve todos los registros registrados"""
        return Pais.listar_paises()

    @staticmethod
    def crear_pais(nombrePais):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        pais = Pais(nombrePais=nombrePais)
        return pais.crear_pais()

    @staticmethod
    def editar_pais(pkPais, nombrePais):
        """Edita un registro"""
        pais = Pais(pkPais=pkPais, nombrePais=nombrePais)
        return pais.editar_pais()

    @staticmethod
    def eliminar_pais(pkPais):
        """Elimina un registro"""
        pais = Pais(pkPais=pkPais)
        return pais.eliminar_pais()