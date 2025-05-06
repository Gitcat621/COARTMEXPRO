from database import Database
import bcrypt

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
        db = Database()
        query = "SELECT u.nombreUsuario, u.contrasena, d.nombreDepartamento FROM usuarios u JOIN empleados e ON e.numeroEmpleado = u.fkEmpleado JOIN departamentos d ON d.pkDepartamento = e.fkDepartamento WHERE u.nombreUsuario = %s"
        valores = (self.nombreUsuario,)

        print(query % valores)

        resultado = db.execute_query(query, valores)
        db.close()

        if resultado:
            contrasena_hash = resultado[0]["contrasena"]
            if bcrypt.checkpw(self.contrasena.encode('utf-8'), contrasena_hash.encode('utf-8')):
                self.nombreDepartamento = resultado[0]["nombreDepartamento"]
                return True

        return False


    def crear_usuario(self):
        """Guarda un nuevo usuario en la base de datos"""
        db = Database()

        # 🔐 Hashear la contraseña antes de insertarla
        hashed_password = bcrypt.hashpw(self.contrasena.encode('utf-8'), bcrypt.gensalt())
        
        query = "INSERT INTO usuarios (nombreUsuario, contrasena, fkEmpleado) VALUES (%s, %s, %s)"
        valores = (self.nombreUsuario, hashed_password, self.fkEmpleado)

        print(query % valores)

        resultado = db.execute_commit(query, valores)
        db.close()
        return resultado

    def editar_usuario(self):
        """Edita un usuario en la base de datos."""
        db = Database()

        # 🔐 Hashear la contraseña antes de insertarla
        hashed_password = bcrypt.hashpw(self.contrasena.encode('utf-8'), bcrypt.gensalt())

        query = "UPDATE usuarios SET nombreUsuario = %s, contrasena = %s, fkEmpleado = %s WHERE pkUsuario = %s"
        valores = (self.nombreUsuario, hashed_password, self.fkEmpleado, self.pkUsuario)

        print(query % valores)

        resultado = db.execute_commit(query, valores)
        db.close()
        return resultado

    def eliminar_usuario(self):
        """Elimina un usuario de la base de datos."""
        db = Database()
    
        query = "DELETE FROM usuarios WHERE pkUsuario = %s"
        valores = (self.pkUsuario,)
        
        resultado = db.execute_commit(query, valores)

        print(query % valores)

        print(resultado)

        db.close()
        return resultado
