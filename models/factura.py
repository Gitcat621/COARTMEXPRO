from database import Database
import datetime

def guardar_en_log(texto):
    """Guarda el texto en un archivo de log."""
    with open("registro_log.txt", "a", encoding="utf-8") as archivo:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        archivo.write(f"[{timestamp}] {texto}\n")

class Factura:
    def __init__(self, 
        pkFactura=None, 
        fechaFactura=None, 
        numeroAño=None, 
        subTotalFactura=None,
        totalFactura=None, 
        fechaVencimiento=None, 
        fechaPagado=None, 
        razonSocial=None,
        numeroNotaCredito=None,
        montoDescuento=None,
        fkOrdenCompra=None,
        numeroOrdenCompra=None,
        fechaOrdenCompra=None,
        fkSocioComercial=None):
        """Inicializa un objeto"""
        self.pkFactura = pkFactura
        self.fechaFactura = fechaFactura
        self.numeroAño = numeroAño
        self.subTotalFactura = subTotalFactura
        self.totalFactura = totalFactura
        self.fechaVencimiento = fechaVencimiento
        self.fechaPagado = fechaPagado
        self.razonSocial = razonSocial
        self.numeroNotaCredito = numeroNotaCredito
        self.montoDescuento = montoDescuento
        self.fkOrdenCompra = fkOrdenCompra
        self.numeroOrdenCompra=numeroOrdenCompra
        self.fechaOrdenCompra=fechaOrdenCompra
        self.fkSocioComercial=fkSocioComercial


    @staticmethod
    def listar_facturas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT f.numeroAño, f.totalFactura, f.fechaVencimiento, f.diasVencidos, f.fechaPagado, sc.nombreSocio FROM facturas f 
        LEFT JOIN ordenes_compra oc ON oc.pkOrdenCompra = f.fkOrdenCompra 
        LEFT JOIN articulos_ventas av ON av.fkOrdenCompra = oc.pkOrdenCompra 
        LEFT JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        WHERE YEAR(f.fechaFactura) = YEAR(CURDATE()) AND MONTH(v.fechaFactura) IN (1,2,3);
        '''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
        
    def crear_factura(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = """
        INSERT INTO facturas (
            fechaFactura, numeroAño, subTotalFactura, totalFactura,
            fechaVencimiento, fechaPagado, razonSocial, numeroNotaCredito,
            montoDescuento, fkOrdenCompra
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s,
            (SELECT oc.pkOrdenCompra
            FROM ordenes_compra oc
            JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
            WHERE oc.numeroOrdenCompra = %s AND oc.fechaOrdenCompra = %s AND sc.nombreSocio = %s)
        )
        """

        valores = (
            self.fechaFactura,
            self.numeroAño,
            self.subTotalFactura,
            self.totalFactura,
            self.fechaVencimiento,
            self.fechaPagado,
            self.razonSocial,
            self.numeroNotaCredito,
            self.montoDescuento,
            self.fkOrdenCompra,
            self.fechaOrdenCompra,
            self.fkSocioComercial
        )

        try:
            
            log_query = query.replace("%s", "'{}'").format(*valores)
            guardar_en_log(f"Consulta ejecutada: {log_query}")

            resultado = db.execute(query, valores)

            return resultado
        except Exception as e:
            guardar_en_log(f"❌ Error al insertar compra {self.numeroAño}: {e}")
            return None

    def editar_factura(self, db):
        """Edita un registro en la base de datos."""

        query = "UPDATE facturas SET fechaPagado = %s WHERE numeroAño = %s AND YEAR(fechaFactura) = YEAR(%s)"

        valores = (self.fechaPagado, self.numeroAño, self.fechaPagado)
        
        try:

            log_query = query.replace("%s", "'{}'").format(*valores)
            guardar_en_log(f"Consulta ejecutada: {log_query}")

            resultado = db.execute(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:
            guardar_en_log(f"❌ Error al insertar compra {self.numeroAño}: {e}")
            return None

    def eliminar_factura(self):
        """Elimina un registro de la base de datos."""

        if not self.pkFactura:
            raise ValueError("La factura debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM facturas WHERE pkFactura = %s"
        resultado = db.execute_commit(query, (self.pkFactura,))
        db.close()
        return resultado


