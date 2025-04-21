from database import Database

class Resumen:
    def __init__(self, foreingKey=None, fecha=None, montoVenta=None, fechaVenta=None, fkSocioComercial=None):
        """Inicializa un objeto"""
        self.foreingKey = foreingKey
        self.fecha = fecha
        self.montoVenta =montoVenta
        self.fechaVenta =fechaVenta
        self.fkSocioComercial = fkSocioComercial


    @staticmethod
    def listar_resumenAnalisis(meses_str, year):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT 
        -- Ingresos
        COALESCE((SELECT SUM(f.totalFactura) 
            FROM facturas f 
            WHERE f.fechaPagado IS NOT NULL 
            AND YEAR(f.fechaPagado) = {year} 
            AND MONTH(f.fechaPagado) 
            IN ({meses})), 0) AS totalIngresos,

        -- Egresos (Suma de gastos y compras de mercancía)
        (COALESCE((SELECT SUM(g.montoGasto) 
            FROM gastos g 
            WHERE YEAR(g.fechaGasto) = {year} 
            AND MONTH(g.fechaGasto) 
            IN ({meses})), 0) 
        + 
        COALESCE((SELECT SUM(cm.montoMercancia) 
            FROM compras_mercancia cm 
            WHERE YEAR(cm.fechaMercancia) = {year} 
            AND MONTH(cm.fechaMercancia) 
            IN ({meses})), 0)) AS totalEgresos,

        -- Efectivo restante (Ingresos - Egresos)
        (COALESCE((SELECT SUM(f.totalFactura) 
            FROM facturas f 
            WHERE f.fechaPagado IS NOT NULL 
            AND YEAR(f.fechaPagado) = {year} 
            AND MONTH(f.fechaPagado) 
            IN ({meses})), 0) 
        - 
        (COALESCE((SELECT SUM(g.montoGasto) 
            FROM gastos g 
            WHERE YEAR(g.fechaGasto) = {year} 
            AND MONTH(g.fechaGasto) 
            IN ({meses})), 0) 
        + 
        COALESCE((SELECT SUM(cm.montoMercancia) 
            FROM compras_mercancia cm 
            WHERE YEAR(cm.fechaMercancia) = {year} 
            AND MONTH(cm.fechaMercancia) 
            IN ({meses})), 0))) AS efectivoRestante,

        -- Total de ventas
        COALESCE((SELECT SUM(v.montoVenta) 
            FROM ventas v 
            WHERE YEAR(v.fechaVenta) = {year}
                AND MONTH(v.fechaVenta) 
                IN ({meses})), 0) AS totalVenta,

        -- Comparación de ventas año actual vs año pasado
        COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year} 
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0) AS totalAñoActual,

        COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  - 1 
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0) AS totalAñoPasado,

        -- Diferencia y porcentaje de crecimiento en ventas
        (COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0) 
        - 
        COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  - 1 
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0)) AS diferenciaVentas,

        ((COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0) 
        - 
        COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  - 1 
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0)) 
        / 
        NULLIF(COALESCE((SELECT SUM(CASE WHEN YEAR(v.fechaVenta) = {year}  - 1 
            AND MONTH(v.fechaVenta) 
            IN ({meses}) THEN v.montoVenta ELSE 0 END) 
            FROM ventas v), 0), 0) * 100) AS porcentajeCrecimiento,

        -- Valor del inventario
        COALESCE((SELECT SUM(a.precioAlmacen * e.cantidadExistencia) 
            FROM articulos a 
            JOIN existencias e ON e.fkCodigoArticulo = a.codigoArticulo 
            WHERE YEAR(e.fechaExistencia) = {year}  
            AND MONTH(e.fechaExistencia) 
            IN ({meses})), 0) AS valorInventario,

        -- Cuentas por cobrar
        COALESCE((SELECT SUM(f.totalFactura) 
            FROM facturas f 
            WHERE f.fechaPagado IS NULL 
            AND YEAR(f.fechaFactura) = {year}  
            AND MONTH(f.fechaFactura) 
            IN ({meses})), 0) AS totalCxC,

        -- Cuentas por pagar
        COALESCE((SELECT SUM(cm.montoMercancia) 
            FROM compras_mercancia cm 
            WHERE cm.pagoPendiente != 0 
            AND YEAR(cm.fechaMercancia) = {year} 
            AND MONTH(cm.fechaMercancia) 
            IN ({meses})), 0) AS totalCxP,

        -- Compras de mercancia
         COALESCE((SELECT SUM(cm.montoMercancia) 
            FROM compras_mercancia cm 
            WHERE
            YEAR(cm.fechaMercancia) = {year}  
            AND MONTH(cm.fechaMercancia) 
            IN ({meses})), 0) AS totalComprasMercancia,


        -- Total de gastos
        COALESCE((SELECT SUM(g.montoGasto) 
            FROM gastos g 
            WHERE YEAR(g.fechaGasto) = {year} 
            AND MONTH(g.fechaGasto) 
            IN ({meses})), 0) AS totalGastos,

        -- Existencias en inventario
        COALESCE((SELECT SUM(e.cantidadExistencia) 
            FROM articulos a 
            JOIN proveedores p ON p.pkProveedor = a.fkProveedor 
            JOIN existencias e ON e.fkCodigoArticulo = a.codigoArticulo 
            WHERE YEAR(e.fechaExistencia) = {year}  
            AND MONTH(e.fechaExistencia) 
            IN ({meses})), 0) AS existencias,

        -- Cantidad de socios comerciales negociados
        COALESCE((SELECT COUNT(DISTINCT sc.nombreSocio) 
            FROM articulos_ventas av 
            JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra 
            JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
            WHERE YEAR(oc.fechaOrdenCompra) = {year}  
            AND MONTH(oc.fechaOrdenCompra) 
            IN ({meses})), 0) AS sociosNegociados,

        -- Total de artículos vendidos
        COALESCE((SELECT COUNT(av.fkCodigoArticulo) 
            FROM articulos_ventas av 
            JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra 
            WHERE YEAR(oc.fechaOrdenCompra) = {year} 
            AND MONTH(oc.fechaOrdenCompra) 
            IN ({meses})), 0) AS articulosVendidos,

        MAX(GREATEST(
            COALESCE((SELECT MAX(f.fechaPagado) FROM facturas f WHERE f.fechaPagado IS NOT NULL AND MONTH(f.fechaPagado) 
            IN ({meses}) AND YEAR(f.fechaPagado) = {year}), '0000-00-00'),

            COALESCE((SELECT MAX(g.fechaGasto) FROM gastos g WHERE MONTH(g.fechaGasto) 
            IN ({meses}) AND YEAR(g.fechaGasto) = {year}), '0000-00-00'),

            COALESCE((SELECT MAX(cm.fechaMercancia) FROM compras_mercancia cm WHERE MONTH(cm.fechaMercancia) 
            IN ({meses}) AND YEAR(cm.fechaMercancia) = {year}), '0000-00-00'),

            COALESCE((SELECT MAX(v.fechaVenta) FROM ventas v WHERE MONTH(v.fechaVenta) 
            IN ({meses}) AND YEAR(v.fechaVenta) = {year}), '0000-00-00'),

            COALESCE((SELECT MAX(oc.fechaOrdenCompra) FROM ordenes_compra oc WHERE MONTH(oc.fechaOrdenCompra) 
            IN ({meses}) AND YEAR(oc.fechaOrdenCompra) = {year}), '0000-00-00'),
            
            COALESCE((SELECT MAX(e.fechaExistencia) FROM existencias e WHERE MONTH(e.fechaExistencia) 
            IN ({meses}) AND YEAR(e.fechaExistencia) = {year}), '0000-00-00')
        )) AS fechaMasRecienteMes
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    

    def listar_ingresos(self):

        db = Database()

        if self.foreingKey == 'AND gs.pkGrupoSocio = 621':
            consulta = '''
            SELECT gs.nombreGrupoSocio AS grupo, SUM(f.totalFactura) AS totalFacturado FROM facturas f
            LEFT JOIN ordenes_compra oc ON oc.pkOrdenCompra = f.fkOrdenCompra
            LEFT JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
            LEFT JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
            WHERE f.fechaPagado IS NOT NULL 
            AND YEAR(f.fechaPagado) = %s
            GROUP BY gs.nombreGrupoSocio
            ORDER BY totalFacturado DESC;
            '''

            print(consulta)

            resultado = db.execute_query(consulta, (self.fecha,))
            db.close()

            return resultado
            
        else:

            consulta = '''
            SELECT sc.nombreSocio, f.totalFactura, f.fechaFactura FROM facturas f  
            LEFT JOIN ordenes_compra oc ON oc.pkOrdenCompra = f.fkOrdenCompra
            LEFT JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
            LEFT JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
            WHERE f.fechaPagado IS NOT NULL AND YEAR(f.fechaPagado) = 
            '''

            if self.fecha:
                consulta += f" {self.fecha}"

            if self.foreingKey:
                consulta += f" {self.foreingKey}"

            print(consulta)
            resultado = db.execute_query(consulta)
            db.close()
            return resultado

    @staticmethod
    def listar_cuentasPorPagar():

        db = Database()

        consulta = '''
    	SELECT p.nombreProveedor, cm.folioELV, cm.fechaMercancia, cm.pagoPendiente FROM compras_mercancia cm
        JOIN proveedores p ON cm.fkProveedor = p.pkProveedor
        WHERE cm.pagoPendiente  != 0
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado

    @staticmethod
    def listar_cuentasPorCobrar():

        db = Database()

        consulta = '''
        SELECT sc.nombreSocio, f.totalFactura, f.fechaFactura, f.fechaPagado FROM facturas f 
        LEFT JOIN ordenes_compra oc ON oc.pkOrdenCompra = f.fkOrdenCompra 
        LEFT JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        LEFT JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio 
        WHERE f.fechaPagado IS NULL;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_top1(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
    	SELECT a.nombreArticulo, SUM(av.cantidadVenta) AS totalCantidadVendida
        FROM articulos_ventas av
        JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
        JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) AND MONTH(oc.fechaOrdenCompra) IN ({meses})
        GROUP BY a.nombreArticulo
        ORDER BY totalCantidadVendida DESC
        LIMIT 20
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_top2(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
    	SELECT 
            sc.nombreSocio, 
            COUNT(DISTINCT oc.pkOrdenCompra) AS totalOrdenesCompra
        FROM ordenes_compra oc
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) 
        AND MONTH(oc.fechaOrdenCompra) IN ({meses}) -- O reemplazar por los últimos 3 meses
        GROUP BY sc.nombreSocio
        ORDER BY totalOrdenesCompra DESC
        LIMIT 20;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_top3(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
    	SELECT a.nombreArticulo, sc.nombreSocio, (av.cantidadVenta * av.precioVenta) AS monto FROM articulos_ventas av 
        JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
        JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) AND MONTH(oc.fechaOrdenCompra) IN ({meses})
        GROUP BY a.nombreArticulo
        ORDER BY monto DESC
        LIMIT 20;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado

    @staticmethod
    def listar_top4(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT a.nombreArticulo, SUM(av.cantidadVenta) AS totalCantidadVendida
        FROM articulos_ventas av
        JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
        JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) AND MONTH(oc.fechaOrdenCompra) IN ({meses})
        GROUP BY a.nombreArticulo
        ORDER BY totalCantidadVendida ASC
        LIMIT 20;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_grafica1(meses_str, grupo):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT 
        sc.nombreSocio, SUM(v.montoVenta) AS monto 
        FROM ventas v
        JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        WHERE {grupo} YEAR(v.fechaVenta) = 2025 AND MONTH(v.fechaVenta) IN ({meses})
        GROUP BY sc.nombreSocio
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_grafica2(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT 
            gs.nombreGrupoSocio, 
            MONTH(v.fechaVenta) AS mes, 
            SUM(v.montoVenta) AS totalMonto
        FROM ventas v
        JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        WHERE YEAR(v.fechaVenta) = YEAR(CURDATE()) 
        AND MONTH(v.fechaVenta) IN ({meses})
        GROUP BY gs.nombreGrupoSocio, MONTH(v.fechaVenta)
        ORDER BY gs.nombreGrupoSocio, mes;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_grafica3(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT 
            a.nombreArticulo, 
            SUM(av.cantidadVenta) AS totalPiezasVendidas
        FROM articulos_ventas av
        JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
        JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) AND MONTH(oc.fechaOrdenCompra) IN ({meses})
        GROUP BY a.nombreArticulo
        ORDER BY totalPiezasVendidas DESC;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_servicio(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT 
            oc.numeroOrdenCompra, 
            sc.nombreSocio,
            AVG(av.cantidadVenta / ao.cantidadOrden * 100) AS porcentajePromedioServicio
        FROM ordenes_compra oc
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        JOIN articulos_ventas av ON av.fkOrdenCompra = oc.pkOrdenCompra
        JOIN articulos_ordenes ao ON ao.fkOrdenCompra = oc.pkOrdenCompra
        WHERE YEAR(oc.fechaOrdenCompra) = YEAR(CURDATE()) 
        AND MONTH(oc.fechaOrdenCompra) IN ({meses}) 
        AND av.fkCodigoArticulo = ao.fkCodigoArticulo
        GROUP BY oc.numeroOrdenCompra
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado