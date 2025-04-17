from models.resumen import Resumen

class ResumenController:
    @staticmethod
    def listar_resumenAnalisis(meses, year):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_resumenAnalisis(meses, year)
    
    @staticmethod
    def listar_ingresos(fk, fecha):
        """Devuelve todos los registros registrados"""
        if fk is 0:
            foreingKey = ""
        else:
            foreingKey = f"AND gs.pkGrupoSocio = {fk}"

        ingresos = Resumen(foreingKey=foreingKey,fecha=fecha)
        return ingresos.listar_ingresos()
    
    @staticmethod
    def listar_ventas(fk, fecha):
        """Devuelve todos los registros registrados"""
        ventas = Resumen(foreingKey=fk, fecha=fecha)
        return ventas.listar_ventas()

    
    @staticmethod
    def listar_cuentasPorPagar():
        """Devuelve todos los registros registrados"""
        return Resumen.listar_cuentasPorPagar()
    
    @staticmethod
    def listar_cuentasPorCobrar():
        """Devuelve todos los registros registrados"""
        return Resumen.listar_cuentasPorCobrar()
    
    @staticmethod
    def listar_top1(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_top1(meses)
    
    @staticmethod
    def listar_top2(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_top2(meses)
    
    @staticmethod
    def listar_top3(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_top3(meses)
    
    @staticmethod
    def listar_top4(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_top4(meses)
    
    @staticmethod
    def listar_grafica1(meses, grupo):
        """Devuelve todos los registros registrados"""
        
        try:
            grupo = int(grupo)  # Intenta convertir grupo a entero
        except ValueError:
            grupo = 0  # Si falla, asigna 0

        foreingKey = f"gs.pkGrupoSocio = {grupo} AND" if grupo else ""

        return Resumen.listar_grafica1(meses, foreingKey)
    
    @staticmethod
    def listar_grafica2(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_grafica2(meses)
    
    @staticmethod
    def listar_grafica3(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_grafica3(meses)
    
    @staticmethod
    def listar_grafica4(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_grafica4(meses)
    
    @staticmethod
    def listar_servicio(meses):
        """Devuelve todos los registros registrados"""
        return Resumen.listar_servicio(meses)
