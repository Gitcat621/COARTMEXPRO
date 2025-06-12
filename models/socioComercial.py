from database import Database

class SocioComercial:
    def __init__(self, pkSocioComercial=None, nombreSocio=None, razonSocial=None, fkGrupoSocio=None, fkUbicacion=None):
        """Inicializa un objeto"""
        self.pkSocioComercial = pkSocioComercial
        self.nombreSocio = nombreSocio
        self.razonSocial = razonSocial
        self.fkGrupoSocio = fkGrupoSocio
        self.fkUbicacion = fkUbicacion


    @staticmethod
    def listar_sociosComerciales():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = """ 
        SELECT sc.nombreSocio, sc.razonSocial, gs.nombreGrupoSocio, cp.codigoPostal, pc.nombrePuebloCiudad, m.nombreMunicipio, e.nombreEstado, p.nombrePais, sc.fkGrupoSocio, sc.fkUbicacion, cp.pkCodigoPostal, pc.pkPuebloCiudad, m.pkMunicipio, e.pkEstado, p.pkPais ,sc.pkSocioComercial FROM socios_comerciales sc 
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio 
        LEFT JOIN ubicaciones u ON u.pkUbicacion = sc.fkUbicacion
        LEFT JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal
        LEFT JOIN pueblos_ciudades pc ON pc.pkPuebloCiudad = u.fkPuebloCiudad
        LEFT JOIN municipios m ON m.pkMunicipio = u.fkMunicipio
        LEFT JOIN estados e ON e.pkEstado = u.fkEstado
        LEFT JOIN paises p ON p.pkPais = u.fkPais
        """
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    @staticmethod
    def es_entero(valor):
        """Verifica si un valor puede convertirse a entero."""
        print("el valor es: ", valor)

        try:
            int(valor)
            print("Si es un numero")
            return True
        except (ValueError, TypeError):
            print("NO es un numero")
            return False

    def crear_socioComercial(nombreSocio,razonSocial,fkGrupoSocio,fkUbicacion,puebloCiudad,estado,pais):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()

        # --- Insertar o recuperar ID de pueblo ---
        if SocioComercial.es_entero(puebloCiudad):
            puebloCiudad = int(puebloCiudad)
        else:
            db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (puebloCiudad,))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            puebloCiudad = db.cursor.fetchone()['LAST_INSERT_ID()']

        # --- Insertar o recuperar ID de estado ---
        if SocioComercial.es_entero(estado):
            estado = int(estado)
        else:
            db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estado,))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            estado = db.cursor.fetchone()['LAST_INSERT_ID()']

        # --- Insertar o recuperar ID de país ---
        if SocioComercial.es_entero(pais):
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

        query = "INSERT INTO socios_comerciales (nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion) VALUES (%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (nombreSocio,razonSocial,fkGrupoSocio,fkUbicacion))
        db.close()
        return resultado

    def editar_socioComercial(pkSocioComercial,nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, puebloCiudad, estado, pais):
        """Edita un registro en la base de datos."""

        db = Database()

        # --- Insertar o recuperar ID de pueblo ---
        if SocioComercial.es_entero(puebloCiudad):
            puebloCiudad = int(puebloCiudad)
        else:
            db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (puebloCiudad,))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            puebloCiudad = db.cursor.fetchone()['LAST_INSERT_ID()']

        # --- Insertar o recuperar ID de estado ---
        if SocioComercial.es_entero(estado):
            estado = int(estado)
        else:
            db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estado,))
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            estado = db.cursor.fetchone()['LAST_INSERT_ID()']

        # --- Insertar o recuperar ID de país ---
        if SocioComercial.es_entero(pais):
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
        
        query = "UPDATE socios_comerciales SET nombreSocio = %s, razonSocial = %s, fkGrupoSocio = %s, fkUbicacion = %s WHERE pkSocioComercial = %s"
        resultado = db.execute_commit(query, (nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, pkSocioComercial))
        db.close()
        return resultado

    def eliminar_socioComercial(self):
        """Elimina un registro de la base de datos."""

        if not self.pkSocioComercial:
            raise ValueError("El area debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM socios_comerciales WHERE pkSocioComercial = %s"
        resultado = db.execute_commit(query, (self.pkSocioComercial,))
        db.close()
        return resultado

