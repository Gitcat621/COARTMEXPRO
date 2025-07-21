$(document).ready(function () {

    //Inicializar datatable
    $('#cxcTable').DataTable({
        columns: [
            { title: "No.", width:'5%'},
            { title: "Total a cobrar", width:'15%'},
            { title: "Fecha de vencimiento"},
            { title: "Socio" },
        ],
        scrollX: true,
    });


    listarCuentasPorCobrar();
    
});



async function listarCuentasPorCobrar() {
    try {

        const response = await fetch(`/api/analisis/cuentas_por_cobrar`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        function traducirFecha(fechaString) {
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
            let tabla = $('#cxcTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(cxc => [
                cxc.numeroAnio,
                '$' + cxc.totalFactura.toLocaleString('es-MX'),
                traducirFecha(cxc.fechaVencimiento),
                cxc.nombreSocio
            ])).draw();
        }catch{
            console.log('No hay tabla para: rutas');
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

