import os


class Archivo:
    def __init__(self, pkArchivo=None, nombreArchivo=None, peso=None, fechaSubida=None, ruta=None):
        """Inicializa un objeto"""
        self.pkArchivo = pkArchivo
        self.nombreArchivo = nombreArchivo
        self.peso = peso
        self.fechaSubida = fechaSubida
        self.ruta = ruta

    @staticmethod
    def listar_archivos():
        """Obtiene todos los registros de la carpeta y los retorna en formato JSON."""
    
    def crear_archivo(archivo):
        """Guarda un nuevo registro en el almacenamiento local"""

    def editar_archivo(self):
        """Edita un registro en la base de datos."""
       
        #return resultado

    def eliminar_archivo(ruta_archivo):
        """Elimina un registro de la base de datos."""