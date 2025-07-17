$(document).ready(function () {

    //Inicializar datatable
    $('#visitaTable').DataTable({
        columns: [
            { title: "Tienda" },
            { title: "Observación", width: "30%" },
            { title: "Fecha de la visita", width: "21%" },
            {
                title: "Venta", width: "5%",
                render: function (data, type, row) {
                    const checked = data == 1 ? 'checked' : '';
                    return `
                        <div class="text-center">
                            <div class="checkbox circled success">
                                <input type="checkbox" ${checked} disabled>
                                <label></label>
                            </div>
                        </div>`;
                }
            },
            {
                title: "Servicio", width: "5%",
                render: function (data, type, row) {
                    const checked = data == 1 ? 'checked' : '';
                    return `
                        <div class="text-center">
                            <div class="checkbox circled success">
                                <input type="checkbox" ${checked} disabled>
                                <label></label>
                            </div>
                        </div>`;
                }
            },
            {
                title: "Opciones", width: "10%",
                render: function (data, type, row) {
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[6]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true
    });

    // Event listeners para los botones
    // Editar
    $('#visitaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreSocio = rowData[0];
        const observacion = rowData[1];
        const fechaVisita = transformarFecha(rowData[2]);
        const venta = rowData[3];
        const servicio = rowData[4];
        const fkSocioComercial = rowData[5];
        const pkVisitaTienda = rowData[6];

        document.getElementById('socio_menu').value = fkSocioComercial;
        document.getElementById('observacion').value = observacion;
        document.getElementById('fechaIngreso').value = fechaVisita;
        // Marcar o desmarcar los checkboxes
        document.getElementById('checkbox-circled-8').checked = venta == 1;
        document.getElementById('checkbox-circled-9').checked = servicio == 1;      

        abrirModalVisita(2,pkVisitaTienda);
    });

    // Eliminar
    $('#visitaTable').on('click', '.eliminar-btn', function () {

        const pkVisitaTienda = $(this).data('pk');
        const nombreSocio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreSocio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarVisita(pkVisitaTienda);    
            }
        });
        
    });

    listarVisitas();
    
});



//Asignar funcion al boton de abrir modal
$("#agregarVisita").click(function() {
    abrirModalVisita(1);
});

async function listarVisitas() {
    try {
        const response = await fetch('/api/visitas_tienda', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        let tabla = $('#visitaTable').DataTable();
        tabla.clear().draw();

        tabla.rows.add(data.map(v => [
            v.nombreSocio,
            v.observacion,
            toformatearFecha(v.fechaVisita),
            v.venta,
            v.servicio,
            v.fkSocioComercial,
            v.pkVisitaTienda
        ])).draw();
    } catch (error) {
        toastr.error('Hubo un error al listar las visitas', 'Error', { "closeButton": true });
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarVisita() {
    // Obtener los datos del formulario
    const fkSocioComercial = document.getElementById('socio_menu').value;
    const observacion = document.getElementById('observacion').value.trim();
    const fechaVisita = document.getElementById('fechaIngreso').value;
    const venta = $('#checkbox-circled-8').is(':checked') ? 1 : 0;
    const servicio = $('#checkbox-circled-9').is(':checked') ? 1 : 0;

    // Verificar si los campos están completos
    if (!observacion || !fechaVisita || !fkSocioComercial) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }
    
    console.log(observacion);
    console.log(fechaVisita);
    console.log(venta);
    console.log(servicio);
    console.log(fkSocioComercial);

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('/api/visitas_tienda', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observacion, fechaVisita, venta, servicio, fkSocioComercial })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        listarVisitas();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarVisita(pkVisitaTienda) {
    const fkSocioComercial = document.getElementById('socio_menu').value;
    const observacion = document.getElementById('observacion').value.trim();
    const fechaVisita = document.getElementById('fechaIngreso').value;
    const venta = $('#checkbox-circled-8').is(':checked') ? 1 : 0;
    const servicio = $('#checkbox-circled-9').is(':checked') ? 1 : 0;

    // Verificar si los campos están completos
    if (!observacion || !fechaVisita || !fkSocioComercial) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('/api/visitas_tienda', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkVisitaTienda, observacion, fechaVisita, venta, servicio, fkSocioComercial })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-1').modal('hide');

        listarVisitas();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarVisita(pkVisitaTienda) {
    if (!pkVisitaTienda) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('/api/visitas_tienda', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkVisitaTienda })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarVisitas();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalVisita(modo, pkVisitaTienda) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar socio comercial';
        modalButton.setAttribute('onclick', 'agregarVisita()');
        
        document.getElementById('socio_menu').value = '';
        document.getElementById('observacion').value = '';
        document.getElementById('fechaIngreso').value = '';


    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar socio comercial';
        modalButton.setAttribute('onclick', `editarVisita('${pkVisitaTienda}')`);

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
