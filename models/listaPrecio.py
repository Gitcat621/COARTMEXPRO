from database import Database

class ListaPrecio:
    def __init__(self, fkArticulo=None, fkSocioComercial=None, precioArticulo=None):
        """Inicializa un objeto"""
        self.fkArticulo = fkArticulo
        self.fkSocioComercial = fkSocioComercial
        self.precioArticulo = precioArticulo


    @staticmethod
    def listar_listas_precios():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM listas_precios")
        db.close()
        return resultado
    
    def obtener_lista_precio(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        lp.fkArticulo,
        lp.fkSocioComercial,
        lp.precioArticulo,
        a.nombreArticulo,
        sc.nombreSocio,
        gs.nombreGrupoSocio
        FROM listas_precios lp 
        JOIN articulos a ON lp.fkArticulo = a.codigoArticulo
        JOIN socios_comerciales sc ON sc.pkSocioComercial = lp.fkSocioComercial
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio
        WHERE fkSocioComercial = %s
        '''
        resultado = db.execute_query(consulta,(self.fkSocioComercial,))
        db.close()
        return resultado
    
    def crear_lista_precios(articulos, fkSocioComercial, modo):
        """
        Sincroniza la lista de precios:
        - Si modo == 0: Aplica la lógica normal para un solo socio comercial.
        - Si modo == 1: Aplica la lógica a todos los socios comerciales que compartan el fkGrupoSocio.
        """
        db = Database()
        try:
            db.connection.autocommit = False  # Inicia transacción

            with db.connection.cursor() as cursor:
                # Paso 0: Determinar los socios comerciales a los que se aplicará
                if modo == 1:
                    # Buscar el grupo del socio original
                    cursor.execute("""
                        SELECT fkGrupoSocio FROM socios_comerciales WHERE pkSocioComercial = %s
                    """, (fkSocioComercial,))
                    grupo = cursor.fetchone()
                    if not grupo:
                        raise Exception("No se encontró el grupo del socio comercial.")

                    fkGrupoSocio = grupo["fkGrupoSocio"]

                    # Obtener todos los socios del mismo grupo
                    cursor.execute("""
                        SELECT pkSocioComercial FROM socios_comerciales WHERE fkGrupoSocio = %s
                    """, (fkGrupoSocio,))
                    socios = [row["pkSocioComercial"] for row in cursor.fetchall()]
                else:
                    socios = [fkSocioComercial]  # Solo uno

                # Paso 1–4: Repetir el proceso para cada socio correspondiente
                for socio in socios:
                    # 1: Obtener precios actuales
                    cursor.execute("""
                        SELECT fkArticulo, precioArticulo
                        FROM listas_precios
                        WHERE fkSocioComercial = %s
                    """, (socio,))
                    precios_actuales = {str(row['fkArticulo']): row['precioArticulo'] for row in cursor.fetchall()}

                    # 2: Convertir artículos nuevos a diccionario
                    nuevos_precios = {str(a['codigo']): a['precio'] for a in articulos}

                    # 3: Insertar nuevos o actualizar si cambió
                    for codigo, nuevo_precio in nuevos_precios.items():
                        if codigo not in precios_actuales:
                            cursor.execute("""
                                INSERT INTO listas_precios (fkArticulo, fkSocioComercial, precioArticulo)
                                VALUES (%s, %s, %s)
                            """, (codigo, socio, nuevo_precio))
                        elif precios_actuales[codigo] != nuevo_precio:
                            cursor.execute("""
                                UPDATE listas_precios
                                SET precioArticulo = %s
                                WHERE fkArticulo = %s AND fkSocioComercial = %s
                            """, (nuevo_precio, codigo, socio))

                    # 4: Eliminar precios que ya no existen en la nueva lista
                    codigos_nuevos = set(nuevos_precios.keys())
                    codigos_actuales = set(precios_actuales.keys())
                    codigos_a_eliminar = codigos_actuales - codigos_nuevos

                    for codigo in codigos_a_eliminar:
                        cursor.execute("""
                            DELETE FROM listas_precios
                            WHERE fkArticulo = %s AND fkSocioComercial = %s
                        """, (codigo, socio))

            db.connection.commit()
            print("🆗 Lista de precios sincronizada correctamente.")
            return True

        except Exception as e:
            db.connection.rollback()
            print(f"🛑 Error al sincronizar lista de precios: {e}")
            return False

        finally:
            db.close()

    def editar_lista_precios(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.fkArticulo)
        query = "UPDATE listas_precios SET precioArticulo = %s WHERE fkArticulo = %s AND  fkSocioComercial = %s"
        resultado = db.execute_commit(query, (self.precioArticulo, self.fkArticulo, self.fkSocioComercial))
        db.close()
        return resultado

    def eliminar_lista_precios(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM listas_precios WHERE fkArticulo = %s AND fkSocioComercial = %s"
        resultado = db.execute_commit(query, (self.fkArticulo, self.fkSocioComercial))
        db.close()
        return resultado


