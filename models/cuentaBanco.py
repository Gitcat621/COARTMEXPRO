from database import Database

class CuentaBanco:
    def __init__(self, pkCuentaBanco=None, numeroCuenta=None, nombreBeneficiario=None, fkBanco=None, fkProveedor=None):
        """Inicializa un objeto"""
        self.pkCuentaBanco = pkCuentaBanco
        self.numeroCuenta = numeroCuenta
        self.nombreBeneficiario = nombreBeneficiario
        self.fkBanco = fkBanco
        self.fkProveedor = fkProveedor

    @staticmethod
    def listar_cuentas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT  
        cb.numeroCuenta,
        cb.nombreBeneficiario,
        b.nombreBanco,
        p.nombreProveedor,
        cb.fkBanco,
        cb.fkProveedor,
        cb.pkCuentaBanco
        FROM cuentas_banco cb 
        JOIN bancos b ON cb.fkBanco = b.pkBanco
        JOIN proveedores p ON p.pkProveedor = cb.fkProveedor
        '''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_cuenta(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO cuentas_banco (numeroCuenta, nombreBeneficiario, fkBanco, fkProveedor) VALUES (%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.numeroCuenta, self.nombreBeneficiario, self.fkBanco, self.fkProveedor))
        db.close()
        return resultado

    def editar_cuenta(self):
        """Edita un registro en la base de datos."""
        db = Database()
        query = "UPDATE cuentas_banco SET numeroCuenta = %s, nombreBeneficiario = %s, fkBanco = %s, fkProveedor = %s WHERE pkCuentaBanco = %s"
        resultado = db.execute_commit(query, (self.numeroCuenta, self.nombreBeneficiario, self.fkBanco, self.fkProveedor, self.pkCuentaBanco))
        db.close()
        return resultado

    def eliminar_cuenta(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM cuentas_banco WHERE pkCuentaBanco = %s"
        resultado = db.execute_commit(query, (self.pkCuentaBanco,))
        db.close()
        return resultado

