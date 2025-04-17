from models.seguimientoAlmacen import SeguimientoAlmacen

class SeguimientoAlmacenController:
    @staticmethod
    def listar_seguimientosAlmacen():
        """Devuelve todos los registros registrados"""
        return SeguimientoAlmacen.listar_seguimientosAlmacen()

    @staticmethod
    def crear_seguimientoAlmacen(fechaSurtido, fechaEmpaque):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        seguimientoAlmacen = SeguimientoAlmacen(fechaSurtido=fechaSurtido, fechaEmpaque=fechaEmpaque)
        return seguimientoAlmacen.crear_seguimientoAlmacen()

    @staticmethod
    def editar_seguimientoAlmacen(pkSeguimientoAlmacen, fechaSurtido, fechaEmpaque):
        """Edita un registro"""
        seguimientoAlmacen = SeguimientoAlmacen(pkSeguimientoAlmacen=pkSeguimientoAlmacen, fechaSurtido=fechaSurtido, fechaEmpaque=fechaEmpaque)
        return seguimientoAlmacen.editar_seguimientoAlmacen()

    @staticmethod
    def eliminar_seguimientoAlmacen(pkSeguimientoAlmacen):
        """Elimina un registro"""
        seguimientoAlmacen = SeguimientoAlmacen(pkSeguimientoAlmacen=pkSeguimientoAlmacen)
        return seguimientoAlmacen.eliminar_seguimientoAlmacen()