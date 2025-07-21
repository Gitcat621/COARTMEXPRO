from flask import Blueprint, request, jsonify, render_template
import os
import pandas as pd

from models.compraMercancia import CompraMercancia
from models.ordenCompra import OrdenCompra
from models.factura import Factura
from models.motivoGasto import MotivoGasto
from models.gasto import Gasto
from models.articulo import Articulo
from models.venta import Venta

from database import Database
import time

api_reportesMetricas = Blueprint('api_reportesMetricas', __name__)

# Carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'reportes_metricas/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

#RUTAS API
@api_reportesMetricas.route('/', methods=['GET'])
def listar_archivos():
    """Endpoint para obtener todos los registros"""

    print("🔍 Se listaron los reportes de metricas")
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
    mensajes = []  # Aquí guardamos todos los mensajes de resultado

    try:
        hojas_excel = {
            "COMPRA DE MERCANCIA": ["A:E"],
            "CUENTAS POR PAGAR": ["A:B"],
            "ORDEN-VENTA-ENTREGA-FACTURA": ["A:Q"],
            "CUENTAS COBRADAS": ["A:B"],
            "GASTOS": ["A:D"],
            "INVENTARIO": ["A:C"]
        }

        for hoja, columnas in hojas_excel.items():
            try:
                df = pd.read_excel(ruta_archivo, usecols=columnas[0], sheet_name=hoja)
                if df.empty:
                    mensajes.append(f"⚠️ Hoja '{hoja}' vacía. Saltada.")
                    continue

                if hoja == "INVENTARIO":
                    if df.iloc[:, 1].isna().all() and df.iloc[:, 2].isna().all():
                        mensajes.append(f"⚠️ Columnas B y C vacías en '{hoja}'. Saltada.")
                        continue
                    mensaje = procesar_inventario(df)
                elif hoja == "COMPRA DE MERCANCIA":
                    mensaje = procesar_compras(df)
                elif hoja == "CUENTAS POR PAGAR":
                    mensaje = procesar_cuentas_por_pagar(df)
                elif hoja == "ORDEN-VENTA-ENTREGA-FACTURA":
                    mensaje1 = procesar_ordenes(df)
                    mensajes.extend([mensaje1])
                    continue
                elif hoja == "CUENTAS COBRADAS":
                    mensaje = procesar_cuentas_cobradas(df)
                elif hoja == "GASTOS":
                    mensaje = procesar_gastos(df)

                mensajes.append(mensaje)
            except Exception as e:
                mensajes.append(f"❌ Error al procesar hoja '{hoja}': {str(e)}")

        return mensajes  # Se devuelve la lista con mensajes

    except Exception as e:
        return [f"❌ Error general al procesar el archivo: {str(e)}"]



def procesar_compras(df):
    """Procesa y guarda compras de mercancía dentro de una única transacción."""
    db = Database()  # Inicializar conexión a la base de datos

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        df["Proveedor"] = df["Proveedor"].str.strip()
        df["Proveedor"] = df["Proveedor"].astype(str).str.replace(r'\s{2,}', ' ', regex=True)

        df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce").dt.strftime('%Y-%m-%d')
        df.fillna("N/A", inplace=True)

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                pagoPendiente = fila["Monto"] if str(fila["¿Credito?"]).strip().upper() == "SI" else 0

                compra = CompraMercancia(
                    folioELV=fila["Folio ELV"],
                    fkProveedor=fila["Proveedor"],
                    montoMercancia=fila["Monto"],
                    fechaMercancia=fila["Fecha"],
                    pagoPendiente=pagoPendiente
                )

                resultado = compra.crear_compra(cursor)
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar compra con folio {fila['Folio ELV']}")

        db.connection.commit()  # Confirmar la transacción si todas las inserciones fueron exitosas
        print("🆗 Todas las compras fueron insertadas exitosamente.")
        return "🆗 Compras procesadas correctamente."

    except Exception as e:
        db.connection.rollback()  # Revertir todos los cambios si ocurre algún error
        print(f"🛑 Error en la transacción: {e}")
        return f"❌ Error en compras: {str(e)}"

    finally:
        db.close()  # Cerrar conexión


