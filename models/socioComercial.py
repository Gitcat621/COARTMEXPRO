from database import Database

class SocioComercial:
    def __init__(self, pkSocioComercial=None, nombreSocio=None, razonSocial=None, fkGrupoSocio=None, fkUbicacion=None):
        """Inicializa un objeto"""
        self.pkSocioComercial = pkSocioComercial
        self.nombreSocio = nombreSocio
        self.razonSocial = razonSocial
        self.fkGrupoSocio = fkGrupoSocio
        self.fkUbicacion = fkUbicacion


    @staticmethod
    def listar_sociosComerciales():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = """ 
        SELECT sc.nombreSocio, sc.razonSocial, gs.nombreGrupoSocio, cp.codigoPostal, pc.nombrePuebloCiudad, m.nombreMunicipio, e.nombreEstado, p.nombrePais, sc.fkGrupoSocio, sc.fkUbicacion, cp.pkCodigoPostal, pc.pkPuebloCiudad, m.pkMunicipio, e.pkEstado, p.pkPais ,sc.pkSocioComercial FROM socios_comerciales sc 
        JOIN grupos_socio gs ON gs.pkGrupoSocio = sc.fkGrupoSocio 
        JOIN ubicaciones u ON u.pkUbicacion = sc.fkUbicacion
        JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal
        JOIN pueblos_ciudades pc ON pc.pkPuebloCiudad = u.fkPuebloCiudad
        JOIN municipios m ON m.pkMunicipio = u.fkMunicipio
        JOIN estados e ON e.pkEstado = u.fkEstado
        JOIN paises p ON p.pkPais = u.fkPais
        """
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_area(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO socios_comerciales (nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion) VALUES (%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.nombreSocio,self.razonSocial,self.fkGrupoSocio, self.fkUbicacion))
        db.close()
        return resultado

    def editar_area(self):
        """Edita un registro en la base de datos."""
        if not self.pkSocioComercial:
            raise ValueError("El socio debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE socios_comerciales SET nombreSocio = %s, razonSocial = %s, fkGrupoSocio = %s, fkUbicacion = %s WHERE pkSocioComercial = %s"
        resultado = db.execute_commit(query, (self.nombreSocio, self.razonSocial, self.fkGrupoSocio, self.fkUbicacion, self.pkSocioComercial))
        db.close()
        return resultado

    def eliminar_area(self):
        """Elimina un registro de la base de datos."""

        if not self.pkSocioComercial:
            raise ValueError("El area debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM socios_comerciales WHERE pkSocioComercial = %s"
        resultado = db.execute_commit(query, (self.pkSocioComercial,))
        db.close()
        return resultado

