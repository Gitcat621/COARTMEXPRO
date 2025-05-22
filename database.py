import pymysql
import os
from dotenv import load_dotenv

class Database:
    def __init__(self):
        load_dotenv()  # Cargar variables desde el archivo .env
        self.connection = None
        self.cursor = None
        try:
            self.connection = pymysql.connect(
                host=os.getenv("DB_HOST"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME"),
                cursorclass=pymysql.cursors.DictCursor  # Devuelve los resultados como diccionario
            )
            self.cursor = self.connection.cursor()
            #print("✅ Conexión exitosa a MySQL")
        except pymysql.MySQLError as e:
            print(f"❌ Error de conexión a MySQL: {e}")

    def execute_query(self, query, params=None):
        """Ejecuta una consulta SELECT"""
        if not self.cursor:
            print("🚫 No se puede ejecutar la consulta: conexión no establecida.")
            return None
        try:
            self.cursor.execute(query, params)
            return self.cursor.fetchall()
        except pymysql.MySQLError as e:
            print(f"❌ Error al ejecutar consulta: {e}")
            return None

    def execute_commit(self, query, params=None):
        """Ejecuta una consulta tipo INSERT/UPDATE/DELETE"""
        if not self.cursor:
            print("🚫 No se puede ejecutar la consulta: conexión no establecida.")
            return False
        try:
            self.cursor.execute(query, params)
            self.connection.commit()
            return True
        except pymysql.MySQLError as e:
            print(f"❌ Error al ejecutar consulta: {e}")
            return False
        
    def execute_many(self, query, lista_de_valores):
        """Ejecuta múltiples inserciones en una sola operación."""
        if not self.cursor:
            print("🚫 No se puede ejecutar la consulta: conexión no establecida.")
            return False
        try:
            self.cursor.executemany(query, lista_de_valores)
            self.connection.commit()
            return True
        except pymysql.MySQLError as e:
            print(f"❌ Error al ejecutar consulta múltiple: {e}")
            return False


    def close(self):
        """Cierra la conexión con la base de datos"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
