from database import Database

class Beneficio:
    def __init__(self, pkBeneficio=None, nombreBeneficio=None, fkServicioPac=None):
        """Inicializa un objeto"""
        self.pkBeneficio = pkBeneficio
        self.nombreBeneficio = nombreBeneficio
        self.fkServicioPac = fkServicioPac


    @staticmethod
    def listar_beneficios():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM beneficios"
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_beneficio(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO beneficios (nombreBeneficio,fkServicioPac) VALUES (%s,%s)"
        valores = (self.nombreBeneficio,self.fkServicioPac)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_beneficios(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE beneficios SET nombreBeneficio = %s, fkServicioPac = %s WHERE pkBeneficio = %s"
        valores = (self.nombreBeneficio, self.fkServicioPac, self.pkBeneficio)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_beneficios(self):
        """Elimina un registro de la base de datos."""

        db = Database()
        consulta = "DELETE FROM beneficios WHERE pkBeneficio = %s"
        valores = (self.pkBeneficio,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

