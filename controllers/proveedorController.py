from models.proveedor import Proveedor

class ProveedorController:
    @staticmethod
    def listar_proveedores():
        """Devuelve todos los registros registrados"""
        return Proveedor.listar_proveedores()

    @staticmethod
    def crear_proveedor(nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion, fkInfoPaqueteria):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        proveedor = Proveedor(nombreProveedor=nombreProveedor, correoProveedor=correoProveedor, diasCredito=diasCredito, facturaNota=facturaNota, fkUbicacion=fkUbicacion, fkInfoPaqueteria=fkInfoPaqueteria)
        return proveedor.crear_proveedor()

    @staticmethod
    def editar_proveedor(pkProveedor, nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion, fkInfoPaqueteria):
        """Edita un registro"""
        proveedor = Proveedor(pkProveedor=pkProveedor, nombreProveedor=nombreProveedor, correoProveedor=correoProveedor, diasCredito=diasCredito, facturaNota=facturaNota, fkUbicacion=fkUbicacion, fkInfoPaqueteria=fkInfoPaqueteria)
        return proveedor.editar_proveedor()

    @staticmethod
    def eliminar_proveedor(pkProveedor):
        """Elimina un registro"""
        proveedor = Proveedor(pkProveedor=pkProveedor)
        return proveedor.eliminar_proveedor()