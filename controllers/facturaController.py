from models.factura import Factura

class FacturaController:
    @staticmethod
    def listar_facturas():
        """Devuelve todos los registros registrados"""
        return Factura.listar_facturas()

    @staticmethod
    def crear_factura(fechaFactura, numeroAño, montoFactura, fechaVencimiento, diasVencidos, fechaPagado, fkVenta):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        factura = Factura(fechaFactura=fechaFactura, numeroAño=numeroAño, montoFactura=montoFactura, fechaVencimiento=fechaVencimiento, diasVencidos=diasVencidos, fechaPagado=fechaPagado, fkVenta=fkVenta)
        return factura.crear_factura()

    @staticmethod
    def editar_factura(pkFactura, fechaFactura, numeroAño, montoFactura, fechaVencimiento, diasVencidos, fechaPagado, fkVenta):
        """Edita un registro"""
        factura = Factura(pkFactura=pkFactura, fechaFactura=fechaFactura, numeroAño=numeroAño, montoFactura=montoFactura, fechaVencimiento=fechaVencimiento, diasVencidos=diasVencidos, fechaPagado=fechaPagado, fkVenta=fkVenta)
        return factura.editar_factura()

    @staticmethod
    def eliminar_factura(pkFactura):
        """Elimina un registro"""
        factura = Factura(pkFactura=pkFactura)
        return factura.eliminar_factura()