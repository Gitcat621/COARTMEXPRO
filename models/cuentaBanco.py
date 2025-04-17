from database import Database

class CuentaBanco:
    def __init__(self, pkCuentaBanco=None, numeroCuenta=None, nombreBeneficiario=None):
        """Inicializa un objeto"""
        self.pkCuentaBanco = pkCuentaBanco
        self.numeroCuenta = numeroCuenta
        self.nombreBeneficiario = nombreBeneficiario


    @staticmethod
    def listar_cuentas():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM cuentas_banco")
        db.close()
        return resultado
    
    def crear_cuenta(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO cuentas_banco (numeroCuenta, nombreBeneficiario) VALUES (%s,%s,%s)"
        resultado = db.execute_commit(query, (self.numeroCuenta, self.nombreBeneficiario))
        db.close()
        return resultado

    def editar_cuenta(self):
        """Edita un registro en la base de datos."""
        if not self.pkCuentaBanco:
            raise ValueError("La cuenta de banco debe tener un ID para ser editado.")
        db = Database()
        print(self.pkCuentaBanco)
        query = "UPDATE cuentas_banco SET numeroCuenta = %s , nombreBeneficiario = %s WHERE pkCuentaBanco = %s"
        resultado = db.execute_commit(query, (self.numeroCuenta, self.nombreBeneficiario, self.pkCuentaBanco))
        db.close()
        return resultado

    def eliminar_cuenta(self):
        """Elimina un registro de la base de datos."""

        if not self.pkCuentaBanco:
            raise ValueError("La cuenta de banco debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM cuentas_banco WHERE pkCuentaBanco = %s"
        resultado = db.execute_commit(query, (self.pkCuentaBanco,))
        db.close()
        return resultado

