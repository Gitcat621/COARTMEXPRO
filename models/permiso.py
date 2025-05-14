from database import Database

class Permiso:
    def __init__(self, pkPermiso=None, descripcionPermiso=None, fechaPermiso=None, fkEmpleado = None):
        """Inicializa un objeto"""
        self.pkPermiso = pkPermiso
        self.descripcionPermiso = descripcionPermiso
        self.fechaPermiso = fechaPermiso
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_permisos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM permisos p JOIN empleados e ON e.numeroEmpleado = p.fkEmpleado"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()
        return resultado
    
    def crear_permiso(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO permisos (descripcionPermiso, fechaPermiso, fkEmpleado) VALUES (%s,%s,%s)"
        valores = (self.descripcionPermiso, self.fechaPermiso, self.fkEmpleado)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def editar_permisos(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE permisos SET descripcionPermiso = %s, fechaPermiso = %s WHERE pkPermiso = %s"
        valores = (self.descripcionPermiso, self.fechaPermiso, self.pkPermiso)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def eliminar_permisos(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM permisos WHERE pkPermiso = %s"
        valores = (self.pkPermiso,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

