from database import Database

class Ruta:
    def __init__(self, pkRuta=None, fechaRuta=None, fkEmpleado=None):
        """Inicializa un objeto"""
        self.pkRuta = pkRuta
        self.fechaRuta = fechaRuta
        self.fkEmpleado = fkEmpleado

    def listar_rutas(fechaRuta, modo):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        if modo is '1':
            consulta = '''
            SELECT 
            e.nombreEmpleado, 
            zr.nombreZonaRuta, 
            GROUP_CONCAT(DISTINCT sc.nombreSocio SEPARATOR ' - ') AS tiendas, 
            r.fechaRuta, 
            sc.fkZonaRuta,
            e.numeroEmpleado,
            r.pkRuta 
            FROM rutas r 
            JOIN Empleados e ON e.numeroEmpleado = r.fkEmpleado 
            JOIN rutas_ubicaciones ru ON ru.fkRuta = r.pkRuta 
            JOIN socios_comerciales sc ON ru.fkSocioComercial = sc.pkSocioComercial 
            LEFT JOIN zonas_ruta zr ON sc.fkZonaRuta = zr.pkZonaRuta 
            WHERE r.fechaRuta <= %s
            GROUP BY r.pkRuta, e.nombreEmpleado, r.fechaRuta
            ORDER BY r.fechaRuta DESC
            '''

            print('hice la consulta 1')

            resultado = db.execute_query(consulta, (fechaRuta,))
        else:
            consulta = '''
            SELECT 
            e.nombreEmpleado, 
            zr.nombreZonaRuta, 
            GROUP_CONCAT(DISTINCT sc.nombreSocio SEPARATOR ' - ') AS tiendas, 
            r.fechaRuta,
            sc.fkZonaRuta, 
            e.numeroEmpleado,
            r.pkRuta 
            FROM rutas r 
            JOIN Empleados e ON e.numeroEmpleado = r.fkEmpleado 
            JOIN rutas_ubicaciones ru ON ru.fkRuta = r.pkRuta 
            JOIN socios_comerciales sc ON ru.fkSocioComercial = sc.pkSocioComercial 
            LEFT JOIN zonas_ruta zr ON sc.fkZonaRuta = zr.pkZonaRuta 
            WHERE YEARWEEK(r.fechaRuta, 1) = YEARWEEK(CURDATE(), 1)
            GROUP BY r.pkRuta, e.nombreEmpleado, r.fechaRuta
            ORDER BY r.fechaRuta ASC;
            '''

            print('hice la consulta 2')
            resultado = db.execute_query(consulta)
        
        db.close()
        return resultado
    
    def listar_destinos_ruta(pkRuta):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT * FROM rutas_ubicaciones ru
        WHERE fkRuta = %s
        '''

        resultado = db.execute_query(consulta,(pkRuta,))
        
        db.close()
        return resultado
    
    def crear_ruta(fechaRuta, fkEmpleado, tiendas):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        try:
            db.cursor.execute('INSERT INTO rutas (fechaRuta, fkEmpleado) VALUES (%s,%s)', (fechaRuta, fkEmpleado))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            pkRuta = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar destinos de ruta ---
            if tiendas:
                consultaDestinos = 'INSERT INTO rutas_ubicaciones (fkRuta, fkSocioComercial) VALUES (%s, %s)'
                valoresTienda = [(pkRuta, tienda) for tienda in tiendas]
                db.cursor.executemany(consultaDestinos, valoresTienda)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al insertar ruta:", e)
            return False
        finally:
            db.close()

    def editar_ruta(pkRuta, fechaRuta, fkEmpleado, tiendas):
        """
        Edita una ruta existente:
        - Actualiza la fecha y empleado.
        - Sincroniza las relaciones con socios comerciales:
        - Elimina las que ya no están en la lista.
        - Agrega nuevas relaciones que no existían.
        """
        db = Database()

        try:
            db.connection.autocommit = False  # Inicia transacción

            with db.connection.cursor() as cursor:
                # Paso 1: Actualizar la ruta principal
                cursor.execute(
                    "UPDATE rutas SET fechaRuta = %s, fkEmpleado = %s WHERE pkRuta = %s",
                    (fechaRuta, fkEmpleado, pkRuta)
                )

                # Paso 2: Obtener relaciones actuales en rutas_ubicaciones
                cursor.execute(
                    "SELECT fkSocioComercial FROM rutas_ubicaciones WHERE fkRuta = %s",
                    (pkRuta,)
                )
                relaciones_actuales = {row['fkSocioComercial'] for row in cursor.fetchall()}

                nuevas_tiendas = set(tiendas)

                # Paso 3: Determinar cuáles eliminar y cuáles insertar
                a_eliminar = relaciones_actuales - nuevas_tiendas
                a_insertar = nuevas_tiendas - relaciones_actuales

                # Paso 4: Eliminar relaciones que ya no están
                for socio_id in a_eliminar:
                    cursor.execute(
                        "DELETE FROM rutas_ubicaciones WHERE fkRuta = %s AND fkSocioComercial = %s",
                        (pkRuta, socio_id)
                    )

                # Paso 5: Insertar nuevas relaciones
                for socio_id in a_insertar:
                    cursor.execute(
                        "INSERT INTO rutas_ubicaciones (fkRuta, fkSocioComercial) VALUES (%s, %s)",
                        (pkRuta, socio_id)
                    )

            db.connection.commit()
            print("🆗 Ruta actualizada correctamente.")
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"🛑 Error al editar ruta: {e}")
            return False

        finally:
            db.close()

    def eliminar_ruta(self):
        """Elimina una ruta y sus relaciones en la tabla intermedia."""
        db = Database()

        try:
            db.connection.autocommit = False  # Inicia una transacción

            with db.connection.cursor() as cursor:
                # Eliminar relaciones en la tabla intermedia
                delete_relaciones = "DELETE FROM rutas_ubicaciones WHERE fkRuta = %s"
                cursor.execute(delete_relaciones, (self.pkRuta,))

                # Eliminar la ruta principal
                delete_ruta = "DELETE FROM rutas WHERE pkRuta = %s"
                cursor.execute(delete_ruta, (self.pkRuta,))

            db.connection.commit()
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"Error al eliminar ruta: {e}")
            return False

        finally:
            db.close()



