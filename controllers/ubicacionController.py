from models.ubicacion import Ubicacion

class UbicacionController:
    @staticmethod
    def listar_ubicaciones():
        """Devuelve todos los registros registrados"""
        return Ubicacion.listar_ubicaciones()

    @staticmethod
    def crear_ubicacion(fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        ubicacion = Ubicacion(fkPuebloCiudad=fkPuebloCiudad, fkCodigoPostal=fkCodigoPostal, fkMunicipio=fkMunicipio, fkEstado=fkEstado, fkPais=fkPais)
        return ubicacion.crear_ubicacion()

    @staticmethod
    def editar_ubicacion(pkUbicacion, fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais):
        """Edita un registro"""
        ubicacion = Ubicacion(pkUbicacion=pkUbicacion, fkPuebloCiudad=fkPuebloCiudad, fkCodigoPostal=fkCodigoPostal, fkMunicipio=fkMunicipio, fkEstado=fkEstado, fkPais=fkPais)
        return ubicacion.editar_ubicacion()

    @staticmethod
    def eliminar_ubicacion(pkUbicacion):
        """Elimina un registro"""
        ubicacion = Ubicacion(pkUbicacion=pkUbicacion)
        return ubicacion.eliminar_ubicacion()