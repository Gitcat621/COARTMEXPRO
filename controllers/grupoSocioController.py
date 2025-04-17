from models.grupoSocioComercial import GrupoSocioComercial

class GrupoSocioComercialController:
    @staticmethod
    def listar_gruposSocio():
        """Devuelve todos los registros registrados"""
        return GrupoSocioComercial.listar_gruposSocio()

    @staticmethod
    def crear_grupoSocio(nombreGrupoSocio):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        grupoSocio = GrupoSocioComercial(nombreGrupoSocio=nombreGrupoSocio)
        return grupoSocio.crear_grupoSocio()

    @staticmethod
    def editar_grupoSocio(pkGrupoSocio, nombreGrupoSocio):
        """Edita un registro"""
        grupoSocio = GrupoSocioComercial(pkGrupoSocio=pkGrupoSocio, nombreGrupoSocio=nombreGrupoSocio)
        return grupoSocio.editar_grupoSocio()

    @staticmethod
    def eliminar_grupoSocio(pkGrupoSocio):
        """Elimina un registro"""
        grupoSocio = GrupoSocioComercial(pkGrupoSocio=pkGrupoSocio)
        return grupoSocio.eliminar_grupoSocio()