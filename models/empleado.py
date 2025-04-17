from database import Database

class Empleado:
    def __init__(self, numeroEmpleado=None, rfc=None, nombreEmpleado=None, fechaIngreso=None, sueldo=None, permisosPedidos=None, fkDepartamento=None):
        """Inicializa un objeto"""
        self.numeroEmpleado = numeroEmpleado
        self.rfc = rfc
        self.nombreEmpleado = nombreEmpleado
        self.fechaIngreso = fechaIngreso
        self.sueldo = sueldo
        self.permisosPedidos = permisosPedidos
        self.fkDepartamento = fkDepartamento


    @staticmethod
    def listar_empleados():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT e.numeroEmpleado, e.rfc, e.nombreEmpleado, e.fechaIngreso, e.sueldo, e.permisosPedidos, d.nombreDepartamento, GROUP_CONCAT(c.nombreCurso SEPARATOR ', ') AS cursos, d.pkDepartamento, GROUP_CONCAT(c.pkCurso SEPARATOR ', '), e.numeroEmpleado
        FROM empleados e
        JOIN departamentos d ON d.pkDepartamento = e.fkDepartamento
        LEFT JOIN empleados_cursos ec ON ec.fkEmpleado = e.numeroEmpleado
        LEFT JOIN cursos c ON c.pkCurso = ec.fkCurso
        GROUP BY e.numeroEmpleado, e.rfc, e.nombreEmpleado, e.fechaIngreso, e.sueldo, e.permisosPedidos, d.nombreDepartamento
        '''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    

    def crear_empleado(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO empleados (numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento) VALUES (%s, %s,%s,%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.numeroEmpleado ,self.rfc, self.nombreEmpleado, self.fechaIngreso, self.sueldo, self.permisosPedidos, self.fkDepartamento))
        db.close()
        return resultado

    def editar_empleado(self):
        """Edita un registro en la base de datos."""
        if not self.numeroEmpleado:
            raise ValueError("El empleado debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE empleados SET rfc = %s, nombreEmpleado = %s, fechaIngreso = %s, sueldo = %s, permisosPedidos = %s, fkDepartamento = %s WHERE numeroEmpleado = %s"
        resultado = db.execute_commit(query, (self.rfc, self.nombreEmpleado, self.fechaIngreso, self.sueldo, self.permisosPedidos, self.fkDepartamento, self.numeroEmpleado))
        db.close()
        return resultado

    def eliminar_empleado(self):
        """Elimina un registro de la base de datos."""
        if not self.numeroEmpleado:
            raise ValueError("El empleado debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM empleados WHERE numeroEmpleado = %s"
        resultado = db.execute_commit(query, (self.numeroEmpleado,))
        db.close()
        return resultado
