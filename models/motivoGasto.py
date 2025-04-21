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
    
    def crear_motivoGasto(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO motivos_gasto (nombreMotivoGasto, tipoGasto) VALUES (%s , %s)"
        resultado = db.execute_commit(query, (self.nombreMotivoGasto, self.tipoGasto))
        db.close()
        return resultado
    
    def actualizar_motivos(self):
        """Guarda un nuevo motivo de gasto en la base de datos si no existe"""
        db = Database()
        
        # Verificar si el motivo ya existe en la base de datos
        query_check_motivo = "SELECT pkMotivoGasto FROM motivos_gasto WHERE nombreMotivoGasto = %s"
        db.cursor.execute(query_check_motivo, (self.fkMotivoGasto,))
        motivo_existente = db.cursor.fetchone()

        if not motivo_existente:  # Si no existe el motivo, lo insertamos
            query_insert_motivo = """
            INSERT INTO motivos_gasto (nombreMotivoGasto, tipoGasto) 
            VALUES (%s, %s)
            """
            valores = (self.fkMotivoGasto, self.tipoGasto)
            
            try:
                db.connection.autocommit = False  # Desactivar autocommit para iniciar la transacción
                #print(query_insert_motivo % valores)
                
                db.cursor.execute(query_insert_motivo, valores)  # Insertar el motivo
                db.connection.commit()  # Confirmar la transacción si todo sale bien
                #print(f"Motivo insertado: {self.fkMotivoGasto} - {self.tipoGasto}")
                db.close()
                return True
            
            except Exception as e:
                db.connection.rollback()  # Revertir la transacción si hay un error
                print(f"Error al insertar el motivo {self.fkMotivoGasto}: {e}")
                db.close()
                return None

        else:
            #print(f"El motivo '{self.fkMotivoGasto}' ya existe.")
            db.close()
            return True  # El motivo ya existe, no es necesario insertarlo
    
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


