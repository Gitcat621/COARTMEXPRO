
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
            e.estado,
            p.pkPuesto,
            ne.pkNivelEstudio,
            u.pkUbicacion,
            pc.pkPuebloCiudad,
            es.pkEstado,
            pa.pkPais
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
            e.idRelojChecador,
            p.nombrePuesto,
            d.nombreDepartamento,
            ne.nombreNivel,
            CONCAT(pc.nombrePuebloCiudad, ', ', es.nombreEstado, ', ',pa.nombrePais) AS ubicacion,
            e.estado,
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

    @staticmethod
    def es_entero(valor):
        """Verifica si un valor puede convertirse a entero."""
        try:
            int(valor)
            return True
        except (ValueError, TypeError):
            return False

    def crear_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion, ciudadNacimiento, estadoNacimiento, paisNacimiento):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        try:
            if fkUbicacion is not None:
                # --- Insertar o recuperar ID de pueblo ---
                if Empleado.es_entero(ciudadNacimiento):
                    ciudadNacimiento = int(ciudadNacimiento)
                else:
                    db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (ciudadNacimiento,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    ciudadNacimiento = db.cursor.fetchone()['LAST_INSERT_ID()']

                # --- Insertar o recuperar ID de estado ---
                if Empleado.es_entero(estadoNacimiento):
                    estadoNacimiento = int(estadoNacimiento)
                else:
                    db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estadoNacimiento,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    estado = db.cursor.fetchone()['LAST_INSERT_ID()']

                # --- Insertar o recuperar ID de país ---
                if Empleado.es_entero(paisNacimiento):
                    paisNacimiento = int(paisNacimiento)
                else:
                    db.cursor.execute('INSERT INTO paises (nombrePais) VALUES (%s)', (paisNacimiento,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    paisNacimiento = db.cursor.fetchone()['LAST_INSERT_ID()']

                # --- Insertar ubicación ---
                db.cursor.execute('INSERT INTO ubicaciones (fkPuebloCiudad, fkEstado, fkPais) VALUES (%s, %s, %s)', (ciudadNacimiento, estadoNacimiento, paisNacimiento))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                fkUbicacion = db.cursor.fetchone()['LAST_INSERT_ID()']

            consulta = '''
            INSERT INTO empleados 
            (numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion) 
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            '''

            numeroEmpleado = Empleado.generar_numero_empleado(fechaIngreso, numeroEmpleado)
            if not numeroEmpleado:
                return False  # O lanzar una excepción indicando el error

            valores = (numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion)

            print(consulta % valores)

            db.cursor.execute(consulta, valores)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
            
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al insertar empleado:", e)
            return False
        finally:
            db.close()

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

    def editar_empleado(numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion, ciudadNacimiento, estadoNacimiento, paisNacimiento):
        """Edita un registro en la base de datos."""
        db = Database()
        try:
            # --- Insertar o recuperar ID de pueblo ---
            if Empleado.es_entero(ciudadNacimiento):
                ciudadNacimiento = int(ciudadNacimiento)
            else:
                db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (ciudadNacimiento,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                ciudadNacimiento = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de estado ---
            if Empleado.es_entero(estadoNacimiento):
                estadoNacimiento = int(estadoNacimiento)
            else:
                db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estadoNacimiento,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                estado = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de país ---
            if Empleado.es_entero(paisNacimiento):
                paisNacimiento = int(paisNacimiento)
            else:
                db.cursor.execute('INSERT INTO paises (nombrePais) VALUES (%s)', (paisNacimiento,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                paisNacimiento = db.cursor.fetchone()['LAST_INSERT_ID()']


            #--- Insertar ubicación ---
            if fkUbicacion is None:
                db.cursor.execute('INSERT INTO ubicaciones (fkPuebloCiudad, fkEstado, fkPais) VALUES (%s, %s, %s)', (ciudadNacimiento, estadoNacimiento, paisNacimiento))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                fkUbicacion = db.cursor.fetchone()['LAST_INSERT_ID()']
            else:
                db.cursor.execute('UPDATE ubicaciones set fkPuebloCiudad = %s, fkEstado = %s, fkPais =%s WHERE pkUbicacion = %s', (ciudadNacimiento, estadoNacimiento, paisNacimiento, fkUbicacion))

            consulta = "UPDATE empleados SET rfc = %s, nombreEmpleado = %s, fechaIngreso = %s, fechaNacimiento = %s, nomina = %s, vale = %s, estado = %s, fkPuesto = %s, fkNivelEstudio = %s, fkUbicacion = %s WHERE numeroEmpleado = %s"
            valores = (rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio, fkUbicacion, numeroEmpleado)
            print(consulta % valores)
            db.cursor.execute(consulta, valores)
            
            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True
            
        except Exception as e:
            db.connection.rollback()
            print("❌ Error al editar empleado:", e)
            return False
        finally:
            db.close()

    @staticmethod
    def agregar_info_empleado(nombreEmpleado, fechaIngreso, idRelojChecador, nomina, vale, fkPuesto, state, numeroEmpleado, rfc, fechaNacimiento, pkNumerosEmergencia, 
                        numerosEmergencia, pkUniformeEmpleado, tallaUniforme, pzasUniforme, fkNivelEstudio, fkUbicacion, puebloCiudad, estado, pais):
    
        db = Database()

        try:
            if pkNumerosEmergencia is None:
                # --- Insertar números de emergencia ---
                consultaNumeros = 'INSERT INTO numeros_emergencia (numeroEmergencia, fkEmpleado) VALUES (%s, %s)'
                valoresNumeros = [(numero, numeroEmpleado) for numero in numerosEmergencia]
                db.cursor.executemany(consultaNumeros, valoresNumeros)
            else:
                # Convertir las cadenas en conjuntos de enteros
                pk_numeros_set = set(map(int, pkNumerosEmergencia.split("-")))
                numeros_emergencia_set = set(map(int, numerosEmergencia))

                # Identificar números eliminados y nuevos
                eliminados = pk_numeros_set - numeros_emergencia_set
                nuevos = numeros_emergencia_set - pk_numeros_set

                # --- Eliminar números que ya no están ---
                if eliminados:
                    consultaEliminar = 'DELETE FROM numeros_emergencia WHERE pkNumeroEmergencia IN (%s)'
                    valoresEliminar = ", ".join(map(str, eliminados))
                    db.cursor.execute(consultaEliminar % valoresEliminar)

                # --- Insertar nuevos números ---
                if nuevos:
                    consultaInsertar = 'INSERT INTO numeros_emergencia (numeroEmergencia, fkEmpleado) VALUES (%s, %s)'
                    valoresInsertar = [(numero, numeroEmpleado) for numero in nuevos]
                    db.cursor.executemany(consultaInsertar, valoresInsertar)
            

            # --- Insertar uniforme ---
            if pkUniformeEmpleado is None:
                consultaUniformes = 'INSERT INTO uniformes_empleados (tallaUniforme, pzasUniforme, fkEmpleado) VALUES (%s,%s,%s)'
                valoresUniforme = (tallaUniforme, pzasUniforme, numeroEmpleado)
                db.cursor.execute(consultaUniformes, valoresUniforme)
            else:
                consultaUniformes = 'UPDATE uniformes_empleados set tallaUniforme = %s, pzasUniforme = %s WHERE pkUniformeEmpleado = %s'
                valoresUniforme = (tallaUniforme, pzasUniforme, pkUniformeEmpleado)
                db.cursor.execute(consultaUniformes, valoresUniforme)

            # --- Insertar o recuperar ID de pueblo ---
            if puebloCiudad is not None:
                if Empleado.es_entero(puebloCiudad):
                    puebloCiudad = int(puebloCiudad)
                else:
                    db.cursor.execute('INSERT INTO pueblos_ciudades (nombrePuebloCiudad) VALUES (%s)', (puebloCiudad,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    puebloCiudad = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de estado ---
            if estado is not None:
                if Empleado.es_entero(estado):
                    estado = int(estado)
                else:
                    db.cursor.execute('INSERT INTO estados (nombreEstado) VALUES (%s)', (estado,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    estado = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar o recuperar ID de país ---
            if pais is not None:
                if Empleado.es_entero(pais):
                    pais = int(pais)
                else:
                    db.cursor.execute('INSERT INTO paises (nombrePais) VALUES (%s)', (pais,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    pais = db.cursor.fetchone()['LAST_INSERT_ID()']

            # --- Insertar ubicación ---
            if fkUbicacion is None:
                db.cursor.execute('INSERT INTO ubicaciones (fkPuebloCiudad, fkEstado, fkPais) VALUES (%s, %s, %s)', (puebloCiudad, estado, pais))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                fkUbicacion = db.cursor.fetchone()['LAST_INSERT_ID()']
            else:
                db.cursor.execute('UPDATE ubicaciones set fkPuebloCiudad = %s, fkEstado = %s, fkPais =%s WHERE pkUbicacion = %s', (puebloCiudad, estado, pais, fkUbicacion))
                
            # --- Actualizar empleado ---
            consultaEmpleado = "UPDATE empleados SET nombreEmpleado = %s, fechaIngreso = %s, idRelojChecador = %s, nomina = %s, vale = %s, fkPuesto = %s, estado = %s,rfc = %s, fechaNacimiento = %s, fkNivelEstudio = %s, fkUbicacion = %s WHERE numeroEmpleado = %s"
            valoresEmpleado = (nombreEmpleado, fechaIngreso, idRelojChecador,nomina, vale, fkPuesto, state, rfc, fechaNacimiento, fkNivelEstudio, fkUbicacion, numeroEmpleado)
            db.cursor.execute(consultaEmpleado, valoresEmpleado)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True

        except Exception as e:
            # ❌ Cancelar cambios si ocurre error
            db.connection.rollback()
            print("❌ Transacción cancelada por error:", e)
            return False

        finally:
            db.close()

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
    
    def crear_oportunidad_empleado(fkEmpleado, oportunidades):
        """Guarda nuevas oportunidades para un empleado, evitando duplicados y errores de inserción."""
        db = Database()

        try:
            for oportunidad in oportunidades:
                if Empleado.es_entero(oportunidad):
                    fkOportunidad = int(oportunidad)
                else:
                    db.cursor.execute('INSERT INTO oportunidades (oportunidad) VALUES (%s)', (oportunidad,))
                    db.cursor.execute('SELECT LAST_INSERT_ID()')
                    fkOportunidad = db.cursor.fetchone()['LAST_INSERT_ID()']

                # Validar si ya existe esa relación antes de insertar
                db.cursor.execute(
                    'SELECT COUNT(*) as total FROM empleados_oportunidades WHERE fkEmpleado = %s AND fkOportunidad = %s',
                    (fkEmpleado, fkOportunidad)
                )
                existe = db.cursor.fetchone()['total']

                if not existe:
                    db.cursor.execute(
                        'INSERT INTO empleados_oportunidades (fkEmpleado, fkOportunidad) VALUES (%s, %s)',
                        (fkEmpleado, fkOportunidad)
                    )

            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True

        except Exception as e:
            print("❌ Error durante la transacción:", e)
            db.connection.rollback()
            return False

        finally:
            db.close()
    
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
