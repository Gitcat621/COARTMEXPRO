from models.archivo import Archivo

class ArchivoController:
    @staticmethod
    def listar_archivos():
        """Devuelve todos los registros registrados"""
        return Archivo.listar_archivos()

    @staticmethod
    def crear_archivo(nombreArchivo, peso, fechaSubida, ruta):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        archivo = Archivo(nombreArchivo=nombreArchivo, peso=peso, fechaSubida=fechaSubida, ruta=ruta)
        return archivo.crear_archivo()

    @staticmethod
    def editar_archivo(pkArchivo, nombreArchivo, peso, fechaSubida, ruta):
        """Edita un registro"""
        archivo = Archivo(pkArchivo=pkArchivo, nombreArchivo=nombreArchivo, peso=peso, fechaSubida=fechaSubida, ruta=ruta)
        return archivo.editar_archivo()

    @staticmethod
    def eliminar_archivo(pkArchivo):
        """Elimina un registro"""
        archivo = Archivo(pkArchivo=pkArchivo)
        return archivo.eliminar_archivo()