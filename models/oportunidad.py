from database import Database

class Oportunidad:
    def __init__(self, pkOportunidad=None, oportunidad=None):
        """Inicializa un objeto"""
        self.pkOportunidad = pkOportunidad
        self.oportunidad = oportunidad


    @staticmethod
    def listar_oportunidades():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM oportunidades"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()
        return resultado
    
    def crear_oportunidad(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO oportunidades (oportunidad) VALUES (%s)"
        valores = (self.oportunidad,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def crear_oportunidad_empleado(fkEmpleado, fkOportunidad):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            INSERT INTO empleados_oportunidades (fkEmpleado, fkOportunidad) 
            VALUES (%s, %s)
        """
        valores = (fkEmpleado, fkOportunidad)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_oportunidad(self):
        """Edita un registro en la base de datos."""

        db = Database()
        print(self.pkOportunidad)
        consulta = "UPDATE oportunidades SET oportunidad = %s WHERE pkOportunidad = %s"
        valores = (self.oportunidad, self.pkOportunidad)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def eliminar_oportunidad(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM oportunidades WHERE pkOportunidad = %s"
        valores = (self.pkOportunidad,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores) 
        db.close()
        return resultado

