from database import Database

class CategoriaArticulo:
    def __init__(self, pkCategoriaArticulo=None, nombreCategoriaArticulo=None):
        """Inicializa un objeto"""
        self.pkCategoriaArticulo = pkCategoriaArticulo
        self.nombreCategoriaArticulo = nombreCategoriaArticulo


    @staticmethod
    def listar_categoriaArticulos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM categoria_articulos")
        db.close()
        return resultado
    
    def crear_categoriaArticulo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO categoria_articulos (nombreCategoriaArticulo) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreCategoriaArticulo,))
        db.close()
        return resultado

    def editar_categoriaArticulo(self):
        """Edita un registro en la base de datos."""
        if not self.pkCategoriaArticulo:
            raise ValueError("La categoria del articulo debe tener un ID para ser editada.")
        db = Database()
        query = "UPDATE categoria_articulos SET nombreCategoriaArticulo = %s WHERE pkCategoriaArticulo = %s"
        resultado = db.execute_commit(query, (self.nombreCategoriaArticulo, self.pkCategoriaArticulo))
        db.close()
        return resultado

    def eliminar_categoriaArticulo(self):
        """Elimina un registro de la base de datos."""

        if not self.pkCategoriaArticulo:
            raise ValueError("La categoria del articulo debe tener un ID para ser eliminada.")
        db = Database()
        query = "DELETE FROM categoria_articulos WHERE pkCategoriaArticulo = %s"
        resultado = db.execute_commit(query, (self.pkCategoriaArticulo,))
        db.close()
        return resultado

