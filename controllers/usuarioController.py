from models.usuario import Usuario

class UsuarioController:
    @staticmethod
    def listar_usuarios():
        """Devuelve todos los usuarios registrados"""
        return Usuario.listar_usuarios()
    
    @staticmethod
    def iniciar_sesion(nombreUsuario, contrasena):
        """Devuelve todos los usuarios registrados"""
        usuario = Usuario(nombreUsuario=nombreUsuario, contrasena=contrasena)
        return usuario.iniciar_sesion()

    @staticmethod
    def crear_usuario(nombreUsuario, contrasena, fkEmpleado):
        """Crea un nuevo usuario y lo guarda en la base de datos"""
        # Creamos una instancia de la clase Usuario
        usuario = Usuario(nombreUsuario=nombreUsuario, contrasena=contrasena,fkEmpleado=fkEmpleado)
        
        # Guardamos el usuario en la base de datos
        resultado = usuario.crear_usuario()
        
        # Retornamos si fue exitoso o no
        return resultado
    
    @staticmethod
    def editar_usuario(pkUsuario, nombreUsuario, contrasena,fkEmpleado):
        """Edita un nuevo usuario"""
        usuario = Usuario(pkUsuario, nombreUsuario, contrasena,fkEmpleado)
        return usuario.editar_usuario()
    
    @staticmethod
    def eliminar_usuario(pkUsuario):
        """Elimina un nuevo usuario"""
        usuario = Usuario(pkUsuario)
        return usuario.eliminar_usuario()
