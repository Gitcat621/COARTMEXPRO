from database import Database

class ZonaRuta:
    def __init__(self, pkZonaRuta=None, nombreZonaRuta=None):
        """Inicializa un objeto"""
        self.pkZonaRuta = pkZonaRuta
        self.nombreZonaRuta = nombreZonaRuta


    @staticmethod
    def listar_zonas_ruta():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM zonas_ruta")
        db.close()
        return resultado
    
    def crear_zona_ruta(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO zonas_ruta (nombreZonaRuta) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreZonaRuta,))
        db.close()
        return resultado

    def editar_zona_ruta(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkZonaRuta)
        query = "UPDATE zonas_ruta SET nombreZonaRuta = %s WHERE pkZonaRuta = %s"
        resultado = db.execute_commit(query, (self.nombreZonaRuta, self.pkZonaRuta))
        db.close()
        return resultado

    def eliminar_zona_ruta(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM zonas_ruta WHERE pkZonaRuta = %s"
        resultado = db.execute_commit(query, (self.pkZonaRuta,))
        db.close()
        return resultado


