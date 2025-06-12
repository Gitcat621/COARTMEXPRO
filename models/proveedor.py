from database import Database

class Proveedor:
    def __init__(self, pkProveedor=None, nombreProveedor=None, correoProveedor=None, diasCredito=None, facturaNota =None, fkUbicacion=None):
        """Inicializa un objeto"""
        self.pkProveedor = pkProveedor
        self.nombreProveedor = nombreProveedor
        self.correoProveedor = correoProveedor
        self.diasCredito = diasCredito
        self.facturaNota = facturaNota
        self.fkUbicacion = fkUbicacion


    @staticmethod
    def listar_proveedores():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
            p.nombreProveedor, 
            p.correoProveedor, 
            GROUP_CONCAT(DISTINCT tp.telefonoProveedor SEPARATOR ', ') AS telefonos, 
            GROUP_CONCAT(DISTINCT mp.nombreMetodoPago SEPARATOR ', ') AS metodosPago,
            p.diasCredito, 
            p.facturaNota,
            GROUP_CONCAT(DISTINCT b.nombreBanco SEPARATOR ', ') AS bancos, 
            GROUP_CONCAT(DISTINCT cb.numeroCuenta SEPARATOR ', ') AS numerosCuenta, 
            GROUP_CONCAT(DISTINCT cb.nombreBeneficiario SEPARATOR ', ') AS beneficiarios, 
            p.diasEntrega, 
            p.flete, 
            GROUP_CONCAT(DISTINCT pa.nombrePaqueteria SEPARATOR ', ') AS paqueterias,
            cp.codigoPostal, 
            upc.nombrePuebloCiudad,
            m.nombreMunicipio, 
            e.nombreEstado,
            p.fkUbicacion,
            cp.pkCodigoPostal,
            upc.pkPuebloCiudad,
            m.pkMunicipio,
            e.pkEstado,
            p.pkProveedor
        FROM proveedores p
        LEFT JOIN telefonos_proveedores tp ON tp.fkProveedor = p.pkProveedor
        LEFT JOIN proveedores_metodos pm ON pm.fkProveedor = p.pkProveedor
        LEFT JOIN metodos_pago mp ON mp.pkMetodoPago = pm.fkMetodoPago
        LEFT JOIN proveedores_paqueterias pp ON pp.fkProveedor = p.pkProveedor
        LEFT JOIN paqueterias pa ON pa.pkPaqueteria = pp.fkPaqueteria
        LEFT JOIN cuentas_banco cb ON cb.fkProveedor = p.pkProveedor
        LEFT JOIN bancos b ON b.pkBanco = cb.fkBanco
        LEFT JOIN ubicaciones u ON u.pkUbicacion = p.fkUbicacion  
        LEFT JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal
        LEFT JOIN pueblos_ciudades upc ON upc.pkPuebloCiudad = u.fkPuebloCiudad
        LEFT JOIN municipios m ON m.pkMunicipio = u.fkMunicipio
        LEFT JOIN estados e ON e.pkEstado = u.fkEstado
        GROUP BY p.pkProveedor;
        '''
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

    def crear_proveedor(nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete, codigoPostal, puebloCiudad, municipio, estado, numerosTelfono, paqueterias):
        """Guarda un nuevo proveedor en la base de datos"""
        db = Database()
        try:
            # --- Insertar o recuperar ID de código postal ---
            if len(codigoPostal) == 5:
                db.cursor.execute('INSERT INTO codigos_postales (codigoPostal) VALUES (%s)', (codigoPostal,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                codigoPostal_id = db.cursor.fetchone()['LAST_INSERT_ID()']
                

            # --- Insertar o recuperar ID de pueblo ---
            if Proveedor.es_entero(puebloCiudad):
                puebloCiudad_id = int(puebloCiudad)
            else:
                db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (puebloCiudad,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                puebloCiudad_id = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de municipio ---
            if Proveedor.es_entero(municipio):
                municipio_id = int(municipio)
            else:
                db.cursor.execute('INSERT INTO municipios (nombreMunicipio) VALUES (%s)', (municipio,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                municipio_id = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de estado ---
            if Proveedor.es_entero(estado):
                estado_id = int(estado)
            else:
                db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estado,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                estado_id = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar ubicación ---
            db.cursor.execute(
                'INSERT INTO ubicaciones (fkCodigoPostal, fkPuebloCiudad, fkMunicipio, fkEstado) VALUES (%s, %s, %s, %s)',
                (codigoPostal_id, puebloCiudad_id, municipio_id, estado_id)
            )
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            fkUbicacion = db.cursor.fetchone()['LAST_INSERT_ID()']

            print("Estoy aqui")

            # --- Insertar proveedor ---
            db.cursor.execute(
                "INSERT INTO proveedores (nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete, fkUbicacion) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete, fkUbicacion)
            )
            db.cursor.execute('SELECT LAST_INSERT_ID()')
            pkProveedor = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar teléfonos ---
            if numerosTelfono:
                consultaNumeros = 'INSERT INTO telefonos_proveedores (telefonoProveedor, fkProveedor) VALUES (%s, %s)'
                valoresNumeros = [(numero, pkProveedor) for numero in numerosTelfono]
                db.cursor.executemany(consultaNumeros, valoresNumeros)

            # --- Insertar paqueterías ---
            if paqueterias:
                consultaPaqueterias = 'INSERT INTO proveedores_paqueterias (fkPaqueteria, fkProveedor) VALUES (%s, %s)'
                valoresPaqueterias = [(paqueteria, pkProveedor) for paqueteria in paqueterias]
                db.cursor.executemany(consultaPaqueterias, valoresPaqueterias)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
            
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al insertar proveedor:", e)
            return False
        finally:
            db.close()

    def editar_proveedor(self):
        """Edita un registro en la base de datos."""
        if not self.pkProveedor:
            raise ValueError("El proveedor debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE proveedores SET nombreProveedor = %s, correoProveedor = %s, diasCredito = %s, facturaNota = %s, fkUbicacion = %s WHERE pkProveedor = %s"
        resultado = db.execute_commit(query, (self.nombreProveedor, self.correoProveedor, self.diasCredito, self.facturaNota, self.fkUbicacion, self.pkProveedor))
        db.close()
        return resultado

    def eliminar_proveedor(self):
        """Elimina un registro de la base de datos."""

        if not self.pkProveedor:
            raise ValueError("El proveedor debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM proveedores WHERE pkProveedor = %s"
        resultado = db.execute_commit(query, (self.pkProveedor,))
        db.close()
        return resultado

