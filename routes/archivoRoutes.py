from flask import Blueprint, request, jsonify
import os
import pandas as pd
from datetime import datetime
from models.archivo import Archivo
from models.compraMercancia import CompraMercancia
from models.ordenCompra import OrdenCompra
from models.factura import Factura
from models.motivoGasto import MotivoGasto
from models.gasto import Gasto
from models.articulo import Articulo
from models.resumen import Resumen
from models.venta import Venta
from database import Database
import time

archivo_bp = Blueprint('archivo_bp', __name__)

# Carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



@archivo_bp.route('/archivos', methods=['GET'])
def listar_archivos():
    """Endpoint para obtener todos los registros"""

    print("🔍 Se listaron los archivos")
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

import pandas as pd

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
                    mensaje2 = procesar_facturas(df)
                    mensajes.extend([mensaje1, mensaje2])
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
    """Procesa órdenes de compra, ventas y entregas."""
    db = Database()

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        # ARREGLAR Y AJUSTAR EL FORMATO DE LOS NUMEROS DE ORDEN DE COMPRA
        df["No. OC"] = df["No. OC"].fillna("N/A")
        df["No. OC"] = df["No. OC"].astype(str).str.strip().str.replace(r'\.0$', '', regex=True)

        # DAR FORMATO DE FECHA EN INGLES
        df["Fecha OC"] = pd.to_datetime(df["Fecha OC"], errors="coerce").dt.strftime('%Y-%m-%d')

        # TRANSFORMAR LOS NOMBRES A LOS DE LA BD
        df['Socio comercial'] = df['Socio comercial'].replace({
            'COSTA MUJERES': 'COSTA MUJERES - CATALONIA',
            'WHYNDHAM MAYA': 'MAYA - WYNDHAM',
            'WHYNDHAM AZTECA': 'AZTECA - WYNDHAM',
            'MOON SUNRISE': 'MOON SUNRISE - HOTEL SHOP',
            'ROYALTON SPLASH': 'ROYALTON SPLASH - HOTEL SHOP',
            'SOLUCIONES': 'SOLUCIONES SENCILLAS',
            'CATALONIA ROYAL': 'ROYAL TULUM CATALONIA',
            'CROWPARADISE':'CROW PARADISE',
            'CATALONIA COSTA':'COSTA MUJERES - CATALONIA',
            'PALLADIUM':'PALLADIUM - HOTEL SHOP',
            'AVA EL CORAZON ':'AVA CORAZON - HOTEL SHOP',
            'CATALONIA PLAYA':'PLAYA MAROMA - CATALONIA',
            'MORPHO':'MORPHO TRAVEL'
        })

        # DEJAR SOLO UNA APARICION POR ORDEN DE COMPRA DIFERENTE (ELIMINAR REPETIDOS)
        ordenes_unicas = df.drop_duplicates(subset=["No. OC", "Fecha OC", "Socio comercial"]).copy()

        # DAR FORMATO EN INGLES A LAS FECHAS
        ordenes_unicas["Fecha OC"] = pd.to_datetime(ordenes_unicas["Fecha OC"], errors="coerce").dt.strftime('%Y-%m-%d')
        ordenes_unicas["Fecha de surtido"] = pd.to_datetime(ordenes_unicas["Fecha de surtido"], errors="coerce").dt.strftime('%Y-%m-%d')
        ordenes_unicas["Fecha entrega"] = pd.to_datetime(ordenes_unicas["Fecha entrega"], errors="coerce").dt.strftime('%Y-%m-%d')

        # LLENAR CELDAS VACIAS CON UN VALOR DEFAULT
        ordenes_unicas["Fecha de surtido"] = ordenes_unicas["Fecha de surtido"].fillna("N/A")
        ordenes_unicas["Fecha entrega"] = ordenes_unicas["Fecha entrega"].fillna("N/A")
        
        # ENVIAR DATOS POR FILA PARA ARMAR CONSULTA
        with db.connection.cursor() as cursor:
            for _, fila in ordenes_unicas.iterrows():
                ordenCompra = OrdenCompra(
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"]
                )

                resultado = ordenCompra.crear_ordenCompra(cursor)  # Pasamos la conexión activa
                # SI LA CONSULTA DEVUELVE UN FALSO, BRINCA UN ERROR
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")

        
        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                ordenCompra = OrdenCompra(
                    codigoArticulo=fila["Codigo de articulo"],
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"],
                    cantidadOrden=fila["Cant en OC"]
                )
                resultado = ordenCompra.crear_articulosEnOrden(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                ordenCompra = OrdenCompra(
                    codigoArticulo=fila["Codigo de articulo"],
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"],
                    cantidadVenta=fila["Cant vendida"],
                    precioVenta=fila["Precio de venta"]
                )
                resultado = ordenCompra.crear_venta(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")

        with db.connection.cursor() as cursor:
            for _, fila in df.iterrows():
                venta = Venta(
                    montoVenta=fila["Cant vendida"] * fila["Precio de venta"],
                    fechaVenta=fila["Fecha entrega"],
                    fkSocioComercial=fila["Socio comercial"],
                )
                resultado = venta.crear_venta(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")

        with db.connection.cursor() as cursor:
            for _, fila in ordenes_unicas.iterrows():
                ordenCompra = OrdenCompra(
                    fechaSurtido=fila["Fecha de surtido"],
                    fechaEntrega=fila["Fecha entrega"],
                    numeroOrdenCompra=fila["No. OC"],
                    fechaOrdenCompra=fila["Fecha OC"],
                    fkSocioComercial=fila["Socio comercial"]
                )
                resultado = ordenCompra.crear_respuesta(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar orden {fila['No. OC']}")
                
        db.connection.commit()
        print("🆗 Órdenes procesadas exitosamente.") 
        return "🆗 Órdenes procesadas exitosamente."  

    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error en la transacción de órdenes: {e}")
        return f"🛑 Error en la transacción de órdenes: {e}"

    finally:
        db.close()


def procesar_facturas(df):
    """Procesa y guarda facturas."""
    db = Database()

    try:
        db.connection.autocommit = False  # Desactivar autocommit para manejar la transacción manualmente

        df['Socio comercial'] = df['Socio comercial'].replace({
            'COSTA MUJERES': 'COSTA MUJERES - CATALONIA',
            'WHYNDHAM MAYA': 'MAYA - WYNDHAM',
            'WHYNDHAM AZTECA': 'AZTECA - WYNDHAM',
            'MOON SUNRISE': 'MOON SUNRISE - HOTEL SHOP',
            'ROYALTON SPLASH': 'ROYALTON SPLASH - HOTEL SHOP',
            'SOLUCIONES': 'SOLUCIONES SENCILLAS',
            'CATALONIA ROYAL': 'ROYAL TULUM CATALONIA',
            'CROWPARADISE':'CROW PARADISE',
            'CATALONIA COSTA':'COSTA MUJERES - CATALONIA',
            'PALLADIUM':'PALLADIUM - HOTEL SHOP',
            'AVA EL CORAZON ':'AVA CORAZON - HOTEL SHOP',
            'CATALONIA PLAYA':'PLAYA MAROMA - CATALONIA',
            'MORPHO':'MORPHO TRAVEL'
        })

        # Eliminar duplicados
        facturas_unicas = df.drop_duplicates(subset=["No. OC", "Fecha OC", "Socio comercial"]).copy()

        # Reemplazar NaN por None (usualmente útil para columnas numéricas o fechas)
        facturas_unicas["Nota credito"] = facturas_unicas["Nota credito"].apply(lambda x: None if pd.isna(x) else x)
        facturas_unicas["Monto descuento"] = facturas_unicas["Monto descuento"].apply(lambda x: None if pd.isna(x) else x)
        facturas_unicas["No. OC"] = facturas_unicas["No. OC"].apply(lambda x: None if pd.isna(x) else x)

        # Fechas en formato correcto
        facturas_unicas["Fecha emision"] = pd.to_datetime(facturas_unicas["Fecha emision"], errors="coerce").dt.strftime('%Y-%m-%d')
        facturas_unicas["Fecha de vencimiento"] = pd.to_datetime(facturas_unicas["Fecha de vencimiento"], errors="coerce").dt.strftime('%Y-%m-%d')
        
        # Se llenan los valores vacios con un valor default
        facturas_unicas["Fecha emision"] = facturas_unicas["Fecha emision"].apply(lambda x: None if pd.isna(x) else x)
        facturas_unicas["Sub total factura"] = facturas_unicas["Sub total factura"].fillna("N/A")
        facturas_unicas["Total factura"] = facturas_unicas["Total factura"].fillna("N/A")
        facturas_unicas["Razon social"] = facturas_unicas["Razon social"].fillna("N/A")
        facturas_unicas["Fecha de vencimiento"] = facturas_unicas["Fecha de vencimiento"].apply(lambda x: None if pd.isna(x) else x)


        with db.connection.cursor() as cursor:
            for _, fila in facturas_unicas.iterrows():
                factura = Factura(
                    numeroAño=fila["No. factura"],
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
                resultado = factura.crear_factura(cursor)  # Pasamos la conexión activa
                if resultado is None or resultado is False:
                    raise Exception(f"Error al insertar factura {fila['No. factura']}")

        db.connection.commit()  # Confirmar la transacción si todas las inserciones fueron exitosas
        print("🆗 Todas las facturas fueron insertadas exitosamente.")
        return "🆗 Todas las facturas fueron insertadas exitosamente."
    except Exception as e:
        db.connection.rollback()
        print(f"🛑 Error en la transacción de facturas: {e}")
        return f"🛑 Error en la transacción de facturas: {e}"

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
                    numeroAño=fila["No. factura"],
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

@archivo_bp.route('/archivos', methods=['POST'])
def crear_archivo():

    print("💽 Se ha subido un archivo")

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


@archivo_bp.route('/archivos', methods=['PUT'])
def editar_archivo():
    """Endpoint para actualizar un archivo"""

    #Sin edicion


@archivo_bp.route('/archivos', methods=['DELETE'])
def eliminar_archivo():
    """Endpoint para eliminar un archivo tanto del servidor como de la base de datos"""

    print("🗑️ Se ha eliminado un archivo")

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
