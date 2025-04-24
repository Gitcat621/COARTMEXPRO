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
            GROUP_CONCAT(DISTINCT t.numeroTelefono SEPARATOR ', ') AS telefonos, 
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
            p.pkProveedor
        FROM proveedores p
        LEFT JOIN proveedores_telefonos pt ON pt.fkProveedor = p.pkProveedor
        LEFT JOIN telefonos t ON t.pkTelefono = pt.fkTelefono
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
        GROUP BY p.pkProveedor
        '''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_proveedor(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO proveedores (nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion) VALUES (%s, %s, %s, %s, %s)"
        resultado = db.execute_commit(query, (self.nombreProveedor, self.correoProveedor, self.diasCredito, self.facturaNota, self.fkUbicacion))
        db.close()
        return resultado

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

