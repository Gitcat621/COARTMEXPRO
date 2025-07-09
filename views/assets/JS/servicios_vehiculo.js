$(document).ready(function () {

    //Inicializar datatable
    $('#servicioVehiculoTable').DataTable({
        columns: [
            { title: "Numero de servicio" },
            { title: "Fecha del servicio" },
            { title: "Nombre del servicio" },
            { title: "Mano de obra" },
            { title: "Kilometraje inicial" },
            { title: "Kilometraje final" },
            { title: "Lugar de servicio" },
            { title: "Numero de factura" },
            {
                title: "Opciones",
                render: function (data, type, row) {
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[10]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true
    });
    // Event listeners para los botones
    // Editar
    $('#servicioVehiculoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const numeroServicio = rowData[0];
        const fechaServicio = transformarFecha(rowData[1]);
        const nombreServicio = rowData[2];
        const nombreManoObra = rowData[3];
        const kilometrajeInicial = rowData[4];
        const kilometrajeFinal = rowData[5];
        const nombreLugarServicio = rowData[6];
        const numeroFactura = rowData[7];
        const fkManoObra = rowData[8];
        const fkLugarServicio = rowData[9];
        const pkServicioVehiculo = rowData[10];

        document.getElementById('numeroServicio').value = numeroServicio;
        document.getElementById('fechaIngreso').value = fechaServicio;
        document.getElementById('nombreServicio').value = nombreServicio;
        document.getElementById('mano_menu').value = fkManoObra;
        document.getElementById('kilometrajeInicial').value = kilometrajeInicial;
        document.getElementById('kilometrajeFinal').value = kilometrajeFinal;
        document.getElementById('numeroFactura').value = numeroFactura;
        document.getElementById('lugar_menu').value = fkLugarServicio;

        abrirModalServicio(2,pkServicioVehiculo);
    });

    // Eliminar
    $('#servicioVehiculoTable').on('click', '.eliminar-btn', function () {

        const pkServicioVehiculo = $(this).data('pk');
        const numeroServicio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar al servicio ${numeroServicio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarServicioVehiculo(pkServicioVehiculo);    
            }
        });
        
    });

    listarServiciosVehiculo();
    obtenerVehiculo();
    
});

$("#switch-4").click(function () {
    const div = $("#lugares");
    
    div.slideToggle(500, function () {
        if (div.is(":visible")) {
            setTimeout(() => {
                $('#lugarTable').DataTable().columns.adjust().draw();
            }, 1);
        }
    });
});

$("#switch-5").click(function () {
    const div = $("#manos");
    
    div.slideToggle(500, function () {
        if (div.is(":visible")) {
            setTimeout(() => {
                $('#manoTable').DataTable().columns.adjust().draw();
            }, 1);
        }
    });
});

$("#agregarServicioVehiculo").click(function() {
    abrirModalServicio(1);
});

