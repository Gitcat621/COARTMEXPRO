from models.compraMercancia import CompraMercancia

class CompraMercanciaController:
    @staticmethod
    def listar_compras(fechaMercancia):
        """Devuelve todos los registros registrados"""

        compras = CompraMercancia(fechaMercancia=fechaMercancia)
        return compras.listar_compras()

    @staticmethod
    def crear_compra(montoMercancia, fechaMercancia, fkProveedor):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        compraMercancia = CompraMercancia(montoMercancia=montoMercancia, fechaMercancia=fechaMercancia, fkProveedor=fkProveedor)
        return compraMercancia.crear_compra()

    @staticmethod
    def editar_compra(pkCompraMercancia, montoMercancia, fechaMercancia, fkProveedor):
        """Edita un registro"""
        compraMercancia = CompraMercancia(pkCompraMercancia=pkCompraMercancia, montoMercancia=montoMercancia, fechaMercancia=fechaMercancia, fkProveedor=fkProveedor)
        return compraMercancia.editar_compra()

    @staticmethod
    def eliminar_compra(pkCompraMercancia):
        """Elimina un registro"""
        compraMercancia = CompraMercancia(pkCompraMercancia=pkCompraMercancia)
        return compraMercancia.eliminar_compra()