def procesar_cuentas_por_pagar(df):
    """Procesa y actualiza cuentas por pagar dentro de una única transacción."""
    db = Database()  # Inicializar conexión

    try:
        db.connection.autocommit = False  # Desactivar autocommit

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                compra = CompraMercancia(
                    folioELV=fila["Folio ELV"],
                    pagoPendiente=fila["Monto pendiente"]
                )
                resultado = compra.editar_compra(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al actualizar la compra con folio {fila['Folio ELV']}")

        db.connection.commit()  # Confirmar la transacción si todo salió bien
        print("🆗 Cuentas por pagar procesadas exitosamente.")
        return "🆗 Cuentas por pagar procesadas exitosamente."

    except Exception as e:
        db.connection.rollback()  # Revertir todos los cambios en caso de error
        print(f"🛑 Error en la transacción de cuentas por pagar: {e}")
        return f"🛑 Error en la transacción de cuentas por pagar: {e}"

    finally:
        db.close()


def procesar_ordenes(df):
    """Procesa órdenes de compra, ventas, entregas y facturas."""
    db = Database()

    try:
        db.connection.autocommit = False  # Modo transaccional

        # =====================
        # LIMPIEZA Y FORMATO
        # =====================

        df["No. OC"] = df["No. OC"].fillna("N/A").astype(str).str.strip().str.replace(r'\.0$', '', regex=True)
        df["No. factura"] = df["No. factura"].fillna("N/A").astype(str).str.strip().str.replace(r'\.0$', '', regex=True)

        # Dar formato a fechas clave
        fechas_a_formatear = ["Fecha OC", "Fecha de surtido", "Fecha entrega", "Fecha emision", "Fecha de vencimiento"]
        for col in fechas_a_formatear:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime('%Y-%m-%d')

        # Normalizar nombre de socios
        socios_map = {
            'COSTA MUJERES': 'COSTA MUJERES - CATALONIA',
            'WHYNDHAM MAYA': 'MAYA - WYNDHAM',
            'WHYNDHAM AZTECA': 'AZTECA - WYNDHAM',
            'MOON SUNRISE': 'MOON SUNRISE - HOTEL SHOP',
            'ROYALTON SPLASH': 'ROYALTON SPLASH - HOTEL SHOP',
            'SOLUCIONES': 'SOLUCIONES SENCILLAS',
            'CATALONIA ROYAL': 'ROYAL TULUM CATALONIA',
            'CROWPARADISE': 'CROW PARADISE',
            'CATALONIA COSTA': 'COSTA MUJERES - CATALONIA',
            'PALLADIUM': 'PALLADIUM - HOTEL SHOP',
            'AVA EL CORAZON ': 'AVA CORAZON - HOTEL SHOP',
            'CATALONIA PLAYA': 'PLAYA MAROMA - CATALONIA',
            'MORPHO': 'MORPHO TRAVEL'
        }
        df['Socio comercial'] = df['Socio comercial'].replace(socios_map)

        # =====================
        # INSERCIÓN DE ÓRDENES ÚNICAS
        # =====================

        ordenes_unicas = df.drop_duplicates(subset=["No. OC", "Fecha OC", "Socio comercial"]).copy()
        ordenes_unicas["Fecha de surtido"] = ordenes_unicas["Fecha de surtido"].fillna("N/A")
        ordenes_unicas["Fecha entrega"] = ordenes_unicas["Fecha entrega"].fillna("N/A")

        with db.connection.cursor() as cursor:
            for _, fila in ordenes_unicas.iterrows():
                ordenCompra = OrdenCompra(
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"]
                )
                if not ordenCompra.crear_ordenCompra(cursor):
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")

        # =====================
        # INSERCIÓN DE VENTAS Y ENTREGAS
        # =====================

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                venta_orden = OrdenCompra(
                    codigoArticulo=fila["Codigo de articulo"],
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"],
                    cantidadOrden=fila["Cant en OC"],
                    cantidadVenta=fila["Cant vendida"],
                    precioVenta=fila["Precio de venta"]
                )
                if not venta_orden.crear_venta(cursor):
                    raise Exception(f"Error al insertar venta para orden {fila['No. OC']}")

                entrega = Venta(
                    montoVenta=fila["Cant vendida"] * fila["Precio de venta"],
                    fechaVenta=fila["Fecha entrega"],
                    fkSocioComercial=fila["Socio comercial"],
                )
                if not entrega.crear_venta(cursor):
                    raise Exception(f"Error al insertar entrega para orden {fila['No. OC']}")

        # =====================
        # INSERCIÓN DE RESPUESTAS A ÓRDENES
        # =====================

        with db.connection.cursor() as cursor:
            for _, fila in ordenes_unicas.iterrows():
                respuesta = OrdenCompra(
                    fechaSurtido=fila["Fecha de surtido"],
                    fechaEntrega=fila["Fecha entrega"],
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"]
                )
                if not respuesta.crear_respuesta(cursor):
                    raise Exception(f"Error al insertar respuesta para orden {fila['No. OC']}")

        # =====================
        # INSERCIÓN DE FACTURAS
        # =====================

        facturas_unicas = df.drop_duplicates(subset=["No. OC", "Fecha OC", "Socio comercial"]).copy()
        facturas_unicas["Nota credito"] = facturas_unicas["Nota credito"].apply(lambda x: None if pd.isna(x) else x)
        facturas_unicas["Monto descuento"] = facturas_unicas["Monto descuento"].apply(lambda x: None if pd.isna(x) else x)
        facturas_unicas["Sub total factura"] = facturas_unicas["Sub total factura"].fillna("N/A")
        facturas_unicas["Total factura"] = facturas_unicas["Total factura"].fillna("N/A")
        facturas_unicas["Razon social"] = facturas_unicas["Razon social"].fillna("N/A")

        with db.connection.cursor() as cursor:
            for _, fila in facturas_unicas.iterrows():
                factura = Factura(
                    numeroAnio=fila["No. factura"],
                    fechaFactura=fila["Fecha emision"],
                    subTotalFactura=fila["Sub total factura"],
                    totalFactura=fila["Total factura"],
                    fechaVencimiento=fila["Fecha de vencimiento"],
                    razonSocial=fila["Razon social"],
                    numeroNotaCredito=fila["Nota credito"],
                    montoDescuento=fila["Monto descuento"],
                    fkOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"],
                )
                if not factura.crear_factura(cursor):
                    raise Exception(f"Error al insertar factura {fila['No. factura']}")

        db.connection.commit()
        print("✅ Órdenes procesadas exitosamente.")
        print("✅ Todas las facturas fueron insertadas exitosamente.")
        return "🆗 Ordenes, ventas y facturas insertadas correctamento."

    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error durante la transacción: {e}")
        return f"🛑 Error al insertar la hoja de ordenes-venta-factura: {e}"

    finally:
        db.close()


def procesar_cuentas_cobradas(df):
    """Procesa y actualiza facturas cobradas."""

    db = Database()

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        df["Fecha pagada"] = pd.to_datetime(df["Fecha pagada"], errors="coerce").dt.strftime('%Y-%m-%d')

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                factura = Factura(
                    numeroAnio=fila["No. factura"],
                    fechaPagado=fila["Fecha pagada"]
                )
                resultado = factura.editar_factura(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar factura {fila['No. factura']}")

        db.connection.commit()
        print("🆗 Cuentas cobradas procesadas exitosamente.")   
        return "🆗 Cuentas cobradas procesadas exitosamente."

    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error en la transacción de factura: {e}")
        return f"🛑 Error en la transacción de factura: {e}"

    finally:
        db.close()


def procesar_gastos(df):
    """Procesa y guarda gastos."""
    db = Database()

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        df["Motivo"] = df["Motivo"].str.strip()

        # Asegurar tipo string y limpieza de espacios
        df["Tipo de gasto"] = df["Tipo de gasto"].astype(str).str.strip()

        # Mapeo explícito de texto a números
        mapa = {"FIJO": 1, "VARIABLE": 2}
        df["Tipo de gasto"] = df["Tipo de gasto"].map(mapa).astype("Int64")

        # Conversión de fecha segura
        df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce").dt.strftime('%Y-%m-%d')


        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                motivoGasto = MotivoGasto(
                    nombreMotivoGasto=fila["Motivo"],
                    tipoGasto=fila["Tipo de gasto"]
                )
                resultado = motivoGasto.actualizar_motivos(cursor)
                if resultado is None or resultado is False:
                    raise Exception(f"Error al actualizar el motivo de gasto {fila['Motivo']}")

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                gasto = Gasto(
                    montoGasto=fila["Monto"],
                    fechaGasto=fila["Fecha"],
                    fkMotivoGasto=fila["Motivo"],
                    tipoGasto=fila["Tipo de gasto"]
                )
                resultado = gasto.crear_gasto(cursor)
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar el gasto {fila['Motivo']}")
            
        db.connection.commit()  # Confirmar la transacción si todas las inserciones fueron exitosas
        print("🆗 Todas los gastos fueron insertados exitosamente.")    
        return "🆗 Todas los gastos fueron insertados exitosamente."
    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error en la transacción de gastos: {e}")
        return f"🛑 Error en la transacción de gastos: {e}"

    finally:
        db.close()


def procesar_inventario(df):
    """Procesa y guarda inventario."""
    db = Database()

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce").dt.strftime('%Y-%m-%d')

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                inventario = Articulo(
                    cantidadExistencia=fila["Existencias"],
                    fechaExistencia=fila["Fecha"],
                    codigoArticulo=fila["Codigo"]
                )
                resultado = inventario.crear_existencias(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar existencias del artículo {fila['Codigo']}")
    
        db.connection.commit()  # Confirmar la transacción si todas las inserciones fueron exitosas
        print("🆗 Todas las existencias fueron insertadas exitosamente.")
        return "🆗 Todas las existencias fueron insertadas exitosamente."
    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error en la transacción de existencias: {e}")
        return f"🛑 Error en la transacción de existencias: {e}"

    finally:
        db.close()

# ------------------ FIN FUNCIONES AUXILIARES ------------------

@api_reportesMetricas.route('/', methods=['POST'])
def crear_archivo():

    print("💽 Se ha subido un reporte de metrica")

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


@api_reportesMetricas.route('/', methods=['PUT'])
def editar_archivo():
    """Endpoint para actualizar un archivo"""

    #Sin edicion


@api_reportesMetricas.route('/', methods=['DELETE'])
def eliminar_archivo():
    """Endpoint para eliminar un archivo tanto del servidor como de la base de datos"""

    print("🗑️ Se ha eliminado un reporte de metrica")

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
