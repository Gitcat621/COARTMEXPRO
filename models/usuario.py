from database import Database
import bcrypt
import uuid

id_generado = str(uuid.uuid4())


class Usuario:
    def __init__(self, pkUsuario=None, nombreUsuario=None, contrasena=None, fkDepartamento=None):
        """Inicializa un usuario"""
        self.pkUsuario = pkUsuario
        self.nombreUsuario = nombreUsuario
        self.contrasena = contrasena
        self.fkDepartamento = fkDepartamento


    @staticmethod
    def listar_usuarios():
        """Obtiene todos los usuarios de la base de datos."""
        db = Database()

        consulta = '''
        SELECT 
        u.pkUsuario, 
        u.nombreUsuario, 
        u.contrasena, 
        d.nombreDepartamento,
        u.fkDepartamento
        FROM usuarios u
        LEFT JOIN departamentos d ON d.pkDepartamento = u.fkDepartamento;
        '''

        print (consulta) 

        usuarios = db.execute_query(consulta)
        db.close()
        return usuarios
    
    def iniciar_sesion(self):
        db = Database()

        consulta = '''
        SELECT u.nombreUsuario, u.contrasena, d.nombreDepartamento FROM usuarios u 
        JOIN departamentos d ON d.pkDepartamento = u.fkDepartamento WHERE u.nombreUsuario = %s
        '''
        valores = (self.nombreUsuario,)

        print(consulta % valores)


        resultado = db.execute_query(consulta, valores)

        print(resultado)

        db.close()

        if resultado:
            contrasena_hash = resultado[0]["contrasena"]

            if bcrypt.checkpw(self.contrasena.encode('utf-8'), contrasena_hash.encode('utf-8')):
                self.nombreDepartamento = resultado[0]["nombreDepartamento"]
                self.nombreUsuario = resultado[0]["nombreUsuario"]
                return True

        return False

    def crear_usuario(self):
        """Guarda un nuevo usuario en la base de datos"""
        db = Database()

        # 🔐 Hashear la contraseña antes de insertarla
        hashed_password = bcrypt.hashpw(self.contrasena.encode('utf-8'), bcrypt.gensalt())
        
        query = "INSERT INTO usuarios (nombreUsuario, contrasena, fkDepartamento) VALUES (%s, %s, %s)"
        valores = (self.nombreUsuario, hashed_password, self.fkDepartamento)

        print(query % valores)

        resultado = db.execute_commit(query, valores)
        db.close()
        return resultado

    def editar_usuario(self):
        """Edita un usuario en la base de datos."""
        db = Database()

        # 🔐 Hashear la contraseña antes de insertarla
        hashed_password = bcrypt.hashpw(self.contrasena.encode('utf-8'), bcrypt.gensalt())

        query = "UPDATE usuarios SET nombreUsuario = %s, contrasena = %s, fkDepartamento = %s WHERE pkUsuario = %s"
        valores = (self.nombreUsuario, hashed_password, self.fkDepartamento, self.pkUsuario)

        print(f"\n{query % valores}\n")


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
