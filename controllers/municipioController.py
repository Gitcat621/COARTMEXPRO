from models.municipio import Municipio

class MunicipioController:
    @staticmethod
    def listar_municipios():
        """Devuelve todos los registros registrados"""
        return Municipio.listar_municipios()

    @staticmethod
    def crear_municipio(nombreMunicipio):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        municipio = Municipio(nombreMunicipio=nombreMunicipio)
        return municipio.crear_municipio()

    @staticmethod
    def editar_municipio(pkMunicipio, nombreMunicipio):
        """Edita un registro"""
        municipio = Municipio(pkMunicipio=pkMunicipio, nombreMunicipio=nombreMunicipio)
        return municipio.editar_municipio()

    @staticmethod
    def eliminar_municipio(pkMunicipio):
        """Elimina un registro"""
        municipio = Municipio(pkMunicipio=pkMunicipio)
        return municipio.eliminar_municipio()