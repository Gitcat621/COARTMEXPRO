from database import Database

class Puesto:
    def __init__(self, pkPuesto=None, nombrePuesto=None, fkDepartamento=None):
        """Inicializa un objeto"""
        self.pkPuesto = pkPuesto
        self.nombrePuesto = nombrePuesto
        self.fkDepartamento = fkDepartamento


    @staticmethod
    def listar_puestos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM puestos"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_puesto(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO puestos (nombrePuesto, fkDepartamento) VALUES (%s)"
        valores = (self.nombrePuesto, self.fkDepartamento)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_puestos(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE puestos SET nombrePuesto = %s, fkDepartamento = %s WHERE pkPuesto = %s"
        valores = (self.nombrePuesto, self.fkDepartamento, self.pkPuesto)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_puestos(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM puestos WHERE pkPuesto = %s"
        valores = (self.pkPuesto,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

