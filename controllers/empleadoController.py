from models.empleado import Empleado

class EmpleadoController:
    @staticmethod
    def listar_empleados():
        """Devuelve todos los registros registrados"""
        return Empleado.listar_empleados()
    
    @staticmethod
    def crear_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento):
        """Crea un nuevo usuario y lo guarda en la base de datos"""
        # Creamos una instancia de la clase
        empleado = Empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento)
        
        # Guardamos el usuario en la base de datos
        # resultado = area.guardar_area()
        
        # Retornamos si fue exitoso o no
        return empleado.crear_empleado()
    
    @staticmethod
    def editar_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento):
        """Edita un nuevo usuario"""
        empleado = Empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento)
        return empleado.editar_empleado()
    
    @staticmethod
    def eliminar_empleado(numeroEmpleado):
        """Elimina un nuevo usuario"""
        empleado = Empleado(numeroEmpleado=numeroEmpleado)
        return empleado.eliminar_empleado()
