from database import Database

class InfoPaqueteria:
    def __init__(self, pkInfoPaqueteria=None, diasEntrega=None, flete=None):
        """Inicializa un objeto"""
        self.pkInfoPaqueteria = pkInfoPaqueteria
        self.diasEntrega = diasEntrega
        self.flete = flete


    @staticmethod
    def listar_infoPaqueterias():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT * FROM infos_paqueteria ip
        LEFT JOIN infos_paqueterias ips ON ips.fkInfoPaqueteria = ip.pkInfoPaqueteria
        LEFT JOIN paqueterias p ON p.pkPaqueteria = ips.fkPaqueteria
        '''
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_infoPaqueteria(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO infos_paqueteria (diasEntrega, flete) VALUES (%s, %s)"
        resultado = db.execute_commit(query, (self.diasEntrega, self.flete))
        db.close()
        return resultado

    def editar_infoPaqueteria(self):
        """Edita un registro en la base de datos."""
        if not self.pkInfoPaqueteria:
            raise ValueError("La InfoPaqueteria debe tener un ID para ser editado.")
        db = Database()
        print(self.pkInfoPaqueteria)
        query = "UPDATE infos_paqueteria SET diasEntrega = %s, flete = %s WHERE pkInfoPaqueteria = %s"
        resultado = db.execute_commit(query, (self.diasEntrega, self.flete,self.pkInfoPaqueteria))
        db.close()
        return resultado

    def eliminar_infoPaqueteria(self):
        """Elimina un registro de la base de datos."""

        if not self.pkInfoPaqueteria:
            raise ValueError("La InfoPaqueteria debe tener un ID para ser eliminado.")
        db = Database()
        query = "DELETE FROM infos_paqueteria WHERE pkInfoPaqueteria = %s"
        resultado = db.execute_commit(query, (self.pkInfoPaqueteria,))
        db.close()
        return resultado


