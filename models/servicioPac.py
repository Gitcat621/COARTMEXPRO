from database import Database

class ServicioPac:
    def __init__(self, pkServicioPac=None, numeroSesion=None, fechaSesion=None, costoSesion=None, montoApoyo=None, fkEmpleado=None, fkBeneficio=None, fkClinica=None):
        """Inicializa un objeto"""
        self.pkServicioPac = pkServicioPac
        self.numeroSesion = numeroSesion
        self.fechaSesion = fechaSesion
        self.costoSesion = costoSesion
        self.montoApoyo = montoApoyo
        self.fkEmpelado = fkEmpleado
        self.fkBeneficio = fkBeneficio
        self.fkClinica = fkClinica

    @staticmethod
    def es_entero(valor):
        """Verifica si un valor puede convertirse a entero."""
        try:
            int(valor)
            return True
        except (ValueError, TypeError):
            return False

    @staticmethod
    def listar_servicio_pac():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM servicio_pac sp JOIN clinicas c ON c.pkClinica = sp.fkClinica"
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_servicio_pac(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()

        try:

            # --- Insertar o recuperar ID de clinica---
            if ServicioPac.es_entero(self.fkClinica):
                self.fkClinica = int(self.fkClinica)
            else:
                db.cursor.execute('INSERT INTO clinicas (nombreClinica) VALUES (%s)', (self.fkClinica,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                self.fkClinica = db.cursor.fetchone()['LAST_INSERT_ID()']

            consulta = "INSERT INTO servicio_pac (numeroSesion, fechaSesion, costoSesion, montoApoyo, fkEmpleado, fkBeneficio, fkClinica) VALUES (%s,%s,%s,%s,%s,%s,%s)"
            valores = (self.numeroSesion,self.fechaSesion,self.costoSesion,self.montoApoyo, self.fkEmpelado, self.fkBeneficio, self.fkClinica)
            print(consulta % valores)

            db.cursor.execute(consulta, valores)

            
            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
            
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al insertar empleado:", e)
            return False
        finally:
            db.close()

    def editar_servicio_pac(self):
        """Edita un registro en la base de datos."""
        db = Database()

        try:

            # --- Insertar o recuperar ID de clinica---
            if ServicioPac.es_entero(self.fkClinica):
                self.fkClinica = int(self.fkClinica)
            else:
                db.cursor.execute('INSERT INTO clinicas (nombreClinica) VALUES (%s)', (self.fkClinica,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                self.fkClinica = db.cursor.fetchone()['LAST_INSERT_ID()']

            consulta = "UPDATE servicio_pac SET numeroSesion = %s, fechaSesion = %s, costoSesion = %s, montoApoyo = %s, fkBeneficio = %s, fkClinica = %s WHERE pkServicioPac = %s"
            valores = (self.numeroSesion, self.fechaSesion, self.costoSesion, self.montoApoyo, self.fkBeneficio, self.fkClinica, self.pkServicioPac)
            print(consulta % valores)

            db.cursor.execute(consulta, valores)

            
            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
            
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al insertar empleado:", e)
            return False
        finally:
            db.close()

    def eliminar_servicio_pac(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM servicio_pac WHERE pkServicioPac = %s"
        valores = (self.pkServicioPac,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

