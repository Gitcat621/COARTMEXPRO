from flask import Flask,render_template, jsonify, request, make_response
from dotenv import load_dotenv
import os



app = Flask(__name__)

from flask_cors import CORS # Habilitar CORS para todas las rutas
CORS(app)  # Permite solicitudes desde cualquier origen



@app.route('/')
def default():
    return 'Welcome'

load_dotenv() 

if __name__ == '__main__':
    app.run(debug=True, host=os.getenv("FLASK_HOST"), port=int(os.getenv("FLASK_PORT")))
    
# if __name__ == '__main__':
#     app.run(debug=True)