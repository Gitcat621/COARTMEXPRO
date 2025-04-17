import subprocess
import os

# Ruta al archivo que contiene tu app Flask
app_path = "app.py"  # Cambia si tu archivo se llama diferente

# Comando para abrir una nueva ventana de cmd y ejecutar el script
subprocess.Popen(f'start cmd /k "python {app_path}"', shell=True)
