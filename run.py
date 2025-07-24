# run.py
from waitress import serve
from app import app
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("FLASK_HOST", "127.0.0.1")
port = int(os.getenv("FLASK_PORT", 8000))

print(f"🚀 Iniciando aplicación Flask en {host} y 127.0.0.1 :{port}...")
serve(app, host=host, port=port)
