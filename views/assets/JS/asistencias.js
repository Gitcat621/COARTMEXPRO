$(document).ready(function () {

    listarAsistencia();
    listarResumenAsistencia();
    
});

document.getElementById('busqueda').addEventListener('click', () => {

    
    listarAsistencia();
    listarResumenAsistencia();

});


//Inicializar datatable
$(document).ready(function() {

    $('#asistenciaTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Asistencia" },
        ],
        scrollX: true,
    });

});

async function listarResumenAsistencia(){
    try {

        year = document.getElementById('datepicker').value;
        month = document.getElementById('datepicker2').value;
        fortnight = document.getElementById('quincena_menu').value;

        // Asegurar que los valores sean numéricos
        year = year ? Number(year) : new Date().getFullYear();
        month = month ? Number(month) : new Date().getMonth() + 1;
        fortnight = fortnight ? Number(fortnight) : 1;  // Asigna una quincena por defecto si está vacío

        const response = await fetch(`http://127.0.0.1:5000/coartmex/resumen_asistencias?year=${year}&month=${month}&fortnight=${fortnight}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const tabla = document.getElementById("resumen_asistencia").querySelector("tbody");
        tabla.innerHTML = ""; // Limpia la tabla antes de llenarla

        data.forEach(emp => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${emp.numeroEmpleado}</td>
                <td>${emp.nombreEmpleado}</td>
                <td>${emp.nombreDepartamento ?? "Sin departamento"}</td> <!-- Manejo de valores nulos -->
                <td>${emp.diasLaborados}</td>
                <td>${emp.numerosFalta}</td>
                <td>${emp.numerosRetardo}</td>
                <td>${emp.minutosRetardo}</td>
                <td>${emp.horasExtra}</td>
            `;
            tabla.appendChild(fila);
        });

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('No se pueden obtener las estadisticas de asistencia', 'Error', {"closeButton": true,});
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

        console.log(data);

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

    // Agrupar asistencias por empleado y día
    data.forEach(item => {
        const nombre = item.nombreEmpleado;
        const fecha = new Date(item.registroAsistencia);
        const dia = fecha.getDate();

        // Compensar horas manualmente si sabes que está desplazado
        fecha.setHours(fecha.getHours() + 5); // ajusta si desfase

        const hora = fecha.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });


        diasUnicos.add(dia);

        if (!empleados[nombre]) empleados[nombre] = {};
        if (!empleados[nombre][dia]) empleados[nombre][dia] = [];

        empleados[nombre][dia].push(hora);
    });

    const dias = Array.from(diasUnicos).sort((a, b) => a - b);

    // Construir columnas
    const columnas = [
        { title: "Empleado", data: "nombre" },
        ...dias.map(d => ({
            title: `${d}`,
            data: `dia${d}`,
            defaultContent: "Sin registro"
        }))
    ];

    // Construir filas (datos)
    const filas = Object.entries(empleados).map(([nombre, registroDias]) => {
        const fila = { nombre };
        dias.forEach(d => {
            fila[`dia${d}`] = registroDias[d] ? registroDias[d].join(" - ") : "Sin registro";
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
        searching: false,
        info: false,
        ordering: false
    });
}


function actualizarPeriodo(data) {
    if (data.length === 0) return; // Si no hay datos, no actualizamos

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
