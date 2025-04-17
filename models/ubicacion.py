from database import Database
import os
from datetime import datetime

class Ubicacion:
    def __init__(self, pkUbicacion=None, fkPuebloCiudad=None, fkCodigoPostal=None, fkMunicipio=None , fkEstado=None, fkPais=None):
        """Inicializa un objeto"""
        self.pkUbicacion = pkUbicacion
        self.fkPuebloCiudad = fkPuebloCiudad
        self.fkCodigoPostal = fkCodigoPostal
        self.fkMunicipio = fkMunicipio
        self.fkEstado = fkEstado
        self.fkPais = fkPais

    @staticmethod
    def listar_ubicaciones():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = """
            SELECT cp.codigoPostal, pc.nombrePuebloCiudad, m.nombreMunicipio, e.nombreEstado, p.nombrePais,
            u.pkUbicacion, cp.pkCodigoPostal, pc.pkPuebloCiudad, m.pkMunicipio, e.pkEstado, p.pkPais 
            FROM ubicaciones u 
            JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal 
            JOIN pueblos_ciudades pc ON pc.pkPuebloCiudad = u.fkPuebloCiudad 
            JOIN municipios m ON m.pkMunicipio = u.fkMunicipio 
            JOIN estados e ON e.pkEstado = u.fkEstado 
            JOIN paises p ON p.pkPais = u.fkPais
        """
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    @staticmethod
    def log_query(query, valores, error=None):
        """Guarda la consulta en un archivo de log"""
        log_file = "consultas.log"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Formatear la consulta con los valores reales
        query_str = query % valores
        
        with open(log_file, "a", encoding="utf-8") as file:
            file.write(f"{query_str}\n")
            if error:
                file.write(f"   ERROR: {error}\n")
            file.write("\n")  # Línea en blanco para separar consultas

    def crear_ubicacion(self):
        """Guarda un nuevo registro en la base de datos y lo registra en un archivo de log"""
        db = Database()
        query = "INSERT INTO ubicaciones (fkPuebloCiudad, fkCodigoPostal, fkMunicipio, fkEstado, fkPais) VALUES (%s, %s, %s, %s, %s)"
        valores = (self.fkPuebloCiudad, self.fkCodigoPostal, self.fkMunicipio, self.fkEstado, self.fkPais)

        try:
            resultado = db.execute_commit(query, valores)
            
            # Si la consulta fue exitosa, la registramos en un archivo de texto
            Ubicacion.log_query(query, valores)

            return resultado
        except Exception as e:
            Ubicacion.log_query(query, valores, error=str(e))
            return None
        finally:
            db.close()


    def editar_ubicacion(self):
        """Edita un registro en la base de datos."""
        if not self.pkUbicacion:
            raise ValueError("La ubicacion debe tener un ID para ser editada.")
        db = Database()
        query = "UPDATE ubicaciones SET fkPuebloCiudad = %s, fkCodigoPostal = %s, fkMunicipio = %s, fkEstado =%s, fkPais = %s WHERE pkUbicacion = %s"
        resultado = db.execute_commit(query, (self.fkPuebloCiudad, self.fkCodigoPostal, self.fkMunicipio, self.fkEstado, self.fkPais, self.pkUbicacion))
        db.close()
        return resultado

    def eliminar_ubicacion(self):
        """Elimina un registro de la base de datos."""
        if not self.pkUbicacion:
            raise ValueError("La ubicacion debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM ubicaciones WHERE pkUbicacion = %s"
        resultado = db.execute_commit(query, (self.pkUbicacion,))
        db.close()
        return resultado
