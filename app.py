from flask import Flask,render_template, jsonify
import os
from dotenv import load_dotenv

from routes.usuarioRoutes import usuario_bp
from routes.empleadoRoutes import empleado_bp
from routes.departamentoRoutes import departamento_bp
from routes.ubicacionRoutes import ubicacion_bp
from routes.proveedorRoutes import proveedor_bp
from routes.categoriaArticuloRoutes import categoriaArticulo_bp
from routes.articuloRoutes import articulo_bp
from routes.grupoSocioRoutes import grupoSocioComercial_bp
from routes.socioComercialRoutes import socioComercial_bp
from routes.archivoRoutes import archivo_bp
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
from routes.infoPaqueteriaRoutes import infoPaqueteria_bp
from routes.cuentaBancoRoutes import cuentaBanco_bp

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
app.register_blueprint(archivo_bp, url_prefix='/coartmex')  
app.register_blueprint(pais_bp, url_prefix='/coartmex')  
app.register_blueprint(estado_bp, url_prefix='/coartmex')  
app.register_blueprint(municipio_bp, url_prefix='/coartmex')  
app.register_blueprint(puebloCiudad_bp, url_prefix='/coartmex')  
app.register_blueprint(codigoPostal_bp, url_prefix='/coartmex') 
app.register_blueprint(resumen_bp, url_prefix='/coartmex') 
app.register_blueprint(banco_bp, url_prefix='/coartmex') 
app.register_blueprint(paqueteria_bp, url_prefix='/coartmex') 
app.register_blueprint(gasto_bp, url_prefix='/coartmex') 
app.register_blueprint(compraMercancia_bp, url_prefix='/coartmex') 
app.register_blueprint(factura_bp, url_prefix='/coartmex') 
app.register_blueprint(infoPaqueteria_bp, url_prefix='/coartmex') 
app.register_blueprint(cuentaBanco_bp, url_prefix='/coartmex') 

@app.route('/')
def default():
    return 'Welcome'

if __name__ == '__main__':
    app.run(debug=True, host=os.getenv("FLASK_HOST"), port=int(os.getenv("FLASK_PORT")))
    
# if __name__ == '__main__':
#     app.run(debug=True)