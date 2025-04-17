from models.puebloCiudad import PuebloCiudad

class PuebloCiudadController:
    @staticmethod
    def listar_pueblosCiudades():
        """Devuelve todos los registros registrados"""
        return PuebloCiudad.listar_pueblosCiudades()

    @staticmethod
    def crear_puebloCiudad(nombrePuebloCiudad):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        puebloCiudad = PuebloCiudad(nombrePuebloCiudad=nombrePuebloCiudad)
        return puebloCiudad.crear_puebloCiudad()

    @staticmethod
    def editar_puebloCiudad(pkPuebloCiudad, nombrePuebloCiudad):
        """Edita un registro"""
        puebloCiudad = PuebloCiudad(pkPuebloCiudad=pkPuebloCiudad, nombrePuebloCiudad=nombrePuebloCiudad)
        return puebloCiudad.editar_puebloCiudad()

    @staticmethod
    def eliminar_puebloCiudad(pkPuebloCiudad):
        """Elimina un registro"""
        puebloCiudad = PuebloCiudad(pkPuebloCiudad=pkPuebloCiudad)
        return puebloCiudad.eliminar_puebloCiudad()