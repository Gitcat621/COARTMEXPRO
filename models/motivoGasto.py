from database import Database

class MotivoGasto:
    def __init__(self, pkMotivoGasto=None, nombreMotivoGasto=None, tipoGasto=None):
        """Inicializa un objeto"""
        self.pkMotivoGasto = pkMotivoGasto
        self.nombreMotivoGasto = nombreMotivoGasto
        self.tipoGasto = tipoGasto


    @staticmethod
    def listar_motivosGasto():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM motivos_gasto")
        db.close()
        return resultado
    
    def crear_listar_motivoGasto(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO motivos_gasto (nombreMotivoGasto, tipoGasto) VALUES (%s , %s)"
        resultado = db.execute_commit(query, (self.nombreMotivoGasto, self.tipoGasto))
        db.close()
        return resultado

    def editar_motivoGasto(self):
        """Edita un registro en la base de datos."""
        if not self.pkMotivoGasto:
            raise ValueError("El motivo de gasto debe tener un ID para ser editado.")
        db = Database()
        print(self.pkMotivoGasto)
        query = "UPDATE motivos_gasto SET nombreMotivoGasto = %s, tipoGasto = %s WHERE pkMotivoGasto = %s"
        resultado = db.execute_commit(query, (self.nombreMotivoGasto, self.tipoGasto, self.pkMotivoGasto))
        db.close()
        return resultado

    def eliminar_motivoGasto(self):
        """Elimina un registro de la base de datos."""

        if not self.pkMotivoGasto:
            raise ValueError("El motivo de gasto debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM motivos_gasto WHERE pkMotivoGasto = %s"
        resultado = db.execute_commit(query, (self.pkMotivoGasto,))
        db.close()
        return resultado


