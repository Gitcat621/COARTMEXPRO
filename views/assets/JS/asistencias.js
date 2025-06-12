document.getElementById('busqueda').addEventListener('click', () => {

    
    listarAsistencia();
    listarResumenAsistencia();
    obtenerObservacion();

});


//Inicializar datatable
$(document).ready(function() {

    $('#asistenciaTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Asistencia" },
        ],
    });

});

async function listarResumenAsistencia(){
    try {
        let year = document.getElementById('datepicker').value;
        let month = document.getElementById('datepicker2').value;
        let fortnight = document.getElementById('quincena_menu').value;

        year = year ? Number(year) : new Date().getFullYear();
        month = month ? Number(month) : new Date().getMonth() + 1;
        fortnight = fortnight ? Number(fortnight) : 1;

        const response = await fetch(`http://127.0.0.1:5000/coartmex/resumen_asistencias?year=${year}&month=${month}&fortnight=${fortnight}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true});
            return;
        }

        // Destruir DataTable si ya existe
        if ($.fn.DataTable.isDataTable("#resumen_asistencia")) {
            $("#resumen_asistencia").DataTable().clear().destroy();
        }

        const tabla = document.getElementById("resumen_asistencia").querySelector("tbody");
        tabla.innerHTML = "";

        data.forEach(emp => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${emp.numeroEmpleado}</td>
                <td>${emp.nombreEmpleado}</td>
                <td>${emp.nombreDepartamento ?? "Sin departamento"}</td>
                <td>${emp.diasLaborados}</td>
                <td>${emp.numerosFalta}</td>
                <td>${emp.numerosRetardo}</td>
                <td>${emp.minutosRetardo}</td>
                <td>${emp.horasExtra}</td>
            `;
            tabla.appendChild(fila);
        });

        // Inicializar DataTable
        $("#resumen_asistencia").DataTable({
            scrollX: true,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Exportar a Excel',
                    className: 'btn btn-success',
                    title: `Resumen Asistencia ${year}-${month} Q${fortnight}`
                }
            ],
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('No se pueden obtener las estadísticas de asistencia', 'Error', {"closeButton": true});
    }
}


async function listarAsistencia() {
    try {

        year = document.getElementById('datepicker').value;
        month = document.getElementById('datepicker2').value;
        fortnight = document.getElementById('quincena_menu').value;

        // Asegurar que los valores sean numéricos
        year = year ? Number(year) : new Date().getFullYear();
        month = month ? Number(month) : new Date().getMonth() + 1;
        fortnight = fortnight ? Number(fortnight) : 1;  // Asigna una quincena por defecto si está vacío

        const response = await fetch(`http://127.0.0.1:5000/coartmex/asistencias?year=${year}&month=${month}&fortnight=${fortnight}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        //console.log(data);

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        
        renderizarTablaAsistenciaDataTable(data);
        actualizarPeriodo(data);

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('No se pueden obtener las asistencias', 'Error', {"closeButton": true,});
    }
}



function renderizarTablaAsistenciaDataTable(data) {
    const empleados = {};
    const diasUnicos = new Set();
    const diaSemanaES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Agrupar asistencias por empleado y día
    data.forEach(item => {
        const nombre = item.nombreEmpleado;
        const fecha = new Date(item.registroAsistencia);

        // Compensar desfase si aplica
        fecha.setHours(fecha.getHours() + 5);

        const dia = fecha.getDate();
        const diaSemanaNombre = diaSemanaES[fecha.getDay()];
        const claveDia = `${dia}|${diaSemanaNombre}`;

        const hora = fecha.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        diasUnicos.add(claveDia);

        if (!empleados[nombre]) empleados[nombre] = {};
        if (!empleados[nombre][claveDia]) empleados[nombre][claveDia] = [];

        empleados[nombre][claveDia].push(hora);
    });

    // Ordenar por día numérico (extraído del formato "5|Martes")
    const dias = Array.from(diasUnicos).sort((a, b) => {
        return parseInt(a.split('|')[0]) - parseInt(b.split('|')[0]);
    });

    // Construir columnas
    const columnas = [
        { title: "Empleado", data: "nombre" },
        ...dias.map(d => {
            const [numero, nombreDia] = d.split('|');
            return {
                title: `${numero}-${nombreDia}`,
                data: `dia${numero}`,
                defaultContent: "Sin registro"
            };
        })
    ];

    // Construir filas (datos)
    const filas = Object.entries(empleados).map(([nombre, registroDias]) => {
        const fila = { nombre };
        dias.forEach(d => {
            const numero = d.split('|')[0];
            const horas = registroDias[d];
            fila[`dia${numero}`] = horas ? horas.join("<br>") : "Sin registro";
        });
        return fila;
    });


    // Destruir instancia previa si existe
    if ($.fn.DataTable.isDataTable("#tablaAsistencia")) {
        $('#tablaAsistencia').DataTable().destroy();
        $('#tablaAsistencia thead').empty();
        $('#tablaAsistencia tbody').empty();
    }

    // Inicializar datatable
    $('#tablaAsistencia').DataTable({
        data: filas,
        columns: columnas,
        scrollX: true,
        paging: false,
        info: false,
        ordering: false,
        createdRow: function(row, data, dataIndex) {
            $('td', row).css('vertical-align', 'top'); // Mejora visual
        },
        dom: 'Bfrtip', // 🔹 Activa la barra de botones
        buttons: [
    {
        extend: 'excelHtml5',
        text: 'Descargar Excel',
        className: 'btn btn-success',
        title: 'Asistencia',
        customize: function (xlsx) {
            const sheet = xlsx.xl.worksheets['sheet1.xml'];

            // Contenido del textarea
            const observaciones = $('#observacion').val().replace(/[\n\r]+/g, '\n');

            // Crear una nueva fila al final con "Observaciones"
            const numFilas = $('row', sheet).length;
            const nuevaFila = `
                <row r="${numFilas + 2}">
                    <c t="inlineStr" r="A${numFilas + 2}">
                        <is><t>Observaciones:</t></is>
                    </c>
                </row>
                <row r="${numFilas + 3}">
                    <c t="inlineStr" r="A${numFilas + 3}">
                        <is><t>${observaciones}</t></is>
                    </c>
                </row>
            `;

            // Insertar las filas antes del cierre de la etiqueta </sheetData>
            const sheetData = sheet.getElementsByTagName('sheetData')[0];
            sheetData.innerHTML += nuevaFila;
        }
    }
]


    });

}



function actualizarPeriodo(data) {
    if (data.length === 0) {
        document.getElementById("fechaInicio").textContent = null;
        document.getElementById("fechaFin").textContent = null;
        return; // Si no hay datos, no actualizamos
    }


    // Extraer fechas y convertirlas en objetos Date
    const fechas = data.map(item => new Date(item.registroAsistencia));

    // Determinar la fecha mínima y máxima
    const fechaInicio = new Date(Math.min(...fechas));
    const fechaFin = new Date(Math.max(...fechas));

    // Formatear en YYYY-MM-DD
    const formatoFecha = fecha => fecha.toISOString().split('T')[0];

    // Actualizar el contenido en el HTML
    document.getElementById("fechaInicio").textContent = formatoFecha(fechaInicio);
    document.getElementById("fechaFin").textContent = formatoFecha(fechaFin);
}
