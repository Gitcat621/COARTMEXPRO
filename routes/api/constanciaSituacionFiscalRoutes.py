from flask import Blueprint, request, jsonify
import os
import re
from flask import send_from_directory

api_CSF = Blueprint('api_CSF', __name__)

# Carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'documentos_CSF'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



@api_CSF.route('/pdf', methods=['GET'])
def mostrar_pdf():
    print("🔍 Se consultó la CSF")

    # Verificar que el directorio existe
    if not os.path.exists(UPLOAD_FOLDER):
        return jsonify({'mensaje': 'Carpeta no encontrada'}), 404

    archivos_pdf = []

    # Recolectar archivos PDF con su timestamp de modificación
    for archivo in os.listdir(UPLOAD_FOLDER):
        if archivo.lower().endswith('.pdf'):
            ruta = os.path.join(UPLOAD_FOLDER, archivo)
            fecha_modificacion = os.path.getmtime(ruta)
            archivos_pdf.append((archivo, fecha_modificacion))

    if not archivos_pdf:
        return jsonify({'mensaje': 'No hay archivos PDF disponibles'}), 404

    # Seleccionar el archivo más reciente
    archivos_pdf.sort(key=lambda x: x[1], reverse=True)
    archivo_mas_reciente = archivos_pdf[0][0]

    return send_from_directory(UPLOAD_FOLDER, archivo_mas_reciente, mimetype='application/pdf')



@api_CSF.route('/documentos', methods=['POST'])
def crear_archivo():
    print("💽 Se ha subido un reporte de asistencia")

    if 'archivo' not in request.files:
        return jsonify({'mensaje': 'No se ha enviado ningún archivo'}), 400

    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({'mensaje': 'Nombre de archivo no válido'}), 400

    ruta_archivo = os.path.join(UPLOAD_FOLDER, archivo.filename)

    if os.path.exists(ruta_archivo):
        return jsonify({'mensaje': 'El archivo ya existe'}), 404

    try:
        archivo.save(ruta_archivo)

        return jsonify({'mensaje': 'Archivo actualizado correctamente.'}), 200

    except Exception as e:
        os.remove(ruta_archivo)
        return jsonify({'mensaje': 'Error al guardar el archivo', 'detalles': ''}), 500
