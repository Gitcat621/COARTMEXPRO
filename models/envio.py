from database import Database

class Envio:
    def __init__(self, pkEnvio=None, numeroGuia=None, fechaEnvio=None, fkPaqueteria=None, fkSocioComercial=None):
        """Inicializa un objeto"""
        self.pkEnvio = pkEnvio
        self.numeroGuia = numeroGuia
        self.fechaEnvio = fechaEnvio
        self.fkPaqueteria = fkPaqueteria
        self.fkSocioComercial = fkSocioComercial


    @staticmethod
    def listar_envios():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT e.numeroGuia, e.fechaEnvio, sc.nombreSocio, p.nombrePaqueteria, e.fkPaqueteria, e.fkSocioComercial, COUNT(ce.pkCaja) AS numCajas, e.pkEnvio FROM envios e 
        JOIN socios_comerciales sc ON sc.pkSocioComercial = e.fkSocioComercial 
        JOIN paqueterias p ON p.pkPaqueteria = e.fkPaqueteria 
        LEFT JOIN cajas_envios ce ON ce.fkEnvio = e.pkEnvio
        GROUP BY e.pkEnvio;'''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_envio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO envios (numeroGuia, fechaEnvio, fkPaqueteria, fkSocioComercial) VALUES (%s,%s,%s,%s)"
        values = (self.numeroGuia,self.fechaEnvio,self.fkPaqueteria,self.fkSocioComercial)
        resultado = db.execute_commit(query, values)
        print(query % values)
        db.close()
        return resultado

    def editar_envio(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkEnvio)
        query = "UPDATE envios SET numeroGuia = %s, fechaEnvio = %s, fkPaqueteria = %s, fkSocioComercial = %s WHERE pkEnvio = %s"
        resultado = db.execute_commit(query, (self.numeroGuia, self.fechaEnvio, self.fkPaqueteria, self.fkSocioComercial ,self.pkEnvio))
        db.close()
        return resultado

    def eliminar_envio(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM envios WHERE pkEnvio = %s"
        resultado = db.execute_commit(query, (self.pkEnvio,))
        db.close()
        return resultado

#/////CAJAS/////

    def listar_cajas(pkEnvio):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT a.nombreArticulo, ca.cantidad, ce.pkCaja
        FROM envios e 
        JOIN cajas_envios ce ON ce.fkEnvio = e.pkEnvio
        JOIN cajas_articulos ca ON ca.fkCaja = ce.pkCaja
        JOIN articulos a ON a.codigoArticulo = ca.fkArticulo 
        WHERE e.pkEnvio = %s;'''
        resultado = db.execute_query(consulta, (pkEnvio,))
        db.close()
        return resultado
    
    def listar_caja_contenido(pkCaja):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT a.codigoArticulo, a.nombreArticulo, ca.cantidad, ce.pkCaja
        FROM envios e 
        JOIN cajas_envios ce ON ce.fkEnvio = e.pkEnvio
        JOIN cajas_articulos ca ON ca.fkCaja = ce.pkCaja
        JOIN articulos a ON a.codigoArticulo = ca.fkArticulo 
        WHERE ce.pkCaja = %s;'''
        resultado = db.execute_query(consulta, (pkCaja,))
        db.close()
        return resultado

    def crear_caja(pkEnvio, articulos):
        db = Database()
        try:                
            # --- Insertar caja ---
            db.cursor.execute("INSERT INTO cajas_envios (fkEnvio) VALUES (%s)",(pkEnvio,))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            pkCaja = db.cursor.fetchone()['LAST_INSERT_ID()']

            print(pkCaja)
            print(articulos)

            # --- Insertar articulos en caja ---
            if articulos:
                consultaCajaArticulos = 'INSERT INTO cajas_articulos (fkCaja, fkArticulo, cantidad) VALUES (%s, %s, %s)'
                valoresArticulos = [(pkCaja, articulo['codigo'], articulo['cantidad']) for articulo in articulos]

                
                db.cursor.executemany(consultaCajaArticulos, valoresArticulos)


            db.connection.commit()
            print("🆗 Caja con articulos insertada correctamente.")
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"🛑 Error al insertar caja: {e}")
            return False

        finally:
            db.close()

    def editar_caja(pkCaja, articulos):
        db = Database()
        try:
            db.connection.autocommit = False
            cursor = db.cursor

            # 1. Obtener relaciones actuales
            cursor.execute("SELECT fkArticulo, cantidad FROM cajas_articulos WHERE fkCaja = %s", (pkCaja,))
            relaciones_actuales = cursor.fetchall()

            actuales_dict = {rel['fkArticulo']: rel['cantidad'] for rel in relaciones_actuales}
            nuevos_dict = {art['codigo']: art['cantidad'] for art in articulos}

            # 2. Determinar artículos a eliminar, actualizar o insertar
            articulos_actuales = set(actuales_dict.keys())
            articulos_nuevos = set(nuevos_dict.keys())

            # a) Eliminar los que ya no están
            a_eliminar = articulos_actuales - articulos_nuevos
            if a_eliminar:
                cursor.executemany(
                    "DELETE FROM cajas_articulos WHERE fkCaja = %s AND fkArticulo = %s",
                    [(pkCaja, fk) for fk in a_eliminar]
                )

            # b) Actualizar cantidad si cambió
            a_actualizar = articulos_actuales & articulos_nuevos
            for fk in a_actualizar:
                if actuales_dict[fk] != nuevos_dict[fk]:
                    cursor.execute(
                        "UPDATE cajas_articulos SET cantidad = %s WHERE fkCaja = %s AND fkArticulo = %s",
                        (nuevos_dict[fk], pkCaja, fk)
                    )

            # c) Insertar nuevos
            a_insertar = articulos_nuevos - articulos_actuales
            if a_insertar:
                valores = [(pkCaja, fk, nuevos_dict[fk]) for fk in a_insertar]
                cursor.executemany(
                    "INSERT INTO cajas_articulos (fkCaja, fkArticulo, cantidad) VALUES (%s, %s, %s)",
                    valores
                )

            db.connection.commit()
            print("🆗 Caja actualizada correctamente.")
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"🛑 Error al editar caja: {e}")
            return False

        finally:
            db.close()

    def eliminar_caja(pkCaja):
        db = Database()
        try:
            db.connection.autocommit = False
            cursor = db.cursor

            # 1. Eliminar relaciones en cajas_articulos
            cursor.execute("DELETE FROM cajas_articulos WHERE fkCaja = %s", (pkCaja,))

            # 2. Eliminar la caja
            cursor.execute("DELETE FROM cajas_envios WHERE pkCaja = %s", (pkCaja,))

            db.connection.commit()
            print("🗑️ Caja y relaciones eliminadas correctamente.")
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"🛑 Error al eliminar caja: {e}")
            return False

        finally:
            db.close()

