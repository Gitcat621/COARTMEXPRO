from models.socioComercial import SocioComercial

class SocioComercialController:
    @staticmethod
    def listar_sociosComerciales():
        """Devuelve todos los registros registrados"""
        return SocioComercial.listar_sociosComerciales()

    @staticmethod
    def crear_socioComercial(nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion):
        """Crea un nuevo registro y lo guarda en la base de datos"""
        socioComercial = SocioComercial(nombreSocio=nombreSocio, razonSocial=razonSocial, fkGrupoSocio=fkGrupoSocio, fkUbicacion=fkUbicacion)
        return socioComercial.crear_area()

    @staticmethod
    def editar_socioComercial(pkSocioComercial, nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion):
        """Edita un registro"""
        socioComercial = SocioComercial(pkSocioComercial=pkSocioComercial, nombreSocio=nombreSocio, razonSocial=razonSocial, fkGrupoSocio=fkGrupoSocio, fkUbicacion=fkUbicacion)
        return socioComercial.editar_area()

    @staticmethod
    def eliminar_socioComercial(pkSocioComercial):
        """Elimina un registro"""
        socioComercial = SocioComercial(pkSocioComercial=pkSocioComercial)
        return socioComercial.eliminar_area()