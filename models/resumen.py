from database import Database

class Resumen:
    def __init__(self, foreingKey=None, fecha=None):
        """Inicializa un objeto"""
        self.foreingKey = foreingKey
        self.fecha = fecha


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
            FROM ventas v 
            JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial 
            WHERE YEAR(v.fechaVenta) = {year} 
            AND MONTH(v.fechaVenta) 
            IN ({meses})), 0) AS sociosNegociados,

        -- Total de artículos vendidos
        COALESCE((SELECT SUM(av.cantidadVenta)
            FROM articulos_ventas av 
            JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
            JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra 
            WHERE YEAR(ra.fechaEntrega) = {year} 
            AND MONTH(ra.fechaEntrega) 
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
            SELECT sc.nombreSocio, f.totalFactura, f.fechaPagado FROM facturas f  
            JOIN ordenes_compra oc ON oc.pkOrdenCompra = f.fkOrdenCompra
            JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
            JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
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
        JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra 
        WHERE YEAR(ra.fechaEntrega) = YEAR(CURDATE()) AND MONTH(ra.fechaEntrega) IN ({meses})
        GROUP BY a.nombreArticulo
        ORDER BY totalCantidadVendida DESC
  
        '''
        #

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
            gs.nombreGrupoSocio,
            COUNT(DISTINCT oc.numeroOrdenCompra) AS totalOrdenesCompra
        FROM ordenes_compra oc
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
        JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        WHERE YEAR(ra.fechaEntrega) = YEAR(CURDATE()) 
        AND MONTH(ra.fechaEntrega) IN ({meses})
        GROUP BY gs.nombreGrupoSocio
        ORDER BY totalOrdenesCompra DESC;
        
        '''
        #GROUP BY sc.nombreSocio
        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_top3(meses_str):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT gs.nombreGrupoSocio, SUM(av.cantidadVenta) AS totalCantidadVendida
                FROM articulos_ventas av
                JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
                JOIN ordenes_compra oc ON oc.pkOrdenCompra = av.fkOrdenCompra
                JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial
                JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
                JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra 
                WHERE YEAR(ra.fechaEntrega) = YEAR(CURDATE()) AND MONTH(ra.fechaEntrega) IN ({meses})
                GROUP BY gs.nombreGrupoSocio;
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
        JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra
        WHERE YEAR(ra.fechaEntrega) = YEAR(CURDATE()) AND MONTH(ra.fechaEntrega) IN ({meses})
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
            gs.nombreGrupoSocio,
            a.codigoArticulo,
            a.nombreArticulo,
            av.cantidadOrden AS cantidadOrdenada,
            COALESCE(av.cantidadVenta, 0) AS cantidadVendida,
            COALESCE(av.precioVenta, 0) AS precioVenta,
            av.cantidadVenta / av.cantidadOrden * 100 AS porcentajePromedioServicio
        FROM ordenes_compra oc
     	JOIN articulos_ventas av ON av.fkOrdenCompra = oc.pkOrdenCompra
        JOIN articulos a ON a.codigoArticulo = av.fkCodigoArticulo
        JOIN socios_comerciales sc ON sc.pkSocioComercial = oc.fkSocioComercial 
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        JOIN respuestas_almacen ra ON ra.fkOrdenCompra = oc.pkOrdenCompra
        WHERE YEAR(ra.fechaEntrega) = YEAR(CURDATE()) 
                AND MONTH(ra.fechaEntrega) IN ({meses}) 
        ORDER BY oc.numeroOrdenCompra, a.nombreArticulo;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    
    @staticmethod
    def listar_sociosEnVentas(meses_str, year):

        db = Database()

        meses = ", ".join(str(int(mes)) for mes in meses_str)  # Convertir y unir

        consulta = f'''
        SELECT sc.nombreSocio, SUM(v.montoVenta) AS totalVenta, gs.nombreGrupoSocio
        FROM ventas v 
        JOIN socios_comerciales sc ON sc.pkSocioComercial = v.fkSocioComercial 
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        WHERE YEAR(v.fechaVenta) = {year} 
        AND MONTH(v.fechaVenta) IN ({meses}) 
        GROUP BY sc.nombreSocio ORDER BY totalVenta DESC;
        '''

        print(consulta)

        resultado = db.execute_query(consulta)
        db.close()

        return resultado
    



    @staticmethod
    def es_entero(valor):
        """Verifica si un valor puede convertirse a entero."""
        try:
            int(valor)
            return True
        except (ValueError, TypeError):
            return False


    @staticmethod
    def agregar_info_empleado(nombreEmpleado, fechaIngreso, nomina, vale, fkPuesto, state, numeroEmpleado, rfc, fechaNacimiento, pkNumerosEmergencia, 
                        numerosEmergencia, pkUniformeEmpleado, tallaUniforme, pzasUniforme, fkNivelEstudio, fkUbicacion, puebloCiudad, estado, pais):
    
        db = Database()

        try:
            if pkNumerosEmergencia is None:
                # --- Insertar números de emergencia ---
                consultaNumeros = 'INSERT INTO numeros_emergencia (numeroEmergencia, fkEmpleado) VALUES (%s, %s)'
                valoresNumeros = [(numero, numeroEmpleado) for numero in numerosEmergencia]
                db.cursor.executemany(consultaNumeros, valoresNumeros)
            else:
                # Convertir las cadenas en conjuntos de enteros
                pk_numeros_set = set(map(int, pkNumerosEmergencia.split("-")))
                numeros_emergencia_set = set(map(int, numerosEmergencia))

                # Identificar números eliminados y nuevos
                eliminados = pk_numeros_set - numeros_emergencia_set
                nuevos = numeros_emergencia_set - pk_numeros_set

                # --- Eliminar números que ya no están ---
                if eliminados:
                    consultaEliminar = 'DELETE FROM numeros_emergencia WHERE pkNumeroEmergencia IN (%s)'
                    valoresEliminar = ", ".join(map(str, eliminados))
                    db.cursor.execute(consultaEliminar % valoresEliminar)

                # --- Insertar nuevos números ---
                if nuevos:
                    consultaInsertar = 'INSERT INTO numeros_emergencia (numeroEmergencia, fkEmpleado) VALUES (%s, %s)'
                    valoresInsertar = [(numero, numeroEmpleado) for numero in nuevos]
                    db.cursor.executemany(consultaInsertar, valoresInsertar)
            

            # --- Insertar uniforme ---
            if pkUniformeEmpleado is None:
                consultaUniformes = 'INSERT INTO uniformes_empleados (tallaUniforme, pzasUniforme, fkEmpleado) VALUES (%s,%s,%s)'
                valoresUniforme = (tallaUniforme, pzasUniforme, numeroEmpleado)
                db.cursor.execute(consultaUniformes, valoresUniforme)
            else:
                consultaUniformes = 'UPDATE uniformes_empleados set tallaUniforme = %s, pzasUniforme = %s WHERE pkUniformeEmpleado = %s'
                valoresUniforme = (tallaUniforme, pzasUniforme, pkUniformeEmpleado)
                db.cursor.execute(consultaUniformes, valoresUniforme)

            # --- Insertar o recuperar ID de pueblo ---
            if Resumen.es_entero(puebloCiudad):
                puebloCiudad = int(puebloCiudad)
            else:
                db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (puebloCiudad,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                puebloCiudad = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de estado ---
            if Resumen.es_entero(estado):
                estado = int(estado)
            else:
                db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estado,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                estado = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de país ---
            if Resumen.es_entero(pais):
                pais = int(pais)
            else:
                db.cursor.execute('INSERT INTO paises (nombrePais) VALUES (%s)', (pais,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                pais = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar ubicación ---
            if fkUbicacion is None:
                db.cursor.execute('INSERT INTO ubicaciones (fkPuebloCiudad, fkEstado, fkPais) VALUES (%s, %s, %s)', (puebloCiudad, estado, pais))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                fkUbicacion = db.cursor.fetchone()['LAST_INSERT_ID()']
            else:
                db.cursor.execute('UPDATE ubicaciones set fkPuebloCiudad = %s, fkEstado = %s, fkPais =%s WHERE pkUbicacion = %s', (puebloCiudad, estado, pais, fkUbicacion))
                
            # --- Actualizar empleado ---
            consultaEmpleado = "UPDATE empleados SET nombreEmpleado = %s, fechaIngreso = %s, nomina = %s, vale = %s, fkPuesto = %s, estado = %s,rfc = %s, fechaNacimiento = %s, fkNivelEstudio = %s, fkUbicacion = %s WHERE numeroEmpleado = %s"
            valoresEmpleado = (nombreEmpleado, fechaIngreso, nomina, vale, fkPuesto, state, rfc, fechaNacimiento, fkNivelEstudio, fkUbicacion, numeroEmpleado)
            db.cursor.execute(consultaEmpleado, valoresEmpleado)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True

        except Exception as e:
            # ❌ Cancelar cambios si ocurre error
            db.connection.rollback()
            print("❌ Transacción cancelada por error:", e)
            return False

        finally:
            db.close()
