from models.ordenCompra import OrdenCompra

class OrdenCompraController:
    @staticmethod
    def listar_ordenesCompra():
        """Devuelve todos los registros registrados"""
        return OrdenCompra.listar_ordenesCompra()

    @staticmethod
    def crear_ordenCompra(fechaOrdenCompra, fkSocioComercial):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        ordenCompra = OrdenCompra(fechaOrdenCompra=fechaOrdenCompra, fkSocioComercial=fkSocioComercial)
        return ordenCompra.crear_ordenCompra()

    @staticmethod
    def editar_ordenCompra(pkOrdenCompra, fechaOrdenCompra, fkSocioComercial):
        """Edita un registro"""
        ordenCompra = OrdenCompra(pkOrdenCompra=pkOrdenCompra, fechaOrdenCompra=fechaOrdenCompra, fkSocioComercial=fkSocioComercial)
        return ordenCompra.editar_ordenCompra()

    @staticmethod
    def eliminar_ordenCompra(pkOrdenCompra):
        """Elimina un registro"""
        ordenCompra = OrdenCompra(pkOrdenCompra=pkOrdenCompra)
        return ordenCompra.eliminar_ordenCompra()