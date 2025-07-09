from flask import Flask,render_template, jsonify, request, make_response
from dotenv import load_dotenv
import os

from routes.usuarioRoutes import usuario_bp
from routes.empleadoRoutes import empleado_bp
from routes.departamentoRoutes import departamento_bp
from routes.ubicacionRoutes import ubicacion_bp
from routes.proveedorRoutes import proveedor_bp
from routes.categoriaArticuloRoutes import categoriaArticulo_bp
from routes.articuloRoutes import articulo_bp
from routes.grupoSocioRoutes import grupoSocioComercial_bp
from routes.socioComercialRoutes import socioComercial_bp
from routes.reporteMetricasRoutes import reporteMetrica_bp
from routes.paisRoutes import pais_bp
from routes.estadoRoutes import estado_bp
from routes.municipioRoutes import municipio_bp
from routes.puebloCiudadRoutes import puebloCiudad_bp
from routes.codigoPostalRoutes import codigoPostal_bp
from routes.resumenRoutes import resumen_bp
from routes.bancoRoutes import banco_bp
from routes.paqueteriaRoutes import paqueteria_bp
from routes.gastoRoutes import gasto_bp
from routes.compraMercanciaRoutes import compraMercancia_bp
from routes.facturaRoutes import factura_bp
from routes.cuentaBancoRoutes import cuentaBanco_bp
from routes.ventaRoutes import venta_bp
from routes.telefonoRoutes import telefono_bp
from routes.cuentaBancoRoutes import cuentaBanco_bp
from routes.paqueteriaRoutes import paqueteria_bp
from routes.asistenciaRoutes import asistencia_bp
from routes.puestoRoutes import puesto_bp
from routes.cursoRoutes import curso_bp
from routes.oportunidadRoutes import oportunidad_bp
from routes.numeroEmergenciaRoutes import numero_emergencia_bp
from routes.permisoRoutes import permiso_bp
from routes.nivelEstudioRoutes import nivel_estudio_bp
from routes.prestamoRoutes import prestamo_bp
from routes.beneficioRoutes import beneficio_bp
from routes.servicioPacRoutes import servicio_pac_bp
from routes.funcionPuestoRoutes import funcion_puesto_bp
from routes.presentadorRoutes import presentador_bp
from routes.clinicaRoutes import clinica_bp
from routes.relojChecadorRoutes import relojChecador_bp
from routes.metodoPagoRoutes import metodo_pago_bp
from routes.zonaRutaRoutes import zona_ruta_bp
from routes.listaPrecioRoutes import lista_precio_bp
from routes.rutaRoutes import ruta_bp
from routes.visitaTiendaRoutes import visita_tienda_bp
from routes.vehiculoRoutes import vehiculo_bp
from routes.servicioVehiculoRoutes import servicio_vehiculo_bp
from routes.lugarServicioRoutes import lugar_servicio_bp
from routes.manoObraRoutes import mano_obra_bp
from routes.enviosRoutes import envio_bp
from routes.docsLcRoutes import docsLc_bp

app = Flask(__name__)

from flask_cors import CORS # Habilitar CORS para todas las rutas
CORS(app)  # Permite solicitudes desde cualquier origen

# Registrar Blueprints (Rutas)
app.register_blueprint(usuario_bp, url_prefix='/coartmex') 
app.register_blueprint(empleado_bp, url_prefix='/coartmex')    
app.register_blueprint(departamento_bp, url_prefix='/coartmex')    
app.register_blueprint(ubicacion_bp, url_prefix='/coartmex')  
app.register_blueprint(proveedor_bp, url_prefix='/coartmex')  
app.register_blueprint(categoriaArticulo_bp, url_prefix='/coartmex')  
app.register_blueprint(articulo_bp, url_prefix='/coartmex')  
app.register_blueprint(grupoSocioComercial_bp, url_prefix='/coartmex')  
app.register_blueprint(socioComercial_bp, url_prefix='/coartmex')  
app.register_blueprint(reporteMetrica_bp, url_prefix='/coartmex')  
app.register_blueprint(pais_bp, url_prefix='/coartmex')  
app.register_blueprint(estado_bp, url_prefix='/coartmex')  
app.register_blueprint(municipio_bp, url_prefix='/coartmex')  
app.register_blueprint(puebloCiudad_bp, url_prefix='/coartmex')  
app.register_blueprint(codigoPostal_bp, url_prefix='/coartmex') 
app.register_blueprint(resumen_bp, url_prefix='/coartmex') 
app.register_blueprint(banco_bp, url_prefix='/coartmex') 
app.register_blueprint(gasto_bp, url_prefix='/coartmex') 
app.register_blueprint(compraMercancia_bp, url_prefix='/coartmex') 
app.register_blueprint(factura_bp, url_prefix='/coartmex') 
app.register_blueprint(venta_bp, url_prefix='/coartmex')
app.register_blueprint(telefono_bp, url_prefix='/coartmex')
app.register_blueprint(cuentaBanco_bp, url_prefix='/coartmex')
app.register_blueprint(paqueteria_bp, url_prefix='/coartmex')
app.register_blueprint(asistencia_bp, url_prefix='/coartmex')
app.register_blueprint(puesto_bp, url_prefix='/coartmex')
app.register_blueprint(curso_bp, url_prefix='/coartmex')
app.register_blueprint(oportunidad_bp, url_prefix='/coartmex')
app.register_blueprint(numero_emergencia_bp, url_prefix='/coartmex')
app.register_blueprint(permiso_bp, url_prefix='/coartmex')
app.register_blueprint(nivel_estudio_bp, url_prefix='/coartmex')
app.register_blueprint(prestamo_bp, url_prefix='/coartmex')
app.register_blueprint(beneficio_bp, url_prefix='/coartmex')
app.register_blueprint(servicio_pac_bp, url_prefix='/coartmex')
app.register_blueprint(funcion_puesto_bp, url_prefix='/coartmex')
app.register_blueprint(presentador_bp, url_prefix='/coartmex')
app.register_blueprint(clinica_bp, url_prefix='/coartmex')
app.register_blueprint(relojChecador_bp, url_prefix='/coartmex')
app.register_blueprint(metodo_pago_bp, url_prefix='/coartmex')
app.register_blueprint(zona_ruta_bp, url_prefix='/coartmex')
app.register_blueprint(lista_precio_bp, url_prefix='/coartmex')
app.register_blueprint(ruta_bp, url_prefix='/coartmex')
app.register_blueprint(visita_tienda_bp, url_prefix='/coartmex')
app.register_blueprint(vehiculo_bp, url_prefix='/coartmex')
app.register_blueprint(servicio_vehiculo_bp, url_prefix='/coartmex')
app.register_blueprint(lugar_servicio_bp, url_prefix='/coartmex')
app.register_blueprint(mano_obra_bp, url_prefix='/coartmex')
app.register_blueprint(envio_bp, url_prefix='/coartmex')
app.register_blueprint(docsLc_bp, url_prefix='/coartmex')

@app.route('/')
def default():
    return 'Welcome'

load_dotenv() 

if __name__ == '__main__':
    app.run(debug=True, host=os.getenv("FLASK_HOST"), port=int(os.getenv("FLASK_PORT")))
    
# if __name__ == '__main__':
#     app.run(debug=True)