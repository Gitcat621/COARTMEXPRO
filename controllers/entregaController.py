from models.entrega import Entrega

class EntregaController:
    @staticmethod
    def listar_entregas():
        """Devuelve todos los registros registrados"""
        return Entrega.listar_entregas()

    @staticmethod
    def crear_entrega(fechaEntrega, fkSeguimientoAlmacen):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        entrega = Entrega(fechaEntrega=fechaEntrega, fkSeguimientoAlmacen=fkSeguimientoAlmacen)
        return entrega.crear_entrega()

    @staticmethod
    def editar_entrega(pkEntrega, fechaEntrega, fkSeguimientoAlmacen):
        """Edita un registro"""
        entrega = Entrega(pkEntrega=pkEntrega, fechaEntrega=fechaEntrega, fkSeguimientoAlmacen=fkSeguimientoAlmacen)
        return entrega.editar_entrega()

    @staticmethod
    def eliminar_entrega(pkEntrega):
        """Elimina un registro"""
        entrega = Entrega(pkEntrega=pkEntrega)
        return entrega.eliminar_entrega()