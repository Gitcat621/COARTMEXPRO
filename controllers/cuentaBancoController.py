from models.cuentaBanco import CuentaBanco

class CuentaBancoController:
    @staticmethod
    def listar_cuentas():
        """Devuelve todos los registros registrados"""
        return CuentaBanco.listar_cuentas()

    @staticmethod
    def crear_cuenta(numeroCuenta, nombreBeneficiario):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        cuentaBanco = CuentaBanco(numeroCuenta=numeroCuenta, nombreBeneficiario=nombreBeneficiario)
        return cuentaBanco.crear_cuenta()

    @staticmethod
    def editar_cuenta(pkCuentaBanco, numeroCuenta, nombreBeneficiario):
        """Edita un registro"""
        cuentaBanco = CuentaBanco(pkCuentaBanco=pkCuentaBanco, numeroCuenta=numeroCuenta, nombreBeneficiario=nombreBeneficiario)
        return cuentaBanco.editar_cuenta()

    @staticmethod
    def eliminar_cuenta(pkCuentaBanco):
        """Elimina un registro"""
        cuentaBanco = CuentaBanco(pkCuentaBanco=pkCuentaBanco)
        return cuentaBanco.eliminar_cuenta()