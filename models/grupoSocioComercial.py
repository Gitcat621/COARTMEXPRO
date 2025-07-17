from database import Database

class GrupoSocioComercial:
    def __init__(self, pkGrupoSocio=None, nombreGrupoSocio=None):
        """Inicializa un objeto"""
        self.pkGrupoSocio = pkGrupoSocio
        self.nombreGrupoSocio = nombreGrupoSocio


    @staticmethod
    def listar_gruposSocio():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM grupos_socio")
        db.close()
        return resultado
    
    def crear_grupoSocio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO grupos_socio (nombreGrupoSocio) VALUES (%s)"
        resultado = db.execute_commit(query, (self.nombreGrupoSocio,))
        db.close()
        return resultado

    def editar_grupoSocio(self):
        """Edita un registro en la base de datos."""
        if not self.pkGrupoSocio:
            raise ValueError("El grupo del socio debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE grupos_socio SET nombreGrupoSocio = %s WHERE pkGrupoSocio = %s"
        resultado = db.execute_commit(query, (self.nombreGrupoSocio, self.pkGrupoSocio))
        db.close()
        return resultado

    def eliminar_grupoSocio(self):
        """Elimina un registro de la base de datos."""

        if not self.pkGrupoSocio:
            raise ValueError("El grupo del socio debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM grupos_socio WHERE pkGrupoSocio = %s"
        resultado = db.execute_commit(query, (self.pkGrupoSocio,))
        db.close()
        return resultado