async function obtenerVehiculo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const pkVehiculo = urlParams.get('vehiculo');

        const response = await fetch(`http://127.0.0.1:5000/coartmex/vehiculo?pkVehiculo=${pkVehiculo}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        document.getElementById('nombreVehiculo').textContent = data[0].nombreVehiculo;

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function listarServiciosVehiculo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const fkVehiculo = urlParams.get('vehiculo');

        const response = await fetch(`http://127.0.0.1:5000/coartmex/servicio_vehiculo?fkVehiculo=${fkVehiculo}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        let tabla = $('#servicioVehiculoTable').DataTable();
        tabla.clear().draw();

        tabla.rows.add(data.map(sv => [
            sv.numeroServicio, //0
            toformatearFecha(sv.fechaServicio), //1
            sv.nombreServicio, //2
            sv.nombreManoObra, //3
            sv.kilometrajeInicial, //4
            sv.kilometrajeFinal, //5
            sv.nombreLugarServicio, //6
            sv.numeroFactura,// 7
            sv.fkManoObra, //8
            sv.fkLugarServicio, //9
            sv.pkServicioVehiculo// 10
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarServicioVehiculo() {
    // Obtener los datos del formulario
    const urlParams = new URLSearchParams(window.location.search);
    const fkVehiculo = urlParams.get('vehiculo');

    const numeroServicio = document.getElementById('numeroServicio').value;
    const fechaServicio = document.getElementById('fechaIngreso').value;
    const nombreServicio = document.getElementById('nombreServicio').value;
    const fkManoObra = document.getElementById('mano_menu').value;
    const kilometrajeInicial = document.getElementById('kilometrajeInicial').value;
    const kilometrajeFinal = document.getElementById('kilometrajeFinal').value;
    const numeroFactura = document.getElementById('numeroFactura').value;
    const fkLugarServicio = document.getElementById('lugar_menu').value;


    // Verificar si los campos están completos
    if (!numeroServicio || !fechaServicio || !nombreServicio || !fkManoObra || !kilometrajeInicial || !kilometrajeFinal || !kilometrajeFinal || !numeroFactura || !fkLugarServicio || !fkVehiculo) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_vehiculo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroServicio, fechaServicio, nombreServicio, kilometrajeInicial, kilometrajeFinal, numeroFactura, fkLugarServicio, fkManoObra, fkVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        listarServiciosVehiculo();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarServicioVehiculo(pkServicioVehiculo) {
    const urlParams = new URLSearchParams(window.location.search);
    const fkVehiculo = urlParams.get('vehiculo');

    const numeroServicio = document.getElementById('numeroServicio').value;
    const fechaServicio = document.getElementById('fechaIngreso').value;
    const nombreServicio = document.getElementById('nombreServicio').value;
    const fkManoObra = document.getElementById('mano_menu').value;
    const kilometrajeInicial = document.getElementById('kilometrajeInicial').value;
    const kilometrajeFinal = document.getElementById('kilometrajeFinal').value;
    const numeroFactura = document.getElementById('numeroFactura').value;
    const fkLugarServicio = document.getElementById('lugar_menu').value;

    // Verificar si los campos están completos
    if (!pkServicioVehiculo || !numeroServicio || !fechaServicio || !nombreServicio || !fkManoObra || !kilometrajeInicial || !kilometrajeFinal || !kilometrajeFinal || !numeroFactura || !fkLugarServicio || !fkVehiculo) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_vehiculo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkServicioVehiculo, numeroServicio, fechaServicio, nombreServicio, kilometrajeInicial, kilometrajeFinal, numeroFactura, fkLugarServicio, fkManoObra, fkVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-1').modal('hide');

        listarServiciosVehiculo();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarServicioVehiculo(pkServicioVehiculo) {
    if (!pkServicioVehiculo) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_vehiculo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkServicioVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarServiciosVehiculo();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalServicio(modo, pkServicioVehiculo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar vehiculo';
        modalButton.setAttribute('onclick', 'agregarServicioVehiculo()');
        
        document.getElementById('numeroServicio').value = '';
        document.getElementById('fechaIngreso').value = '';
        document.getElementById('nombreServicio').value = '';
        document.getElementById('mano_menu').value = '';
        document.getElementById('kilometrajeInicial').value = '';
        document.getElementById('kilometrajeFinal').value = '';
        document.getElementById('numeroFactura').value = '';
        document.getElementById('lugar_menu').value = '';


    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar vehiculo';
        modalButton.setAttribute('onclick', `editarServicioVehiculo('${pkServicioVehiculo}')`);

    }

}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC' // evita conversión a hora local
    });
}

function transformarFecha(fechaTexto) {
    // Convertir texto con nombre del mes en español a una fecha Date válida
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaTexto);

    // Si la conversión directa falla (porque `new Date("martes, 11 de junio de 2024")` no funciona),
    // entonces debemos hacer parsing manual:
    const partes = fechaTexto
        .replace(',', '')              // quitar coma
        .split(' ')                    // separar por espacios
        .filter(p => p);               // quitar espacios vacíos

    // partes esperadas: ["martes", "11", "de", "junio", "de", "2024"]
    const dia = partes[1];
    const mesTexto = partes[3].toLowerCase();
    const año = partes[5];

    // Mapa de meses en español a número
    const meses = {
        enero: "01", febrero: "02", marzo: "03", abril: "04",
        mayo: "05", junio: "06", julio: "07", agosto: "08",
        septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
    };

    const mes = meses[mesTexto];

    if (!mes) return null;

    return `${año}-${mes}-${dia.padStart(2, '0')}`;
}
