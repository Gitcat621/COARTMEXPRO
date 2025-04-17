from database import Database

class Gasto:
    def __init__(self, pkGasto=None, montoGasto=None, fechaGasto=None, fkMotivoGasto=None, tipoGasto=None, filtro=None):
        """Inicializa un objeto"""
        self.pkGasto = pkGasto
        self.montoGasto = montoGasto
        self.fechaGasto = fechaGasto
        self.fkMotivoGasto = fkMotivoGasto
        self.tipoGasto = tipoGasto
        self.filtro = filtro


    def listar_gastos(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT mg.tipoGasto, mg.nombreMotivoGasto, g.montoGasto, g.fechaGasto, g.pkGasto, mg.pkMotivoGasto FROM gastos g 
        JOIN motivos_gasto mg ON mg.pkMotivoGasto = g.fkMotivoGasto AND YEAR(g.fechaGasto) =
        '''

        if self.fechaGasto:
            consulta += f" {self.fechaGasto}"
        resultado = db.execute_query(consulta)

        if self.filtro:
            consulta += f" {self.filtro}"
        resultado = db.execute_query(consulta)
        
        print(consulta)
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
        
           

    
    def crear_gasto(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO gastos (montoGasto,fechaGasto,fkMotivoGasto) VALUES (%s,%s,(SELECT pkMotivoGasto FROM motivos_gasto WHERE nombreMotivoGasto = %s)) "

        valores = (self.montoGasto, self.fechaGasto, self.fkMotivoGasto)
        
        try:
            db.connection.autocommit = False  # Desactivar autocommit para iniciar la transacción

            #print(query % valores)

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            db.connection.commit()  # Confirmar la transacción si todo sale bien
            
           
            return resultado

        except Exception as e:
            db.connection.rollback()  # Revertir la transacción si hay un error
            print(f"Error al insertar el gasto {self.fechaGasto}: {e}")
            return None

        finally:
            db.close()

    def editar_gasto(self):
        """Edita un registro en la base de datos."""
        if not self.pkGasto:
            raise ValueError("El gasto debe tener un ID para ser editado.")
        db = Database()
        print(self.pkGasto)
        query = "UPDATE gastos SET montoGasto = %s, fechaGasto = %s, fkMotivoGasto = %s WHERE pkGasto = %s"
        resultado = db.execute_commit(query, (self.montoGasto, self.fechaGasto, self.fkMotivoGasto, self.pkGasto))
        db.close()
        return resultado

    def eliminar_gasto(self):
        """Elimina un registro de la base de datos."""

        if not self.pkGasto:
            raise ValueError("El gasto debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM gastos WHERE pkGasto = %s"
        resultado = db.execute_commit(query, (self.pkGasto,))
        db.close()
        return resultado


