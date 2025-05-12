from database import Database

class Empleado:
    def __init__(self, 
                numeroEmpleado=None, 
                rfc=None, 
                nombreEmpleado=None, 
                fechaIngreso=None, 
                fechaNacimiento=None, 
                nomina=None,
                vale=None,
                estado=None,
                fkPuesto=None,
                fkNivelEstudio=None,
                fkUbicacion=None):
        """Inicializa un objeto"""
        self.numeroEmpleado = numeroEmpleado
        self.rfc = rfc
        self.nombreEmpleado = nombreEmpleado
        self.fechaIngreso = fechaIngreso
        self.fechaNacimiento = fechaNacimiento
        self.nomina = nomina
        self.vale = vale
        self.estado = estado
        self.fkPuesto = fkPuesto
        fkNivelEstudio = fkNivelEstudio
        fkUbicacion = fkUbicacion


    @staticmethod
    def listar_empleados():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
            e.numeroEmpleado,
            e.rfc,
            e.nombreEmpleado,
            e.fechaIngreso,
            e.fechaNacimiento,
            e.nomina,
            e.vale,
            p.nombrePuesto,
            d.nombreDepartamento,
            GROUP_CONCAT(DISTINCT fp.descripcionFuncion SEPARATOR ', ') AS funciones,
            GROUP_CONCAT(DISTINCT c.nombreCurso SEPARATOR ', ') AS cursos,
            GROUP_CONCAT(DISTINCT ne.numeroEmergencia SEPARATOR ', ') AS numerosEmergencia,
            GROUP_CONCAT(DISTINCT o.oportunidad SEPARATOR ', ') AS oportunidades,
            GROUP_CONCAT(DISTINCT pe.descripcionPermiso SEPARATOR ', ') AS permisos,
            GROUP_CONCAT(DISTINCT pe.fechaPermiso SEPARATOR ', ') AS fechasPermiso,
            u.nombreUsuario,
            e.estado
        FROM empleados e
        JOIN puestos p ON p.pkPuesto = e.fkPuesto
        JOIN departamentos d ON d.pkDepartamento = p.fkDepartamento
        LEFT JOIN funciones_puesto fp ON fp.fkPuesto = p.pkPuesto
        LEFT JOIN empleados_cursos ec ON ec.fkEmpleado = e.numeroEmpleado
        LEFT JOIN cursos c ON c.pkCurso = ec.fkCurso
        LEFT JOIN empleados_oportunidades eo ON eo.fkEmpleado = e.numeroEmpleado
        LEFT JOIN oportunidades o ON o.pkOportunidad = eo.fkOportunidad
        LEFT JOIN numeros_emergencia ne ON ne.fkEmpleado = e.numeroEmpleado
        LEFT JOIN permisos pe ON pe.fkEmpleado = e.numeroEmpleado
        LEFT JOIN usuarios u ON u.fkEmpleado = e.numeroEmpleado
        GROUP BY e.numeroEmpleado

        '''
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def crear_empleado(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = '''
        INSERT INTO empleados 
        (numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''

        valores = (self.numeroEmpleado ,self.rfc, self.nombreEmpleado, self.fechaIngreso, self.fechaNacimiento, self.nomina, self.vale, self.estado, self.fkPuesto, self.fkNivelEstudio, self.ubicacion)

        print(consulta % valores)

        resultado = db.execute_commit(consulta, valores)

        db.close()
        return resultado

    def editar_empleado(self):
        """Edita un registro en la base de datos."""
        db = Database()
        consulta = "UPDATE empleados SET rfc = %s, nombreEmpleado = %s, fechaIngreso = %s, fechaNacimiento = %s, nomina = %s, vale = %s, estado = %s, fkPuesto = %s, fkNivelEstudio = %s, fkUbicacion = %s WHERE numeroEmpleado = %s"
        valores = (self.rfc, self.nombreEmpleado, self.fechaIngreso, self.fechaNacimiento, self.nomina, self.vale, self.estado, self.fkPuesto, self.numeroEmpleado, self.fkNivelEstudio, self.fkUbicacion)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def eliminar_empleado(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM empleados WHERE numeroEmpleado = %s"
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
