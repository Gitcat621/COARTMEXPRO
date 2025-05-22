from database import Database

class FuncionPuesto:
    def __init__(self, pkFuncionPuesto=None, descripcionFuncion=None, fkPuesto=None):
        """Inicializa un objeto"""
        self.pkFuncionPuesto = pkFuncionPuesto
        self.descripcionFuncion = descripcionFuncion
        self.fkPuesto = fkPuesto


    @staticmethod
    def listar_funciones_puesto():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM funciones_puesto fp JOIN puestos p ON p.pkPuesto = fp.fkPuesto"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_funcion_puesto(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO funciones_puesto (descripcionFuncion, fkPuesto) VALUES (%s,%s)"
        valores = (self.descripcionFuncion, self.fkPuesto)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_funciones_puesto(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE funciones_puesto SET descripcionFuncion = %s, fkPuesto = %s WHERE pkFuncionPuesto = %s"
        valores = (self.descripcionFuncion, self.fkPuesto, self.pkFuncionPuesto)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_funciones_puesto(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM funciones_puesto WHERE pkFuncionPuesto = %s"
        valores =(self.pkFuncionPuesto,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

