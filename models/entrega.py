from database import Database

class entrega:
    def __init__(self, pkEntrega=None, fechaEntrega=None, fkSeguimientoAlmacen=None):
        """Inicializa un objeto"""
        self.pkEntrega = pkEntrega
        self.fechaEntrega = fechaEntrega
        self.fkSeguimientoAlmacen = fkSeguimientoAlmacen


    @staticmethod
    def listar_entregas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM entregas")
        db.close()
        return resultado
    
    def crear_entrega(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO entregas (fechaEntrega, fkSeguimientoAlmacen) VALUES (%s,%s)"
        resultado = db.execute_commit(query, (self.fechaEntrega, self.fkSeguimientoAlmacen))
        db.close()
        return resultado

    def editar_entrega(self):
        """Edita un registro en la base de datos."""
        if not self.pkEntrega:
            raise ValueError("La entrega debe tener un ID para ser editado.")
        db = Database()
        print(self.pkEntrega)
        query = "UPDATE entregas SET fechaEntrega = %s, fkSeguimientoAlmacen = %s WHERE pkEntrega = %s"
        resultado = db.execute_commit(query, (self.fechaEntrega, self.fkSeguimientoAlmacen, self.pkEntrega))
        db.close()
        return resultado

    def eliminar_entrega(self):
        """Elimina un registro de la base de datos."""

        if not self.pkEntrega:
            raise ValueError("La entrega debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM entregas WHERE pkEntrega = %s"
        resultado = db.execute_commit(query, (self.pkEntrega,))
        db.close()
        return resultado


