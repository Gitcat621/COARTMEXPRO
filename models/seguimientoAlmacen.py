from database import Database

class SeguimientoAlmacen:
    def __init__(self, pkSeguimientoAlmacen=None, fechaSurtido=None,fechaEmpaque=None):
        """Inicializa un objeto"""
        self.pkSeguimientoAlmacen = pkSeguimientoAlmacen
        self.fechaSurtido = fechaSurtido
        self.fechaEmpaque = fechaEmpaque


    @staticmethod
    def listar_seguimientosAlmacen():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM seguimientos_almacen")
        db.close()
        return resultado
    
    def crear_seguimientoAlmacen(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO seguimientos_almacen (fechaSurtido,fechaEmpaque) VALUES (%s,%s)"
        resultado = db.execute_commit(query, (self.fechaSurtido,self.fechaEmpaque))
        db.close()
        return resultado

    def editar_seguimientoAlmacen(self):
        """Edita un registro en la base de datos."""
        if not self.pkSeguimientoAlmacen:
            raise ValueError("El seguimiento de almacen debe tener un ID para ser editado.")
        db = Database()
        print(self.pkSeguimientoAlmacen)
        query = "UPDATE seguimientos_almacen SET fechaSurtido = %s, fechaEmpaque = %s WHERE pkSeguimientoAlmacen = %s"
        resultado = db.execute_commit(query, (self.fechaSurtido, self.fechaEmpaque,self.pkSeguimientoAlmacen))
        db.close()
        return resultado

    def eliminar_seguimientoAlmacen(self):
        """Elimina un registro de la base de datos."""

        if not self.pkSeguimientoAlmacen:
            raise ValueError("El seguimiento de almacen debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM seguimientos_almacen WHERE pkSeguimientoAlmacen = %s"
        resultado = db.execute_commit(query, (self.pkSeguimientoAlmacen,))
        db.close()
        return resultado


