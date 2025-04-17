from database import Database

class Usuario:
    def __init__(self, pkUsuario=None, nombreUsuario=None, contrasena=None, fkEmpleado=None):
        """Inicializa un usuario"""
        self.pkUsuario = pkUsuario
        self.nombreUsuario = nombreUsuario
        self.contrasena = contrasena
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_usuarios():
        """Obtiene todos los usuarios de la base de datos."""
        db = Database()
        consulta = '''
            SELECT u.pkUsuario, u.nombreUsuario, u.contrasena, e.nombreEmpleado, d.nombreDepartamento ,u.fkEmpleado, e.numeroEmpleado FROM usuarios u 
            JOIN empleados e ON e.numeroEmpleado = u.fkEmpleado
            JOIN departamentos d ON d.pkDepartamento = e.fkDepartamento
        '''

        print (consulta) 

        usuarios = db.execute_query(consulta)
        db.close()
        return usuarios
    
    def iniciar_sesion(self):
        """Obtiene el usuario que coincida en la base de datos."""
        db = Database()
        # Pasar los valores como una tupla
        usuarios = db.execute_query("SELECT u.nombreUsuario, d.nombreDepartamento FROM usuarios u JOIN empleados e ON e.numeroEmpleado = u.fkEmpleado JOIN departamentos d ON d.pkDepartamento = e.fkDepartamento WHERE u.nombreUsuario = %s AND u.contrasena = %s", (self.nombreUsuario, self.contrasena))
        db.close()
        return usuarios

    def crear_usuario(self):
        """Guarda un nuevo usuario en la base de datos"""
        db = Database()
        query = "INSERT INTO usuarios (nombreUsuario, contrasena, fkEmpleado) VALUES (%s, %s, %s)"
        resultado = db.execute_commit(query, (self.nombreUsuario, self.contrasena, self.fkEmpleado))
        db.close()
        return resultado

    def editar_usuario(self):
        """Edita un usuario en la base de datos."""
        if not self.pkUsuario:
            raise ValueError("El usuario debe tener un ID para ser editado.")
        db = Database()
        query = "UPDATE usuarios SET nombreUsuario = %s, contrasena = %s, fkEmpleado = %s WHERE pkUsuario = %s"
        resultado = db.execute_commit(query, (self.nombreUsuario, self.contrasena, self.fkEmpleado, self.pkUsuario))
        db.close()
        return resultado

    def eliminar_usuario(self):
        """Elimina un usuario de la base de datos."""
        if not self.pkUsuario:
            raise ValueError("El usuario debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM usuarios WHERE pkUsuario = %s"
        resultado = db.execute_commit(query, (self.pkUsuario,))
        db.close()
        return resultado
