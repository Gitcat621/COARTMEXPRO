from models.banco import Banco

class BancoController:
    @staticmethod
    def listar_bancos():
        """Devuelve todos los registros registrados"""
        return Banco.listar_bancos()

    @staticmethod
    def crear_banco(nombreBanco):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        banco = Banco(nombreBanco=nombreBanco)
        return banco.crear_banco()

    @staticmethod
    def editar_banco(pkBanco, nombreBanco):
        """Edita un registro"""
        banco = Banco(pkBanco=pkBanco, nombreBanco=nombreBanco)
        return banco.editar_banco()

    @staticmethod
    def eliminar_banco(pkBanco):
        """Elimina un registro"""
        banco = Banco(pkBanco=pkBanco)
        return banco.eliminar_banco()