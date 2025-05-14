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
        self.fkNivelEstudio = fkNivelEstudio
        self.fkUbicacion = fkUbicacion


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
            ne.nombreNivel,
            CONCAT(m.nombreMunicipio, ' ',pc.nombrePuebloCiudad, ' ', es.nombreEstado, ' ',pa.nombrePais) AS ubicacion,
            e.estado
        FROM empleados e
        LEFT JOIN puestos p ON p.pkPuesto = e.fkPuesto
        LEFT JOIN departamentos d ON d.pkDepartamento = p.fkDepartamento
        LEFT JOIN niveles_estudio ne ON ne.pkNivelEstudio = e.fkNivelEstudio
        LEFT JOIN ubicaciones u ON u.pkUbicacion = e.fkUbicacion
        LEFT JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal 
        LEFT JOIN pueblos_ciudades pc ON pc.pkPuebloCiudad = u.fkPuebloCiudad 
        LEFT JOIN municipios m ON m.pkMunicipio = u.fkMunicipio 
        LEFT JOIN estados es ON es.pkEstado = u.fkEstado 
        LEFT JOIN paises pa ON pa.pkPais = u.fkPais
        GROUP BY e.numeroEmpleado;

        '''
        print(consulta)
        resultado = db.execute_query(consulta)
        db.close()
        return resultado
    
    def otener_empleado(self):
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
            ne.nombreNivel,
            CONCAT(m.nombreMunicipio, ' ',pc.nombrePuebloCiudad, ' ', es.nombreEstado, ' ',pa.nombrePais) AS ubicacion,
            e.estado,
            us.nombreUsuario,
            GROUP_CONCAT(DISTINCT fp.descripcionFuncion SEPARATOR ', ') AS funciones,
            CONCAT_WS('', 'talla ', ue.tallaUniforme, ', ', ue.pzasUniforme, ' pzas') AS uniforme,
            GROUP_CONCAT(DISTINCT nue.numeroEmergencia SEPARATOR '-') AS numeros
        FROM empleados e
        LEFT JOIN puestos p ON p.pkPuesto = e.fkPuesto
        LEFT JOIN departamentos d ON d.pkDepartamento = p.fkDepartamento
        LEFT JOIN niveles_estudio ne ON ne.pkNivelEstudio = e.fkNivelEstudio
        LEFT JOIN ubicaciones u ON u.pkUbicacion = e.fkUbicacion
        LEFT JOIN codigos_postales cp ON cp.pkCodigoPostal = u.fkCodigoPostal 
        LEFT JOIN pueblos_ciudades pc ON pc.pkPuebloCiudad = u.fkPuebloCiudad 
        LEFT JOIN municipios m ON m.pkMunicipio = u.fkMunicipio 
        LEFT JOIN estados es ON es.pkEstado = u.fkEstado 
        LEFT JOIN paises pa ON pa.pkPais = u.fkPais
        LEFT JOIN usuarios us ON us.fkEmpleado = e.numeroEmpleado
        LEFT JOIN funciones_puesto fp ON fp.fkPuesto = p.pkPuesto
        LEFT JOIN uniformes_empleados ue ON ue.fkEmpleado = e.numeroEmpleado
        LEFT JOIN numeros_emergencia nue ON nue.fkEmpleado = e.numeroEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
    
    def otener_cursos_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        c.nombreCurso,
        p.nombrePresentador,
        c.documentoObtenido,
        ac.fechaAsistencia
        FROM cursos c
        JOIN presentadores p ON p.pkPresentador = c.fkPresentador
        JOIN asistencias_cursos ac ON ac.fkCurso = c.pkCurso
        JOIN empleados e ON e.numeroEmpleado = ac.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
    
    def otener_permisos_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        p.descripcionPermiso,
        p.fechaPermiso
        FROM permisos p
        JOIN empleados e ON e.numeroEmpleado = p.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
    
    def otener_oportunidades_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        o.oportunidad
        FROM 
        oportunidades o
        JOIN empleados_oportunidades eo ON eo.fkOportunidad = o.pkOportunidad
        JOIN empleados e ON e.numeroEmpleado = eo.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
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

        valores = (self.numeroEmpleado, self.rfc, self.nombreEmpleado, self.fechaIngreso, self.fechaNacimiento, self.nomina, self.vale, self.estado, self.fkPuesto, self.fkNivelEstudio, self.fkUbicacion)

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
