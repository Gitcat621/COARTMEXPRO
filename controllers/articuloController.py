from models.articulo import Articulo

class ArticuloController:
    @staticmethod
    def listar_articulos(year, month):
        """Devuelve todos los registros registrados"""
        if not year:
            year = 'CURDATE()'

        if not month:
            month = 'CURDATE()'

        return Articulo.listar_articulos(year,month)

    @staticmethod
    def crear_articulo(codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        articulo = Articulo(codigoArticulo=codigoArticulo, nombreArticulo=nombreArticulo, precioAlmacen=precioAlmacen, fkProveedor=fkProveedor, fkCategoriaArticulo=fkCategoriaArticulo)
        return articulo.crear_articulo()

    @staticmethod
    def editar_articulo(codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo):
        """Edita un registro"""
        articulo = Articulo(codigoArticulo=codigoArticulo, nombreArticulo=nombreArticulo, precioAlmacen=precioAlmacen, fkProveedor=fkProveedor, fkCategoriaArticulo=fkCategoriaArticulo)
        return articulo.editar_articulo()

    @staticmethod
    def eliminar_articulo(codigoArticulo):
        """Elimina un registro"""
        articulo = Articulo(codigoArticulo=codigoArticulo)
        return articulo.eliminar_articulo()