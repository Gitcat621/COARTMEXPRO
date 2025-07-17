from database import Database
import datetime
import os

def guardar_en_log(texto):
    """Guarda el texto en un archivo de log con fecha, dentro de la carpeta 'consultas'."""
    # Crear carpeta si no existe
    carpeta = "consultas"
    os.makedirs(carpeta, exist_ok=True)

    # Generar nombre de archivo con fecha
    fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
    nombre_archivo = f"log_{fecha_actual}.txt"
    ruta_archivo = os.path.join(carpeta, nombre_archivo)

    # Escribir en el archivo
    with open(ruta_archivo, "a", encoding="utf-8") as archivo:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        archivo.write(f"[{timestamp}] {texto}\n")

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
    
    def actualizar_motivos(self, db):
        """Guarda un nuevo motivo de gasto en la base de datos si no existe"""
        
        # Verificar si el motivo ya existe en la base de datos
        query_check_motivo = "SELECT pkMotivoGasto FROM motivos_gasto WHERE nombreMotivoGasto = %s"
        db.execute(query_check_motivo, (self.nombreMotivoGasto,))
        motivo_existente = db.fetchone()

        if not motivo_existente:  # Si no existe el motivo, lo insertamos
            query_insert_motivo = """
            INSERT INTO motivos_gasto (nombreMotivoGasto, tipoGasto) 
            VALUES (%s, %s)
            """
            valores = (self.nombreMotivoGasto, self.tipoGasto)
            
            try:
                
                db.execute(query_insert_motivo, valores)  # Insertar el motivo

                log_query = query_insert_motivo.replace("%s", "'{}'").format(*valores)
                guardar_en_log(f"Consulta ejecutada: {log_query}")

                #print(f"Motivo insertado: {self.nombreMotivoGasto} - {self.tipoGasto}")


                return True
            
            except Exception as e:

                guardar_en_log(f"❌ Error al insertar compra {self.nombreMotivoGasto}: {e}")
                return None

        else:
            #print(f"El motivo '{self.nombreMotivoGasto}' ya existe.")
            guardar_en_log(f"El motivo '{self.nombreMotivoGasto}' ya existe.")
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


