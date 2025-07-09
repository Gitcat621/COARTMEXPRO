from flask import Blueprint, request, jsonify
import os
import re
from flask import send_from_directory

docsLc_bp = Blueprint('docsLc_bp', __name__)

# Carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'documentos_lc'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



@docsLc_bp.route('/pdfLc', methods=['GET'])
def mostrar_pdf():
    print("🔍 Se listaron docs de LC")
    tipo = request.args.get('tipo')

    if not tipo:
        return jsonify({'mensaje': 'Falta el tipo de documento'}), 400

    archivos_filtrados = []

    for archivo in os.listdir(UPLOAD_FOLDER):
        if archivo.endswith('.pdf') and f"_{tipo}_" in archivo:
            ruta_archivo = os.path.join(UPLOAD_FOLDER, archivo)
            fecha_modificacion = os.path.getmtime(ruta_archivo)
            archivos_filtrados.append((archivo, fecha_modificacion))

    if not archivos_filtrados:
        return jsonify({'mensaje': 'No se encontraron archivos para ese tipo'}), 404

    # Ordenar por fecha de modificación (descendente)
    archivos_filtrados.sort(key=lambda x: x[1], reverse=True)
    archivo_mas_reciente = archivos_filtrados[0][0]

    filename = archivo_mas_reciente

    if not filename:
        return jsonify({'mensaje': 'Falta el nombre del archivo'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(filepath):
        return jsonify({'mensaje': 'Archivo no encontrado'}), 404

    return send_from_directory(UPLOAD_FOLDER, filename, mimetype='application/pdf')


@docsLc_bp.route('/docsLc', methods=['GET'])
def listar_archivos():
    print("🔍 Se listaron docs de LC")
    tipo = request.args.get('tipo')

    if not tipo:
        return jsonify({'mensaje': 'Falta el tipo de documento'}), 400

    archivos_filtrados = []

    for archivo in os.listdir(UPLOAD_FOLDER):
        if archivo.endswith('.pdf') and f"_{tipo}_" in archivo:
            ruta_archivo = os.path.join(UPLOAD_FOLDER, archivo)
            fecha_modificacion = os.path.getmtime(ruta_archivo)
            archivos_filtrados.append((archivo, fecha_modificacion))

    if not archivos_filtrados:
        return jsonify({'mensaje': 'No se encontraron archivos para ese tipo'}), 404

    # Ordenar por fecha de modificación (descendente)
    archivos_filtrados.sort(key=lambda x: x[1], reverse=True)
    archivo_mas_reciente = archivos_filtrados[0][0]

    coincidencia = re.search(r'_(\d+)_(\d{4}-\d{2}-\d{2})\.pdf$', archivo_mas_reciente)

    if coincidencia:
        tipo_archivo = coincidencia.group(1)
        fecha_nombre = coincidencia.group(2)
    else:
        fecha_nombre = None  # Si por alguna razón no se puede extrae

    return jsonify({'vigencia': fecha_nombre}), 200


@docsLc_bp.route('/docsLc', methods=['POST'])
def crear_archivo():
    print("💽 Se ha subido un reporte de asistencia")

    if 'archivo' not in request.files:
        return jsonify({'mensaje': 'No se ha enviado ningún archivo'}), 400

    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({'mensaje': 'Nombre de archivo no válido'}), 400

    vigencia = request.form.get('vigencia')  # Ej. 2025_05_01
    if not vigencia:
        return jsonify({'mensaje': 'No se recibió la vigencia'}), 400

    tipo = request.form.get('tipo')  # Ej. 1
    if not tipo:
        return jsonify({'mensaje': 'No se recibió el tipo'}), 400

    # Obtener nombre original sin extensión
    nombre_original, extension = os.path.splitext(archivo.filename)

    # Construir el nuevo nombre
    nombreArchivo = f"{nombre_original}_{tipo}_{vigencia}{extension}"

    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombreArchivo)

    if os.path.exists(ruta_archivo):
        return jsonify({'mensaje': 'El archivo ya existe'}), 404

    try:
        archivo.save(ruta_archivo)

        return jsonify({'mensaje': 'Archivo actualizado correctamente.'}), 200

    except Exception as e:
        os.remove(ruta_archivo)
        return jsonify({'mensaje': 'Error al guardar el archivo', 'detalles': ''}), 500
