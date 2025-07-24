from flask import Flask,render_template, redirect, session, url_for
from dotenv import load_dotenv
import os

from routes.api.usuarioRoutes import api_usuarios
from routes.api.grupoSocioRoutes import api_gruposSocioComercial
from routes.api.analisisRoutes import api_analisis
from routes.api.categoriaArticuloRoutes import api_categoriasArticulo
from routes.api.articuloRoutes import api_articulos
from routes.api.reporteMetricasRoutes import api_reportesMetricas
from routes.api.puestoRoutes import api_puestos
from routes.api.codigoPostalRoutes import api_codigosPostales
from routes.api.puebloCiudadRoutes import api_pueblosCiudades
from routes.api.municipioRoutes import api_municipios
from routes.api.estadoRoutes import api_estados
from routes.api.paisRoutes import api_paises
from routes.api.ubicacionRoutes import api_ubicaciones
from routes.api.nivelEstudioRoutes import api_nivelesEstudio
from routes.api.presentadorRoutes import api_presentadores
from routes.api.cursoRoutes import api_cursos
from routes.api.oportunidadRoutes import api_oportunidades
from routes.api.clinicaRoutes import api_clinicas
from routes.api.beneficioRoutes import api_beneficios
from routes.api.servicioPacRoutes import api_serviciosPac
from routes.api.permisoRoutes import api_permisos
from routes.api.prestamoRoutes import api_prestamos
from routes.api.empleadoRoutes import api_empleados
from routes.api.asistenciaRoutes import api_asistencias
from routes.api.reportesRelojChecadorRoutes import api_reportesRelojChecador
from routes.api.funcionPuestoRoutes import api_funcionesPuesto
from routes.api.departamentoRoutes import api_departamentos
from routes.api.zonaRutaRoutes import api_zonasRuta
from routes.api.socioComercialRoutes import api_sociosComerciales
from routes.api.listaPrecioRoutes import api_listasPrecios
from routes.api.rutaRoutes import api_rutas
from routes.api.visitaTiendaRoutes import api_visitas
from routes.api.documentosLCRoutes import api_documentosLC
from routes.api.vehiculoRoutes import api_vehiculos
from routes.api.manoObraRoutes import api_manosObra
from routes.api.lugarServicioRoutes import api_lugaresServicio
from routes.api.servicioVehiculoRoutes import api_serviciosVehiculo
from routes.api.paqueteriaRoutes import api_paqueterias
from routes.api.enviosRoutes import api_envios
from routes.api.cuentaBancoRoutes import api_cuentasBanco
from routes.api.metodoPagoRoutes import api_metodosPago
from routes.api.bancoRoutes import api_bancos
from routes.api.proveedorRoutes import api_proveedores
from routes.api.constanciaSituacionFiscalRoutes import api_CSF
from routes.api.compraMercanciaRoutes import api_comprasMercancia
from routes.api.entregaRoutes import api_entregas
from routes.api.facturaRoutes import api_facturas
from routes.api.gastoRoutes import api_gastos
from routes.api.motivoGastoRoutes import api_motivosGasto
from routes.api.numeroEmergenciaRoutes import api_numerosEmergencia
from routes.api.ordenCompraRoutes import api_ordenesCompra
from routes.api.reunionRoutes import api_reuniones
from routes.api.seguimientoAlmacenRoutes import api_seguimientosAlmacen
from routes.api.telefonoRoutes import api_telefonos
from routes.api.ventaRoutes import api_ventas

from routes.web.analisisRoutes import web_analisis
from routes.web.administracionCF import web_administracionCF
from routes.web.recursosHumanosRoutes import web_recursosHumanos
from routes.web.logisticaComercialRoutes import web_logisticaComercial
from routes.web.sistemasRoutes import web_sistemas
from routes.web.administracionContable import web_administracionContable


app = Flask(__name__)

@app.context_processor
def inject_user_data():
    return {
        'usuario': session.get('usuario'),
        'departamento': session.get('departamento')
    }

