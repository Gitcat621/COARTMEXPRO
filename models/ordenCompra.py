from database import Database

class OrdenCompra:
    def __init__(self, 
        pkOrdenCompra=None, 
        numeroOrdenCompra=None, 
        fechaOrdenCompra=None,
        fkSocioComercial=None, 
        codigoArticulo=None, 
        cantidadOrden=None,
        cantidadVenta=None, 
        precioVenta=None,
        fechaEntrega=None,
        fechaSurtido=None):
        """Inicializa un objeto"""
        self.pkOrdenCompra = pkOrdenCompra
        self.numeroOrdenCompra = numeroOrdenCompra
        self.fechaOrdenCompra = fechaOrdenCompra
        self.fkSocioComercial = fkSocioComercial
        self.codigoArticulo = codigoArticulo
        self.cantidadOrden = cantidadOrden
        self.cantidadVenta = cantidadVenta
        self.precioVenta = precioVenta
        self.fechaEntrega = fechaEntrega
        self.fechaSurtido = fechaSurtido


    @staticmethod
    def listar_ordenesCompra():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM ordenes_compra")
        db.close()
        return resultado
    
    
    def crear_ordenCompra(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = '''
        INSERT INTO ordenes_compra (numeroOrdenCompra, fechaOrdenCompra, fkSocioComercial) VALUES
        (%s, %s ,(SELECT pkSocioComercial FROM socios_comerciales WHERE nombreSocio = %s LIMIT 1))
        '''

        valores = (self.numeroOrdenCompra, self.fechaOrdenCompra, self.fkSocioComercial)

        try:

            print(query % valores)

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:
            print(f"Error al insertar compra {self.numeroOrdenCompra}: {e}")
            return None


    def crear_articulosEnOrden(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = '''
            INSERT INTO articulos_ordenes (fkOrdenCompra, fkCodigoArticulo, cantidadOrden) 
            VALUES (
                (SELECT oc.pkOrdenCompra 
                FROM ordenes_compra oc 
                JOIN socios_comerciales sc ON oc.fkSocioComercial = sc.pkSocioComercial 
                WHERE oc.numeroOrdenCompra = %s AND oc.fechaOrdenCompra = %s AND sc.nombreSocio = %s),
                %s,
                %s
            )
            '''
            
        valores = (self.numeroOrdenCompra, self.fechaOrdenCompra, self.fkSocioComercial, self.codigoArticulo, self.cantidadOrden)

        try:
           
            print(query % valores)
            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta

            return resultado
        except Exception as e:

            print(f"Error al insertar artículo en orden: {e}")
            return None




    def crear_venta(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = '''
        INSERT INTO articulos_ventas (fkCodigoArticulo, fkOrdenCompra, cantidadVenta, precioVenta) VALUES
        (%s, 
        (SELECT oc.pkOrdenCompra 
        FROM ordenes_compra oc 
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        WHERE oc.numeroOrdenCompra = %s AND oc.fechaOrdenCompra = %s AND sc.nombreSocio = %s),
        %s, %s)
        '''

        valores = (self.codigoArticulo, self.numeroOrdenCompra, self.fechaOrdenCompra, self.fkSocioComercial , self.cantidadVenta, self.precioVenta)

        try:

            print(query % valores)

            # with open("ventas_log.txt", "a", encoding="utf-8") as log_file:
            #     log_file.write(f"{query % valores};\n")

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:
            print(f"Error al insertar compra {self.numeroOrdenCompra}: {e}")
            return None


    def crear_respuesta(self, db):
        """Guarda un nuevo registro en la base de datos"""

        query = '''
        INSERT INTO respuestas_almacen (fechaSurtido, fechaEntrega, fkOrdenCompra) VALUES
        (%s, %s, 
        (SELECT oc.pkOrdenCompra 
        FROM ordenes_compra oc 
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        WHERE oc.numeroOrdenCompra = %s AND oc.fechaOrdenCompra = %s AND sc.nombreSocio = %s))
        '''

        valores = (self.fechaSurtido, self.fechaEntrega, self.numeroOrdenCompra, self.fechaOrdenCompra, self.fkSocioComercial)

        try:
            
            print(query % valores)

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            
            return resultado

        except Exception as e:

            print(f"Error al insertar compra {self.numeroOrdenCompra}: {e}")
            return None


    def editar_ordenCompra(self):
        """Edita un registro en la base de datos."""
        if not self.numeroOrdenCompra:
            raise ValueError("La orden de compra debe tener un ID para ser editado.")
        db = Database()
        print(self.numeroOrdenCompra)
        query = "UPDATE ordenes_compra SET fechaOrdenCompra = %s, fkSocioComercial = %s WHERE numeroOrdenCompra = %s"
        resultado = db.execute_commit(query, (self.fechaOrdenCompra, self.fkSocioComercial, self.numeroOrdenCompra))
        db.close()
        return resultado

    def eliminar_ordenCompra(self):
        """Elimina un registro de la base de datos."""

        if not self.numeroOrdenCompra:
            raise ValueError("La orden de compra debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM ordenes_compra WHERE numeroOrdenCompra = %s"
        resultado = db.execute_commit(query, (self.numeroOrdenCompra,))
        db.close()
        return resultado


