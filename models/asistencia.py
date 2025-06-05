from database import Database
from datetime import timedelta
from calendar import monthrange

class Asistencia:
    def __init__(self, 
        pkAsistencia=None, 
        registroAsistencia=None,
        fkEmpleado=None
        ):
        """Inicializa un objeto"""
        self.pkAsistencia = pkAsistencia
        self.registroAsistencia = registroAsistencia
        self.fkEmpleado = fkEmpleado


    @staticmethod
    def listar_asistencias(year, month, fortnight):
        """Obtiene registros filtrados por año, mes y quincena."""
        db = Database()

        # Determinar el rango de fechas según la quincena
        if fortnight == 1:
            date_start = f"{year}-{month}-01"
            date_end = f"{year}-{month}-14"
        elif fortnight == 2:
            date_start = f"{year}-{month}-15"
            date_end = f"{year}-{month}-31"

        #QUITAR LEFT JOIN
        consulta = '''
        SELECT e.numeroEmpleado, e.nombreEmpleado, d.nombreDepartamento, a.registroAsistencia
        FROM asistencias a
        JOIN empleados e ON e.numeroEmpleado = a.fkEmpleado
        LEFT JOIN puestos p ON p.pkPuesto = e.fkPuesto
        LEFT JOIN departamentos d ON d.pkDepartamento = p.fkDepartamento
        WHERE a.registroAsistencia BETWEEN %s AND %s
        '''

        resultado = db.execute_query(consulta, (date_start, date_end))
        db.close()

        #print(f"Datos obtenidos: {resultado}")  # 🔹 Imprime los resultados para verificar si están vacíos
        return resultado
    
    def listar_resumen_asistencias(year, month, fortnight):
        """Obtiene registros filtrados por año, mes y quincena."""
        db = Database()

        # Asegurar que month tenga formato '01', '02', ..., '12'
        month = str(month).zfill(2)

        # Determinar el rango de fechas según la quincena
        if fortnight == 1:
            date_start = f"{year}-{month}-01"
            date_end = f"{year}-{month}-15"
        elif fortnight == 2:
            _, last_day = monthrange(int(year), int(month))
            date_start = f"{year}-{month}-{last_day}"
            date_end = f"{year}-{month}-16"

        consulta = '''
        SELECT e.numeroEmpleado, e.nombreEmpleado, d.nombreDepartamento, ra.diasLaborados,
            ra.numerosFalta, ra.numerosRetardo, ra.minutosRetardo, ra.horasExtra,
            ra.fechaRangoInicio, ra.fechaRangoFinal
        FROM resumen_asistencias ra
        JOIN empleados e ON e.numeroEmpleado = ra.fkEmpleado
        LEFT JOIN puestos p ON p.pkPuesto = e.fkPuesto
        LEFT JOIN departamentos d ON d.pkDepartamento = p.fkDepartamento
        WHERE ra.fechaRangoInicio <= %s AND ra.fechaRangoFinal >= %s
        '''

        print("Consulta SQL:")
        print(consulta)
        print("Parámetros:")
        print(f"Fecha inicio: {date_start}, Fecha fin: {date_end}")

        resultado = db.execute_query(consulta, (date_start, date_end))
        db.close()

        # Convertir horasExtra (timedelta) a string o a minutos para evitar error de serialización
        for row in resultado:
            if isinstance(row.get("horasExtra"), (str, type(None))):
                continue
            elif isinstance(row["horasExtra"], timedelta):
                row["horasExtra"] = str(row["horasExtra"])

        #print(f"Datos obtenidos: {resultado}")  # 🔹 Imprime los resultados para verificar si están vacíos
        return resultado

    
    def crear_asistencia(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        consulta = "INSERT INTO asistencias (registroAsistencia fkEmpleado) VALUES (%s,%s,%s,%s,%s,%s)"
        valores = (self.registroAsistencia, self.fkEmpleado)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def editar_asistencia(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkAsistencia)
        consulta = "UPDATE asistencias SET registroAsistencia = %s WHERE pkAsistencia = %s"
        valores = (self.registroAsistencia, self.pkAsistencia,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado

    def eliminar_asistencia(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM asistencias WHERE pkAsistencia = %s"
        valores = (self.pkAsistencia,)
        resultado = db.execute_commit(consulta, valores)
        print(consulta % valores)
        db.close()
        return resultado


        # SELECT * FROM tu_tabla
        # WHERE DAY(fecha) >= 16
        # AND MONTH(fecha) = 5
        # AND YEAR(fecha) = 2025;