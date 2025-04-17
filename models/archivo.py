from database import Database

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
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM archivos")
        db.close()
        return resultado
    
    def crear_archivo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO archivos (nombreArchivo,peso,fechaSubida,ruta) VALUES (%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.nombreArchivo, self.peso, self.fechaSubida, self.ruta))
        db.close()
        return resultado
    
    def editar_archivo(self):
        """Edita un registro en la base de datos."""
        if not self.pkArchivo:
            raise ValueError("El archivo debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE archivos SET nombreArchivo = %s, peso = %s, fechaSubida = %s, ruta = %s WHERE pkArchivo = %s"
        resultado = db.execute_commit(query, (self.nombreArchivo, self.peso, self.fechaSubida, self.ruta, self.pkArchivo))
        db.close()
        return resultado

    def eliminar_archivo(self):
        """Elimina un registro de la base de datos."""

        if not self.pkArchivo:
            raise ValueError("El archivo debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM archivos WHERE pkArchivo = %s"
        resultado = db.execute_commit(query, (self.pkArchivo,))
        db.close()
        return resultado