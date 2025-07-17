from database import Database

class NivelEstudio:
    def __init__(self, pkNivelEstudio=None, nombreNivel=None):
        """Inicializa un objeto"""
        self.pkNivelEstudio = pkNivelEstudio
        self.nombreNivel = nombreNivel


    @staticmethod
    def listar_niveles_estudio():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM niveles_estudio"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_nivel_estudio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO niveles_estudio (nombreNivel) VALUES (%s)"
        valores = (self.nombreNivel,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_niveles_estudio(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE niveles_estudio SET nombreNivel = %s WHERE pkNivelEstudio = %s"
        valores = (self.nombreNivel, self.pkNivelEstudio)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_niveles_estudio(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM niveles_estudio WHERE pkNivelEstudio = %s"
        valores = (self.pkNivelEstudio,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

