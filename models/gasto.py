from database import Database
import datetime

def guardar_en_log(texto):
    """Guarda el texto en un archivo de log."""
    with open("registro_log.txt", "a", encoding="utf-8") as archivo:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        archivo.write(f"[{timestamp}] {texto}\n")

class Gasto:
    def __init__(self, pkGasto=None, montoGasto=None, fechaGasto=None, fkMotivoGasto=None, tipoGasto=None):
        """Inicializa un objeto"""
        self.pkGasto = pkGasto
        self.montoGasto = montoGasto
        self.fechaGasto = fechaGasto
        self.fkMotivoGasto = fkMotivoGasto
        self.tipoGasto = tipoGasto


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

        if self.tipoGasto:
            consulta += f" {self.tipoGasto}"
        resultado = db.execute_query(consulta)
        
        print(consulta)
        db.close()
        return resultado
    
    def crear_gasto(self, db):
        """Guarda un nuevo registro en la base de datos"""
        query = "INSERT INTO gastos (montoGasto,fechaGasto,fkMotivoGasto) VALUES (%s,%s,(SELECT pkMotivoGasto FROM motivos_gasto WHERE nombreMotivoGasto = %s)) "

        valores = (self.montoGasto, self.fechaGasto, self.fkMotivoGasto)
        
        try:
            log_query = query.replace("%s", "'{}'").format(*valores)
            guardar_en_log(f"Consulta ejecutada: {log_query}")

            resultado = db.execute(query, valores)  # Ejecutar la consulta            
           
            return resultado

        except Exception as e:
            guardar_en_log(f"❌ Error al insertar compra {self.fechaGasto}: {e}")
            return None

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