app.register_blueprint(api_usuarios, url_prefix="/api/usuarios")
app.register_blueprint(api_gruposSocioComercial, url_prefix="/api/grupos_socio")
app.register_blueprint(api_analisis, url_prefix="/api/analisis")
app.register_blueprint(api_categoriasArticulo, url_prefix="/api/categorias_articulo")
app.register_blueprint(api_articulos, url_prefix="/api/articulos")
app.register_blueprint(api_reportesMetricas, url_prefix="/api/reportes_metricas")
app.register_blueprint(api_puestos, url_prefix="/api/puestos")
app.register_blueprint(api_codigosPostales, url_prefix="/api/codigos_postales")
app.register_blueprint(api_pueblosCiudades, url_prefix="/api/pueblos_ciudades")
app.register_blueprint(api_municipios, url_prefix="/api/municipios")
app.register_blueprint(api_estados, url_prefix="/api/estados")
app.register_blueprint(api_paises, url_prefix="/api/paises")
app.register_blueprint(api_ubicaciones, url_prefix="/api/ubicaciones")
app.register_blueprint(api_nivelesEstudio, url_prefix="/api/niveles_estudio")
app.register_blueprint(api_presentadores, url_prefix="/api/presentadores")
app.register_blueprint(api_cursos, url_prefix="/api/cursos")
app.register_blueprint(api_oportunidades, url_prefix="/api/oportunidades")
app.register_blueprint(api_clinicas, url_prefix="/api/clinicas")
app.register_blueprint(api_beneficios, url_prefix="/api/beneficios")
app.register_blueprint(api_serviciosPac, url_prefix="/api/servicios_pac")
app.register_blueprint(api_permisos, url_prefix="/api/permisos")
app.register_blueprint(api_prestamos, url_prefix="/api/prestamos")
app.register_blueprint(api_empleados, url_prefix="/api/empleados")
app.register_blueprint(api_asistencias, url_prefix="/api/asistencias")
app.register_blueprint(api_reportesRelojChecador, url_prefix="/api/reportes_reloj_checador")
app.register_blueprint(api_funcionesPuesto, url_prefix="/api/funciones_puesto")
app.register_blueprint(api_departamentos, url_prefix="/api/departamentos")
app.register_blueprint(api_zonasRuta, url_prefix="/api/zonas_ruta")
app.register_blueprint(api_sociosComerciales, url_prefix="/api/socios_comerciales")
app.register_blueprint(api_listasPrecios, url_prefix="/api/listas_precios")
app.register_blueprint(api_rutas, url_prefix="/api/rutas")
app.register_blueprint(api_visitas, url_prefix="/api/visitas_tienda")
app.register_blueprint(api_documentosLC, url_prefix="/api/documentos_logistica_comercial")
app.register_blueprint(api_vehiculos, url_prefix="/api/vehiculos")
app.register_blueprint(api_manosObra, url_prefix="/api/manos_obra")
app.register_blueprint(api_lugaresServicio, url_prefix="/api/lugares_servicio")
app.register_blueprint(api_serviciosVehiculo, url_prefix="/api/servicios_vehiculo")
app.register_blueprint(api_paqueterias, url_prefix="/api/paqueterias")
app.register_blueprint(api_envios, url_prefix="/api/envios")
app.register_blueprint(api_cuentasBanco, url_prefix="/api/cuentas_banco")
app.register_blueprint(api_metodosPago, url_prefix="/api/metodos_pago")
app.register_blueprint(api_bancos, url_prefix="/api/bancos")
app.register_blueprint(api_proveedores, url_prefix="/api/proveedores")
app.register_blueprint(api_CSF, url_prefix="/api/constancias_situacion_fiscal")
app.register_blueprint(api_comprasMercancia, url_prefix="/api/compras_mercancia")
app.register_blueprint(api_entregas, url_prefix="/api/entregas")
app.register_blueprint(api_facturas, url_prefix="/api/facturas")
app.register_blueprint(api_motivosGasto, url_prefix="/api/motivos_gasto")
app.register_blueprint(api_gastos, url_prefix="/api/gastos")
app.register_blueprint(api_numerosEmergencia, url_prefix="/api/numeros_emergencia")
app.register_blueprint(api_ordenesCompra, url_prefix="/api/ordenes_compra")
app.register_blueprint(api_reuniones, url_prefix="/api/reuniones")
app.register_blueprint(api_seguimientosAlmacen, url_prefix="/api/seguimientos_almacen")
app.register_blueprint(api_telefonos, url_prefix="/api/telefonos")
app.register_blueprint(api_ventas, url_prefix="/api/ventas")

app.register_blueprint(web_analisis, url_prefix="/web/analisis")
app.register_blueprint(web_administracionCF, url_prefix="/web/contable_fiscal")
app.register_blueprint(web_recursosHumanos, url_prefix="/web/recursos_humanos")
app.register_blueprint(web_logisticaComercial, url_prefix="/web/logistica_comercial")
app.register_blueprint(web_sistemas, url_prefix="/web/sistemas")
app.register_blueprint(web_administracionContable, url_prefix="/web/administracion_contable")

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/404')
def Page404():
    return render_template('notFound.html')

@app.route('/web/bienvenida')
def bienvenida():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template('bienvenida.html')

@app.route('/web/prueba')
def test():
    if 'usuario' not in session:
        return redirect('/')
    
    return render_template('testing.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.errorhandler(404)
def pagina_no_encontrada(error):
    return render_template('notFound.html'), 404

load_dotenv() 

app.secret_key = os.getenv("SECRET_KEY", "dev_key")

# if not app.debug:
#     import logging
#     from logging.handlers import RotatingFileHandler

#     if not os.path.exists('logs'):
#         os.mkdir('logs')

#     file_handler = RotatingFileHandler('logs/error.log', maxBytes=10240, backupCount=5)
#     file_handler.setLevel(logging.ERROR)
#     file_handler.setFormatter(logging.Formatter(
#         '%(asctime)s %(levelname)s: %(message)s [en %(pathname)s:%(lineno)d]'
#     ))
#     app.logger.addHandler(file_handler)

#     app.logger.setLevel(logging.INFO)
#     app.logger.info('App iniciada en producción.')

if __name__ == '__main__':
    app.run(debug=True, host=os.getenv("FLASK_HOST"), port=int(os.getenv("FLASK_PORT")))