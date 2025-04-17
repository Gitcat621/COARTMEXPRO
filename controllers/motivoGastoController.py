from models.motivoGasto import MotivoGasto

class MotivoGastoController:
    @staticmethod
    def listar_motivosGasto():
        """Devuelve todos los registros registrados"""
        return MotivoGasto.listar_motivosGasto()

    @staticmethod
    def crear_motivoGasto(nombreMotivoGasto, tipoGasto):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        motivoGasto = MotivoGasto(nombreMotivoGasto=nombreMotivoGasto, tipoGasto=tipoGasto)
        return motivoGasto.crear_listar_motivoGasto()

    @staticmethod
    def editar_motivoGasto(pkMotivoGasto, nombreMotivoGasto, tipoGasto):
        """Edita un registro"""
        motivoGasto = MotivoGasto(pkMotivoGasto=pkMotivoGasto, nombreMotivoGasto=nombreMotivoGasto, tipoGasto=tipoGasto)
        return motivoGasto.editar_motivoGasto()

    @staticmethod
    def eliminar_motivoGasto(pkMotivoGasto):
        """Elimina un registro"""
        motivoGasto = MotivoGasto(pkMotivoGasto=pkMotivoGasto)
        return motivoGasto.eliminar_motivoGasto()