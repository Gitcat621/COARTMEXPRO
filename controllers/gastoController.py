from models.gasto import Gasto

class GastoController:
    @staticmethod
    def listar_gastos(fk,fechaGasto):
        """Devuelve todos los registros registrados"""
        if fk is 0:
            filtro = ""
        else:
            filtro = f"WHERE mg.tipoGasto = {fk}"

        gastos = Gasto(filtro=filtro,fechaGasto=fechaGasto)
        return gastos.listar_gastos()

    @staticmethod
    def crear_gasto(montoGasto, fechaGasto, fkMotivoGasto):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        gasto = Gasto(montoGasto=montoGasto, fechaGasto=fechaGasto, fkMotivoGasto=fkMotivoGasto)
        return gasto.crear_gasto()

    @staticmethod
    def editar_gasto(pkGasto, montoGasto, fechaGasto, fkMotivoGasto):
        """Edita un registro"""
        gasto = Gasto(pkGasto=pkGasto, montoGasto=montoGasto, fechaGasto=fechaGasto, fkMotivoGasto=fkMotivoGasto)
        return gasto.editar_gasto()

    @staticmethod
    def eliminar_gasto(pkGasto):
        """Elimina un registro"""
        gasto = Gasto(pkGasto=pkGasto)
        return gasto.eliminar_gasto()