from models.categoriaArticulo import CategoriaArticulo

class CategoriaArticuloController:
    @staticmethod
    def listar_categoriaArticulos():
        """Devuelve todos los registros registrados"""
        return CategoriaArticulo.listar_categoriaArticulos()

    @staticmethod
    def crear_categoriaArticulo(nombreCategoriaArticulo):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        categoriaArticulo = CategoriaArticulo(nombreCategoriaArticulo=nombreCategoriaArticulo)
        return categoriaArticulo.crear_categoriaArticulo()

    @staticmethod
    def editar_categoriaArticulo(pkCategoriaArticulo, nombreCategoriaArticulo):
        """Edita un registro"""
        categoriaArticulo = CategoriaArticulo(pkCategoriaArticulo=pkCategoriaArticulo, nombreCategoriaArticulo=nombreCategoriaArticulo)
        return categoriaArticulo.editar_categoriaArticulo()

    @staticmethod
    def eliminar_categoriaArticulo(pkCategoriaArticulo):
        """Elimina un registro"""
        categoriaArticulo = CategoriaArticulo(pkCategoriaArticulo=pkCategoriaArticulo)
        return categoriaArticulo.eliminar_categoriaArticulo()