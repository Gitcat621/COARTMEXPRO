from database import Database
import datetime

def guardar_en_log(texto):
    """Guarda el texto en un archivo de log."""
    with open("registro_log.txt", "a", encoding="utf-8") as archivo:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        archivo.write(f"[{timestamp}] {texto}\n")

class Articulo:
    def __init__(self, 
        codigoArticulo=None, 
        nombreArticulo=None, 
        precioAlmacen=None, 
        fkProveedor=None, 
        fkCategoriaArticulo=None, 
        cantidadExistencia=None, 
        fechaExistencia=None):
        """Inicializa un objeto"""
        self.codigoArticulo = codigoArticulo
        self.nombreArticulo = nombreArticulo
        self.precioAlmacen = precioAlmacen
        self.fkProveedor = fkProveedor
        self.fkCategoriaArticulo = fkCategoriaArticulo
        self.cantidadExistencia = cantidadExistencia
        self.fechaExistencia = fechaExistencia


    @staticmethod
    def listar_articulos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = f'''
        SELECT a.codigoArticulo, a.nombreArticulo, a.precioAlmacen, p.nombreProveedor, ca.nombreCategoriaArticulo, a.fkProveedor, a.fkCategoriaArticulo 
        FROM articulos a 
        JOIN categoria_articulos ca ON ca.pkCategoriaArticulo = a.fkCategoriaArticulo 
        JOIN proveedores p ON p.pkProveedor = a.fkProveedor
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def listar_inventario(year, month):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = f'''
        SELECT a.codigoArticulo, a.nombreArticulo, a.precioAlmacen, p.nombreProveedor, ca.nombreCategoriaArticulo, e.cantidadExistencia, a.fkProveedor, a.fkCategoriaArticulo 
        FROM articulos a 
        JOIN categoria_articulos ca ON ca.pkCategoriaArticulo = a.fkCategoriaArticulo 
        JOIN proveedores p ON p.pkProveedor = a.fkProveedor
        JOIN existencias e ON e.fkCodigoArticulo = a.codigoArticulo
        WHERE YEAR(e.fechaExistencia) = {year} AND MONTH(e.fechaExistencia) = {month}
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_articulo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO articulos (codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo) VALUES (%s,%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.codigoArticulo, self.nombreArticulo,self.precioAlmacen, self.fkProveedor, self.fkCategoriaArticulo))
        db.close()
        return resultado
    
    def crear_existencias(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = "INSERT INTO existencias (cantidadExistencia, fechaExistencia, fkCodigoArticulo) VALUES (%s,%s,%s)"


        valores = (self.cantidadExistencia, self.fechaExistencia, self.codigoArticulo)
        
        try:

            log_query = query.replace("%s", "'{}'").format(*valores)
            guardar_en_log(f"Consulta ejecutada: {log_query}")

            resultado = db.execute(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:
            guardar_en_log(f"❌ Error al insertar existencia {self.codigoArticulo}: {e}")
            return None

    def editar_articulo(self):
        """Edita un registro en la base de datos."""
        db = Database()
        
        query = "UPDATE articulos SET codigoArticulo = %s, nombreArticulo = %s, precioAlmacen = %s, fkProveedor = %s, fkCategoriaArticulo = %s  WHERE codigoArticulo = %s"
        resultado = db.execute_commit(query, (self.codigoArticulo, self.nombreArticulo, self.precioAlmacen, self.fkProveedor, self.fkCategoriaArticulo, self.codigoArticulo))

        print(query)

        db.close()
        return resultado

    def eliminar_articulo(self):
        """Elimina un registro de la base de datos."""

        if not self.codigoArticulo:
            raise ValueError("El articulo debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM articulos WHERE codigoArticulo = %s"
        resultado = db.execute_commit(query, (self.codigoArticulo,))
        db.close()
        return resultado

