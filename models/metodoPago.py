from database import Database

class MetodoPago:
    def __init__(self, pkMetodoPago=None, nombreMetodoPago=None):
        """Inicializa un objeto"""
        self.pkMetodoPago = pkMetodoPago
        self.nombreMetodoPago = nombreMetodoPago


    @staticmethod
    def listar_metodos_pago():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM metodos_pago")
        db.close()
        return resultado
    
    def crear_metodoPago(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO metodos_pago (nombreMetodoPago) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreMetodoPago,))
        db.close()
        return resultado

    def editar_metodoPago(self):
        """Edita un registro en la base de datos."""
        db = Database()
        query = "UPDATE metodos_pago SET nombreMetodoPago = %s WHERE pkMetodoPago = %s"
        resultado = db.execute_commit(query, (self.nombreMetodoPago, self.pkMetodoPago))
        db.close()
        return resultado

    def eliminar_metodoPago(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM metodos_pago WHERE pkMetodoPago = %s"
        resultado = db.execute_commit(query, (self.pkMetodoPago,))
        db.close()
        return resultado


