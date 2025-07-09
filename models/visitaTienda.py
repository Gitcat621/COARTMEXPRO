from database import Database

class VisitaTienda:
    def __init__(self, pkVisitaTienda=None, observacion=None, fechaVisita=None, venta=None, servicio=None, fkSocioComercial=None):
        """Inicializa un objeto"""
        self.pkVisitaTienda = pkVisitaTienda
        self.observacion = observacion
        self.fechaVisita = fechaVisita
        self.venta = venta
        self.servicio = servicio
        self.fkSocioComercial = fkSocioComercial


    @staticmethod
    def listar_visitas_tiendas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM visitas_tiendas vt JOIN socios_comerciales sc ON vt.fkSocioComercial = sc.pkSocioComercial")
        db.close()
        return resultado
    
    def crear_visita_tienda(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO visitas_tiendas (observacion, fechaVisita, venta, servicio, fkSocioComercial) VALUES (%s,%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.observacion, self.fechaVisita, self.venta, self.servicio, self.fkSocioComercial))
        db.close()
        return resultado

    def editar_visita_tienda(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkVisitaTienda)
        query = "UPDATE visitas_tiendas SET observacion = %s, fechaVisita = %s, venta = %s, servicio = %s, fkSocioComercial = %s WHERE pkVisitaTienda = %s"
        resultado = db.execute_commit(query, (self.observacion, self.fechaVisita, self.venta, self.servicio, self.fkSocioComercial, self.pkVisitaTienda))
        db.close()
        return resultado

    def eliminar_visita_tienda(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM visitas_tiendas WHERE pkVisitaTienda = %s"
        resultado = db.execute_commit(query, (self.pkVisitaTienda,))
        db.close()
        return resultado


