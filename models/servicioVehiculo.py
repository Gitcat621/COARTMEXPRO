from database import Database

class ServicioVehiculo:
    def __init__(self, pkServicioVehiculo=None, numeroServicio=None, nombreServicio=None,fechaServicio=None, kilometrajeInicial=None, kilometrajeFinal=None, numeroFactura=None, fkVehiculo=None, fkLugarServicio=None, fkManoObra=None):
        """Inicializa un objeto"""
        self.pkServicioVehiculo = pkServicioVehiculo
        self.numeroServicio = numeroServicio
        self.nombreServicio = nombreServicio
        self.fechaServicio = fechaServicio
        self.kilometrajeInicial = kilometrajeInicial
        self.kilometrajeFinal = kilometrajeFinal
        self.numeroFactura = numeroFactura
        self.fkVehiculo = fkVehiculo
        self.fkLugarServicio = fkLugarServicio
        self.fkManoObra = fkManoObra


    @staticmethod
    def listar_servicios_vehiculo():
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM servicios_vehiculo sv JOIN manos_obra mo ON mo.pkManoObra = sv.fkManoObra JOIN lugares_servicios_vehiculos lsv ON lsv.pkLugarServicio = sv.fkLugarServicio")
        db.close()
        return resultado
    
    def listar_servicio_vehiculo(fkVehiculo):
        """Obtiene todos los registros de la base de datos."""
        db = Database()
        resultado = db.execute_query("SELECT * FROM servicios_vehiculo sv JOIN manos_obra mo ON mo.pkManoObra = sv.fkManoObra JOIN lugares_servicios_vehiculos lsv ON lsv.pkLugarServicio = sv.fkLugarServicio WHERE sv.fkVehiculo = %s",(fkVehiculo,))
        db.close()
        return resultado
    
    def crear_servicio_vehiculo(self):
        """Guarda un nuevo registro en la base de datos"""
        db = Database()
        query = "INSERT INTO servicios_vehiculo (numeroServicio, nombreServicio, fechaServicio, kilometrajeInicial, kilometrajeFinal, numeroFactura, fkVehiculo, fkLugarServicio, fkManoObra) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        resultado = db.execute_commit(query, (self.numeroServicio, self.nombreServicio, self.fechaServicio, self.kilometrajeInicial, self.kilometrajeFinal, self.numeroFactura, self.fkVehiculo, self.fkLugarServicio, self.fkManoObra))
        db.close()
        return resultado

    def editar_servicio_vehiculo(self):
        """Edita un registro en la base de datos."""
        db = Database()
        print(self.pkServicioVehiculo)
        query = "UPDATE servicios_vehiculo SET numeroServicio = %s, nombreServicio = %s, fechaServicio = %s, kilometrajeInicial = %s, kilometrajeFinal = %s, numeroFactura = %s, fkVehiculo = %s, fkLugarServicio = %s, fkManoObra = %s WHERE pkServicioVehiculo = %s"
        resultado = db.execute_commit(query, (self.numeroServicio, self.nombreServicio, self.fechaServicio, self.kilometrajeInicial, self.kilometrajeFinal, self.numeroFactura ,self.fkVehiculo, self.fkLugarServicio, self.fkManoObra, self.pkServicioVehiculo,))
        db.close()
        return resultado

    def eliminar_servicio_vehiculo(self):
        """Elimina un registro de la base de datos."""
        db = Database()
        query = "DELETE FROM servicios_vehiculo WHERE pkServicioVehiculo = %s"
        resultado = db.execute_commit(query, (self.pkServicioVehiculo,))
        db.close()
        return resultado


