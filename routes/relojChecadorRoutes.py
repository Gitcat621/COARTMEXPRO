from flask import Blueprint, request, jsonify
import os
import pandas as pd
from datetime import datetime
from database import Database
import time
import re

relojChecador_bp = Blueprint('relojChecador_bp', __name__)

# Carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'reportes_asistencias'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



@relojChecador_bp.route('/reportes_reloj', methods=['GET'])
def listar_archivos():
    """Endpoint para obtener todos los registros"""

    print("🔍 Se listaron los reportes de asistencia")
    archivos = []

    for idx, archivo in enumerate(os.listdir(UPLOAD_FOLDER), start=1):
        ruta_archivo = os.path.join(UPLOAD_FOLDER, archivo)

        if os.path.isfile(ruta_archivo):  # Verificar que sea un archivo
            tamaño = os.path.getsize(ruta_archivo)  # Tamaño en bytes
            fecha_creacion = time.ctime(os.path.getctime(ruta_archivo))  # Fecha de creación
            ruta_absoluta = os.path.abspath(ruta_archivo)  # Ruta absoluta
            
            # Crear un objeto Archivo y agregarlo a la lista
            archivos.append({
                "pkArchivo": idx,
                "nombreArchivo": archivo,
                "peso": tamaño,
                "fechaSubida": fecha_creacion,
                "ruta": ruta_absoluta
            })

    return jsonify(archivos), 200

# ------------------ FUNCIONES DE LIMPIEZA ------------------

def procesar_archivo(ruta_archivo):
    mensajes = []

    try:
        # Leer la celda B2 de la hoja "Reporte Estadístico"
        try:
            getFecha = pd.read_excel(ruta_archivo, sheet_name="Reporte Estadístico", header=None)
            valor_b2 = getFecha.iloc[1, 1]
            fecha_inicio, fecha_final = valor_b2.split(" ~ ")
            mensajes.append(f"✅ Fechas extraídas: {fecha_inicio} a {fecha_final}")
        except Exception as e:
            mensajes.append(f"⚠️ No se pudieron extraer fechas de B2: {str(e)}")
            fecha_inicio = fecha_final = None

        # Leer y procesar la hoja "Reporte Estadístico"
        try:
            hoja2 = pd.read_excel(
                ruta_archivo,
                sheet_name="Reporte Estadístico",
                skiprows=4,
                header=None
            )

            hoja2.columns = [
                "ID", "Nombre", "Departamento", "Horas_Laborales_Normal", "Horas_Laborales_Real",
                "Retardos_Cantidad", "Retardos_Minuto", "SalidasTemprano_Cantidad", "SalidasTemprano_Minuto",
                "TiempoExtra_EnDiasLaborales", "TiempoExtra_EnDiasFestivos", "DiasAsistidos_NormalReal",
                "Salida_Dias", "Falta_Dias", "Permiso_Dias", "Notas", "Incremento_TiempoExtra",
                "Incremento_Subsidio", "Deduccion_RetardosSalidas", "Deduccion_Permisos",
                "Deduccion_Cargos", "Pago_Real", "Notas2"
            ]

            hoja2 = hoja2.drop(columns=[
                'Departamento', 'SalidasTemprano_Cantidad', 'SalidasTemprano_Minuto', 'TiempoExtra_EnDiasFestivos',
                'Salida_Dias', 'Permiso_Dias', 'Notas', 'Incremento_TiempoExtra', 'Incremento_Subsidio',
                'Deduccion_RetardosSalidas', 'Deduccion_Permisos', 'Deduccion_Cargos', 'Pago_Real', 'Notas2'
            ])

            mensaje = procesar_estadisticas(hoja2, fecha_inicio, fecha_final)
            mensajes.append(mensaje)
        except Exception as e:
            mensajes.append(f"❌ Error al procesar hoja 'Reporte Estadístico': {str(e)}")

        # Leer la hoja "Reporte de Asistencia"
        try:
            hoja3 = pd.read_excel(ruta_archivo, sheet_name="Reporte de Asistencia", header=None)
            mensaje = procesar_asistencias(hoja3)
            mensajes.append(mensaje)
        except Exception as e:
            mensajes.append(f"❌ Error al procesar hoja 'Reporte de Asistencia': {str(e)}")

        return mensajes

    except Exception as e:
        return [f"❌ Error general al procesar el archivo: {str(e)}"]

def procesar_estadisticas(hoja2, fecha_inicio, fecha_final):
    """Procesa y guarda el resumen estadístico en la base de datos."""
    db = Database()

    try:
        db.connection.autocommit = False  # Desactiva el autocommit para manejar transacciones

        query = '''
            INSERT INTO resumen_asistencias 
            (diasLaborados, numerosFalta, numerosRetardo, minutosRetardo, horasExtra, fechaRangoInicio, fechaRangoFinal, fkEmpleado)
            VALUES (%s, %s, %s, %s, %s, %s, %s,
            (SELECT numeroEmpleado FROM empleados WHERE nombreEmpleado = %s))
        '''

        for _, fila in hoja2.iterrows():
            try:
                # Extraer días laborados
                dias_laborados = int(str(fila['DiasAsistidos_NormalReal']).split("/")[0])

                # Formatear nombre
                nombre_completo = " ".join(str(fila["Nombre"]).split())
                nombre_formateado = " ".join(re.findall(r"[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+", nombre_completo))

                # Preparar valores
                valores = (
                    dias_laborados,
                    int(fila['Falta_Dias']),
                    int(fila['Retardos_Cantidad']),
                    int(fila['Retardos_Minuto']),
                    str(fila['TiempoExtra_EnDiasLaborales']),
                    fecha_inicio,
                    fecha_final,
                    nombre_formateado
                )

                resultado = db.cursor.execute(query, valores)

                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar resumen para {nombre_formateado}")

            except Exception as e:
                db.connection.rollback()
                return f"🛑 Error al insertar datos de empleado '{nombre_formateado}': {str(e)}"

        db.connection.commit()
        return "✅ Todos los registros de resumen de asistencia se insertaron exitosamente."

    except Exception as e:
        db.connection.rollback()
        return f"🛑 Error en la transacción: {str(e)}"

    finally:
        db.close()

