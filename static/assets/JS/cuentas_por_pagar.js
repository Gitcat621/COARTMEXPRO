$(document).ready(function () {

    //Inicializar datatable
    $('#cxpTable').DataTable({
        columns: [
            { title: "Proveedor a pagar" },
            { title: "Fecha de compra" },
            { title: "Saldo pendiente" },
        ],
        scrollX: true,
    });


    listarCuentasPorPagar();
    
});



async function listarCuentasPorPagar() {
    try {

        const response = await fetch(`/api/analisis/cuentas_por_pagar`, {
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
            let tabla = $('#cxpTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(cxp => [
                cxp.nombreProveedor,
                traducirFecha(cxp.fechaMercancia),
                '$' + Number(cxp.pagoPendiente).toLocaleString('es-MX')
            ])).draw();
        }catch{
            console.log('No hay tabla para: cuentas por pagar');
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

