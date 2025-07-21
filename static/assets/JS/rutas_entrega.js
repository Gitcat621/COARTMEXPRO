$(document).ready(function () {

    //Inicializar datatable
    $('#rutaEntregaTable').DataTable({
        ordering: false,
        columns: [
            { title: "Empleado", width: "20%" },
            { title: "Destino", width: "12%" },
            { title: "Dia", width: "12%" },
            { title: "Tiendas" },
        ],
        scrollX: true,
    });


    listarRutas();
    
});


document.getElementById('busqueda').addEventListener('click', () => {

    listarRutas();

});


async function listarRutas() {
    try {

        let fechaRuta = document.getElementById('fechaIngreso').value.trim();
        let consulta  = 1;
        // Si está vacío, nulo o undefined, asignamos la fecha actual
        if (!fechaRuta) {
            consulta = 0;
        }

        const response = await fetch(`/api/rutas?fechaRuta=${fechaRuta}&consulta=${consulta}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        function toformatearFechaRuta(fechaString) {
            const fecha = new Date(fechaString);
            const fechaFormateada = fecha.toLocaleDateString('es-MX', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            });

            // Capitalizar primera letra del resultado
            return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
        }

        try{
            let tabla = $('#rutaEntregaTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(r => [
                r.nombreEmpleado,
                r.nombreZonaRuta,                
                toformatearFechaRuta(r.fechaRuta),
                r.tiendas,
                r.fkZonaRuta,
                r.numeroEmpleado,
                r.pkRuta
            ])).draw();
        }catch{
            console.log('No hay tabla para: rutas');
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

