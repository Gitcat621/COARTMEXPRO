from database import Database
from datetime import timedelta

class Curso:
    def __init__(self, pkCurso=None, nombreCurso=None, documentoObtenido=None, duracionCurso=None, fkPresentador=None):
        """Inicializa un objeto"""
        self.pkCurso = pkCurso
        self.nombreCurso = nombreCurso
        self.documentoObtenido = documentoObtenido
        self.duracionCurso = duracionCurso
        self.fkPresentador = fkPresentador


    @staticmethod
    def listar_cursos():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM cursos c JOIN presentadores p ON c.fkPresentador = p.pkPresentador"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()

        # Convertir campos timedelta a string
        cursos_serializables = []
        for curso in resultado:
            curso_serializado = {}
            for clave, valor in curso.items():
                if isinstance(valor, timedelta):
                    curso_serializado[clave] = str(valor)
                else:
                    curso_serializado[clave] = valor
            cursos_serializables.append(curso_serializado)

        return cursos_serializables
    
    @staticmethod
    def listar_presentadores():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        consulta = "SELECT * FROM presentadores"
        resultado = db.execute_query(consulta)
        print(consulta)
        db.close()

        return resultado
    
    def crear_curso(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        try:

            if Curso.es_entero(self.fkPresentador):
                self.fkPresentador = int(self.fkPresentador)
            else:
                db.cursor.execute('INSERT INTO presentadores (nombrePresentador) VALUES (%s)', (self.fkPresentador,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                self.fkPresentador = db.cursor.fetchone()['LAST_INSERT_ID()']

            consultaCurso = "INSERT INTO cursos (nombreCurso,documentoObtenido,duracionCurso,fkPresentador) VALUES (%s,%s,%s,%s)"
            valores = (self.nombreCurso,self.documentoObtenido,self.duracionCurso,self.fkPresentador)
            db.cursor.execute(consultaCurso, valores)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True

        except Exception as e:
            # ❌ Cancelar cambios si ocurre error
            db.connection.rollback()
            print("❌ Transacción cancelada por error:", e)
            return False

        finally:
            db.close()

    def editar_curso(self):
        """Edita un registro en la base de datos."""
        db = Database()
        try:

            if Curso.es_entero(self.fkPresentador):
                self.fkPresentador = int(self.fkPresentador)
            else:
                db.cursor.execute('INSERT INTO presentadores (nombrePresentador) VALUES (%s)', (self.fkPresentador,))
                db.cursor.execute('SELECT LAST_INSERT_ID()')
                self.fkPresentador = db.cursor.fetchone()['LAST_INSERT_ID()']

            consultaCurso = "UPDATE cursos SET nombreCurso = %s, documentoObtenido = %s, duracionCurso = %s, fkPresentador = %s WHERE pkCurso = %s"
            valores = (self.nombreCurso, self.documentoObtenido, self.duracionCurso, self.fkPresentador,self.pkCurso)
            db.cursor.execute(consultaCurso, valores)

            # ✅ Confirmar transacción
            db.connection.commit()
            print("✅ Transacción completada con éxito.")
            return True

        except Exception as e:
            # ❌ Cancelar cambios si ocurre error
            db.connection.rollback()
            print("❌ Transacción cancelada por error:", e)
            return False

        finally:
            db.close()

    def eliminar_curso(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        consulta = "DELETE FROM cursos WHERE pkCurso = %s"
        valores = (self.pkCurso,)
        print(consulta % valores)
        resultado = db.execute_commit(consulta, valores)
        db.close()
        return resultado

    @staticmethod
    def es_entero(valor):
        """Verifica si un valor puede convertirse a entero."""
        try:
            int(valor)
            return True
        except (ValueError, TypeError):
            return False