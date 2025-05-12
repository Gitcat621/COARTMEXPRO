from database import Database

class Asistencia:
    def __init__(self, 
        pkAsistencia=None, 
        fechaAsistencia=None,
        entrada=None,
        comida=None,
        finComida=None,
        salida=None,
        fkEmpleado=None
        ):
        """Inicializa un objeto"""
        self.pkAsistencia = pkAsistencia
        self.fechaAsistencia = fechaAsistencia
        self.entrada = entrada
        self.comida = comida
        self.finComida = finComida
        self.salida = salida
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_asistencias():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM asistencias"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()
        return resultado
    
    def crear_asistencia(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO asistencias (fechaAsistencia, entrada, comida, finComida, salida, fkEmpleado) VALUES (%s,%s,%s,%s,%s,%s)"
        valores = (self.fechaAsistencia,self.entrada, self.comida, self.finComida, self.salida, self.fkEmpleado)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def editar_asistencia(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkAsistencia)
        consulta = "UPDATE asistencias SET fechaAsistencia = %s, entrada = %s, comida = %s, finComida = %s, salida = %s WHERE pkAsistencia = %s"
        valores = (self.fechaAsistencia, self.entrada, self.comida, self.finComida, self.salida, self.pkAsistencia,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def eliminar_asistencia(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM asistencias WHERE pkAsistencia = %s"
        valores = (self.pkAsistencia,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado


        # SELECT * FROM tu_tabla
        # WHERE DAY(fecha) >= 16
        # AND MONTH(fecha) = 5
        # AND YEAR(fecha) = 2025;