from database import Database
from datetime import timedelta

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
            CONCAT(pc.nombrePuebloCiudad, ', ', es.nombreEstado, ', ',pa.nombrePais) AS ubicacion,
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
            CONCAT(pc.nombrePuebloCiudad, ', ', es.nombreEstado, ', ',pa.nombrePais) AS ubicacion,
            e.estado,
            us.nombreUsuario,
            GROUP_CONCAT(DISTINCT fp.descripcionFuncion SEPARATOR ', ') AS funciones,
            CONCAT_WS('', 'talla ', ue.tallaUniforme, ', ', ue.pzasUniforme, ' pzas') AS uniforme,
            GROUP_CONCAT(DISTINCT nue.numeroEmergencia SEPARATOR '-') AS numeros,
            ue.tallaUniforme,
            ue.pzasUniforme,
            e.fkPuesto,
            e.fkNivelEstudio,
            e.fkUbicacion,
            ue.pkUniformeEmpleado,
            u.fkPuebloCiudad,
            u.fkEstado,
            u.fkPais,
            GROUP_CONCAT(DISTINCT nue.pkNumeroEmergencia SEPARATOR '-') AS pkNumeros
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

    def crear_empleado(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = '''
        INSERT INTO empleados 
        (numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''

        self.numeroEmpleado = Empleado.generar_numero_empleado(self.fechaIngreso, self.numeroEmpleado)
        if not self.numeroEmpleado:
            return False  # O lanzar una excepción indicando el error


        valores = (self.numeroEmpleado, self.rfc, self.nombreEmpleado, self.fechaIngreso, self.fechaNacimiento, self.nomina, self.vale, self.estado, self.fkPuesto, self.fkNivelEstudio, self.fkUbicacion)

        print(consulta % valores)

        resultado = db.execute_commit(consulta, valores)

        db.close()
        return resultado

    def generar_numero_empleado(fecha_ingreso, numeroEmpleado):
        """Genera un número de empleado con sufijo incremental"""
        try:
            db = Database()
            consulta = "SELECT COUNT(*) FROM empleados WHERE fechaIngreso = %s"
            resultado = db.execute_query(consulta, (fecha_ingreso,))
            db.close()

            # Verificar si el resultado existe y extraer correctamente el número de empleados
            nuevo_sufijo = (resultado[0]["COUNT(*)"] + 1) if resultado and resultado[0] else 1
            
            if not numeroEmpleado:
                print("Error: numeroEmpleado está vacío o no válido")
                return None
            
            numero_empleado = f"{numeroEmpleado}-{str(nuevo_sufijo).zfill(2)}"
            return numero_empleado

        except Exception as e:
            print(f"Error generando número de empleado: {e}")
            return None

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

#### OBTENER TABLAS RELACIONADAS #####
    
    def otener_cursos_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        ac.pkAsistenciaCurso,
        c.nombreCurso,
        p.nombrePresentador,
        c.documentoObtenido,
        c.duracionCurso,
        ac.fechaAsistencia,
        c.pkCurso
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
        # Convertir campos timedelta a string
        cursos_serializables = []
        for curso in resultado:
            curso_serializado = {}
            for clave, valor in curso.items():
                if isinstance(valor, timedelta):
                    curso_serializado[clave] = str(valor)
                else:
                    curso_serializado[clave] = valor
            cursos_serializables.append(curso_serializado)

        return cursos_serializables
        return resultado
    
    def otener_permisos_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        p.pkPermiso,
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
        eo.fkEmpleado,
        eo.fkOportunidad,
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
    
    def otener_prestamos_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        p.pkPrestamo,
        p.motivoPrestamo,
        p.montoPrestamo,
        p.formaPago,
        p.fechaPrestamo,
        p.montoApoyo,
        p.fechaTerminoPago
        FROM prestamos p
        JOIN empleados e ON e.numeroEmpleado = p.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
    
    def otener_serviciosPac_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT 
        sp.pkServicioPac,
        b.nombreBeneficio,
        sp.numeroSesion,
        sp.costoSesion,
        sp.fechaSesion,
        c.nombreClinica,
        sp.montoApoyo,
        sp.fkBeneficio,
        sp.fkClinica
        FROM servicio_pac sp
        JOIN beneficios b ON b.pkBeneficio = sp.fkBeneficio
        JOIN clinicas c ON c.pkClinica = sp.fkClinica
        JOIN empleados e ON e.numeroEmpleado = sp.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
    
    def otener_reunionesIntegracion_empleado(self):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = '''
        SELECT ri.pkReunionIntegracion, ri.fechaAsistencia FROM reuniones_integracion ri
        JOIN empleados e ON e.numeroEmpleado = ri.fkEmpleado
        WHERE e.numeroEmpleado = %s
        '''
        valores = (self.numeroEmpleado,)
        print(consulta % valores)
        resultado = db.execute_query(consulta, valores)
        db.close()
        return resultado
        
    
#### CREAR TABLAS RELACIONADAS #####

    def crear_asistencia_curso(fkEmpleado, fkCurso, fechaAsistencia):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            INSERT INTO asistencias_cursos (fkEmpleado, fkCurso, fechaAsistencia) 
            VALUES (%s, %s, %s)
        """
        valores = (fkEmpleado, fkCurso, fechaAsistencia)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def crear_oportunidad_empleado(fkEmpleado, fkOportunidad):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            INSERT INTO empleados_oportunidades (fkEmpleado, fkOportunidad) 
            VALUES (%s, %s)
        """
        valores = (fkEmpleado, fkOportunidad)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def crear_reunionIntegracion_empleado(fechaAsistencia, fkOportunidad):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            INSERT INTO reuniones_integracion (fechaAsistencia, fkEmpleado) 
            VALUES (%s, %s)
        """
        valores = (fechaAsistencia, fkOportunidad)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

#### EDITAR TABLAS RELACIONADAS #####

    def editar_asistencia_curso(fkEmpleado, fkCurso, fechaAsistencia, pkAsistenciaCurso):
        """Guarda un nuevo registro en la base de datos de manera segura"""
        db = Database()
        
        consulta = """
            UPDATE asistencias_cursos SET fkEmpleado = %s, fkCurso = %s, fechaAsistencia = %s WHERE pkAsistenciaCurso = %s
        """
        valores = (fkEmpleado, fkCurso, fechaAsistencia, pkAsistenciaCurso)

        print("Consulta:", consulta)
        print("Valores:", valores)
        
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    def editar_oportunidad_empleado(fkEmpleado, fkOportunidadAnterior, fkOportunidadNueva):
        """Actualiza la oportunidad asociada a un empleado de manera segura"""
        db = Database()
        
        consulta = """
            UPDATE empleados_oportunidades 
            SET fkOportunidad = %s 
            WHERE fkEmpleado = %s AND fkOportunidad = %s
        """
        valores = (fkOportunidadNueva, fkEmpleado, fkOportunidadAnterior)

        print("Consulta:", consulta)
        print("Valores:", valores)

        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def editar_reunionIntegracion_empleado(fechaAsistencia, pkReunionIntegracion):
        """Actualiza la oportunidad asociada a un empleado de manera segura"""
        db = Database()
        
        consulta = """
            UPDATE reuniones_integracion 
            SET fechaAsistencia = %s 
            WHERE pkReunionIntegracion = %s
        """
        valores = (fechaAsistencia, pkReunionIntegracion)

        print("Consulta:", consulta)
        print("Valores:", valores)

        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado


#### ELIMINAR TABLAS RELACIONADAS #####

    def eliminar_curso_empleado(pkAsistenciaCurso):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM asistencias_cursos WHERE pkAsistenciaCurso = %s"
        valores = (pkAsistenciaCurso,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def eliminar_oportunidad_empleado(fkOportunidad, fkEmpleado):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM empleados_oportunidades WHERE fkOportunidad = %s AND fkEmpleado = %s"
        valores = (fkOportunidad,fkEmpleado)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM prestamos WHERE pkPrestamo = %s"
        valores = (pkPrestamo)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado
    
    def eliminar_reunionIntegracion_empleado(pkReunionIntegracion):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM reuniones_integracion WHERE pkReunionIntegracion = %s"
        valores = (pkReunionIntegracion)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado