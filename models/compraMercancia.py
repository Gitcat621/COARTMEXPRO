from database import Database

class CompraMercancia:
    def __init__(self, pkCompraMercancia=None, montoMercancia=None, fechaMercancia=None, folioELV=None, pagoPendiente=None,fkProveedor=None, filtro=None):
        """Inicializa un objeto"""
        self.pkCompraMercancia = pkCompraMercancia
        self.montoMercancia = montoMercancia
        self.fechaMercancia = fechaMercancia
        self.folioELV = folioELV
        self.pagoPendiente = pagoPendiente
        self.fkProveedor = fkProveedor
        self.filtro = filtro


    def listar_compras(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        select p.nombreProveedor, cm.montoMercancia, cm.fechaMercancia from compras_mercancia cm 
        JOIN proveedores p ON p.pkProveedor = cm.fkProveedor WHERE YEAR(cm.fechaMercancia) = 
        '''
        if self.fechaMercancia:
            consulta += f" {self.fechaMercancia}"
            
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    
    def crear_compra(self, db):
        """Guarda un nuevo registro en la base de datos dentro de una transacción activa."""
        query = '''
        INSERT INTO compras_mercancia (fechaMercancia, montoMercancia, folioELV, pagoPendiente, fkProveedor)
        VALUES (%s, %s ,%s, %s, (SELECT pkProveedor FROM proveedores WHERE nombreProveedor = %s LIMIT 1))
        '''

        valores = (self.fechaMercancia, self.montoMercancia, self.folioELV, self.pagoPendiente, self.fkProveedor)

        try:
            print(query % valores)  # Para depuración
            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            return resultado  # Devuelve el resultado sin cerrar la conexión aquí

        except Exception as e:
            print(f"Error al insertar compra {self.folioELV}: {e}")
            return None



    def editar_compra(self, db):
        query = '''UPDATE compras_mercancia SET pagoPendiente = %s WHERE folioELV = %s'''
        valores = (self.pagoPendiente, self.folioELV)

        try:
            resultado = db.execute_commit(query, valores)
            return resultado
        except Exception as e:
            print(f"Error al actualizar compra {self.folioELV}: {e}")
            return None


    def eliminar_compra(self):
        """Elimina un registro de la base de datos."""

        if not self.pkCompraMercancia:
            raise ValueError("El compraMercancia debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM compras_mercancia WHERE pkCompraMercancia = %s"
        resultado = db.execute_commit(query, (self.pkCompraMercancia,))
        db.close()
        return resultado

