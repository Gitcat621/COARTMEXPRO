from database import Database

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
    def listar_articulos(year, month):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = f'''
        SELECT a.codigoArticulo, a.nombreArticulo, a.precioAlmacen, p.nombreProveedor, ca.nombreCategoriaArticulo, e.cantidadExistencia, a.fkProveedor, a.fkCategoriaArticulo 
        FROM articulos a 
        JOIN categoria_articulos ca ON ca.pkCategoriaArticulo = a.fkCategoriaArticulo 
        JOIN proveedores p ON p.pkProveedor = a.fkProveedor
        JOIN existencias e ON e.fkCodigoArticulo = a.codigoArticulo
        WHERE YEAR(e.fechaExistencia) = YEAR({year}) AND MONTH(e.fechaExistencia) = MONTH({month})
        '''
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

            print(query % valores)

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:
            print(f"Error al insertar la existencia {self.codigoArticulo}: {e}")
            return None

    def editar_articulo(self):
        """Edita un registro en la base de datos."""
        if not self.codigoArticulo:
            raise ValueError("El articulo debe tener un ID para ser editado.")
        db = Database()
        print(self.codigoArticulo)
        query = "UPDATE articulos SET codigoArticulo = %s, nombreArticulo = %s, precioAlmacen = %s, fkProveedor = %s, fkCategoriaArticulo = %s  WHERE codigoArticulo = %s"
        resultado = db.execute_commit(query, (self.codigoArticulo, self.nombreArticulo, self.precioAlmacen, self.fkProveedor, self.fkCategoriaArticulo, self.codigoArticulo))
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

