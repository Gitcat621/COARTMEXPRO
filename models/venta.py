from database import Database

class Venta:
    def __init__(self, pkVenta=None, montoVenta=None, fechaVenta=None, fkSocioComercial=None):
        """Inicializa un objeto"""
        self.pkVenta = pkVenta
        self.montoVenta = montoVenta
        self.fechaVenta = fechaVenta
        self.fkSocioComercial = fkSocioComercial


    def listar_ventas(self):

        db = Database()

        if self.fkSocioComercial == 621:
            filtros = []
            if self.fechaVenta:
                try:
                    anio = int(self.fechaVenta)
                    filtros.append(f"YEAR(v.fechaVenta) = {anio}")
                except ValueError:
                    pass

            clausula_where = f"WHERE {' AND '.join(filtros)}" if filtros else ""

            consulta = f'''
            SELECT 
                gs.nombreGrupoSocio AS grupo,
                SUM(v.montoVenta) AS totalVentas
            FROM ventas v
            JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial
            JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
            {clausula_where}
            GROUP BY gs.nombreGrupoSocio
            ORDER BY totalVentas DESC;

            '''

            print(consulta)

            resultado = db.execute_query(consulta)
            db.close()

            return resultado
            
        else:
        
            filtros = []
            
            if self.fechaVenta:
                try:
                    anio = int(self.fechaVenta)
                    filtros.append(f"YEAR(v.fechaVenta) = {anio}")
                except ValueError:
                    pass

            if self.fkSocioComercial:
                filtros.append(f"gs.pkGrupoSocio = {int(self.fkSocioComercial)}")

            clausula_where = f"WHERE {' AND '.join(filtros)}" if filtros else ""

            consulta = f'''
            SELECT sc.nombreSocio, v.montoVenta, v.fechaVenta FROM ventas v 
            JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial
            JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
            {clausula_where}
            GROUP BY 
                sc.nombreSocio, 
                v.fechaVenta;
            '''

            print(consulta)

            resultado = db.execute_query(consulta)
            db.close()

            return resultado
    
    def crear_venta(self, db):

        query = '''
        INSERT INTO ventas (montoVenta, fechaVenta, fkSocioComercial) VALUES
        (%s, %s, (SELECT pkSocioComercial FROM socios_comerciales WHERE nombreSocio = %s))
        '''

        valores = (self.montoVenta, self.fechaVenta, self.fkSocioComercial)

        try:


            print(query % valores)

            resultado = db.execute_commit(query, valores)  # Ejecutar la consulta
            
            return resultado

        except Exception as e:

            print(f"Error al insertar compra {self.numeroOrdenCompra}: {e}")
            return None


