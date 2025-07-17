# utils/decoradores.py
from flask import session, redirect, url_for
from functools import wraps

def rol_requerido(*departamentos):
    def decorador(f):
        @wraps(f)
        def decorada(*args, **kwargs):
            if 'usuario' not in session:
                return redirect(url_for('login'))
            user_departamento = session.get('departamento')
            if user_departamento not in departamentos:
                print(f"🔒 Acceso denegado para el usuario con departamento: {user_departamento}")
                return redirect(url_for('Page404'))
            return f(*args, **kwargs)
        return decorada
    return decorador