def procesar_asistencias(hoja2):
    """Procesa y guarda los registros de asistencia en la base de datos."""
    db = Database()

    try:
        db.connection.autocommit = False  # Iniciar transacción

        # Paso 1: Obtener año y mes desde celda B2 (fila 3, columna 3)
        rango_fechas = str(hoja2.iloc[2, 2]).strip()
        match = re.search(r"(\d{4})-(\d{2})-(\d{2})\s*~\s*(\d{4})-(\d{2})-(\d{2})", rango_fechas)
        if not match:
            raise ValueError(f"Formato de fecha no válido en B2: '{rango_fechas}'")
        anio, mes = match.group(1), match.group(2)

        # Paso 2: Obtener las fechas del mes (fila 4)
        dias_mes = hoja2.iloc[3].tolist()
        fechas_columnas = []
        for dia in dias_mes:
            try:
                dia_int = int(dia)
                fecha = f"{anio}-{mes}-{dia_int:02}"
            except:
                fecha = None
            fechas_columnas.append(fecha)

        # Paso 3: Recorrer filas para identificar empleados y asistencias
        for i in range(len(hoja2)):
            fila = hoja2.iloc[i]

            if fila.astype(str).str.contains("ID:", na=False).any():
                if i + 1 >= len(hoja2):  # Verificamos que haya una fila siguiente
                    continue

                fila_asistencia = hoja2.iloc[i + 1]

                # Buscar nombre
                nombre_completo = ""
                for col_index, celda in enumerate(fila):
                    if isinstance(celda, str) and "Nombre:" in celda:
                        nombre_col_index = col_index + 2
                        if nombre_col_index < len(fila):
                            nombre_completo = str(fila.iloc[nombre_col_index]).strip()
                        break

                # Formatear el nombre
                nombre_formateado = " ".join(re.findall(r"[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+", nombre_completo))

                # Procesar asistencias por columna
                for col_idx, celda in enumerate(fila_asistencia):
                    if pd.notna(celda):
                        celda = str(celda).strip()
                        fecha = fechas_columnas[col_idx]
                        if fecha:
                            horas = re.findall(r"\d{2}:\d{2}", celda)
                            for hora in horas:
                                registro_asistencia = f"{fecha} {hora}:00"

                                # Ejecutar INSERT
                                insert_query = '''
                                    INSERT INTO asistencias (fkEmpleado, registroAsistencia)
                                    VALUES (
                                        (SELECT numeroEmpleado FROM empleados WHERE nombreEmpleado = %s),
                                        %s
                                    )
                                '''
                                db.cursor.execute(insert_query, (nombre_formateado, registro_asistencia))

        db.connection.commit()
        return "✅ Todos los registros de asistencia fueron insertados exitosamente."

    except Exception as e:
        db.connection.rollback()
        return f"🛑 Error durante la inserción de asistencias: {str(e)}"

    finally:
        db.close()
                

# ------------------ FIN FUNCIONES AUXILIARES ------------------

@relojChecador_bp.route('/reportes_reloj', methods=['POST'])
def crear_archivo():

    print("💽 Se ha subido un reporte de asistencia")

    if 'archivo' not in request.files:
        return jsonify({'mensaje': 'No se ha enviado ningún archivo'}), 400

    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({'mensaje': 'Nombre de archivo no válido'}), 400

    nombreArchivo = archivo.filename
    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombreArchivo)

    if os.path.exists(ruta_archivo):
        return jsonify({'mensaje': 'El archivo ya existe'}), 404

    try:
        archivo.save(ruta_archivo)
        mensajes = procesar_archivo(ruta_archivo)

        if any("❌" in m for m in mensajes):
            os.remove(ruta_archivo)
            return jsonify({'mensaje': 'Error al procesar el archivo', 'detalles': mensajes}), 500
        elif any("🛑" in m for m in mensajes):
            return jsonify({'mensaje': 'El archivo fue procesado con errores.', 'detalles': mensajes}), 200
        else:
            return jsonify({'mensaje': 'Archivo procesado correctamente.', 'detalles': mensajes}), 201

    except Exception as e:
        os.remove(ruta_archivo)
        return jsonify({'mensaje': 'Error al procesar el archivo', 'detalles': ''}), 500


@relojChecador_bp.route('/reportes_reloj', methods=['PUT'])
def editar_archivo():
    """Endpoint para actualizar un archivo"""

    #Sin edicion


@relojChecador_bp.route('/reportes_reloj', methods=['DELETE'])
def eliminar_archivo():
    """Endpoint para eliminar un archivo tanto del servidor como de la base de datos"""

    print("🗑️ Se ha eliminado un reporte de asistencia")

    data = request.json
    nombreArchivo = data.get('nombreArchivo')

    if not nombreArchivo:
        return jsonify({'mensaje': 'No se obtuvo el nombre del archivo'}), 400

    # Ruta completa del archivo
    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombreArchivo)

    # Verificar si el archivo existe
    if not os.path.exists(ruta_archivo):
        return jsonify({'mensaje': 'El archivo no existe'}), 404

    try:
        os.remove(ruta_archivo)
        
        return jsonify({'mensaje': 'Archivo eliminado correctamente'}), 200
    except Exception as e:
        return jsonify({'mensaje': f'Error al eliminar el archivo: {str(e)}'}), 500
