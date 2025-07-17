$(document).ready(function () {

    
    //Inicializar datatable
    $('#envioTable').DataTable({
        columns: [
            { title: "Numero de guia" },
            { title: "Socio comercial" },
            { title: "Paqueteria" },
            { title: "Fecha" },
            {
            title: "Numero de cajas",
            render: function (data, type, row) {
                const cajas = data ? data : "Sin cajas"; // o usa "" si prefieres dejar vacío
                return `${cajas} , <button class="btn btn-xsxs btn-success cajas-btn"><i class="fa fa-plus"></i></button>`;
            }
        },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i> EDIT</button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[7]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i> ELIM</button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    $('#envioTable').on('click', '.cajas-btn', function () {

        const tabla = $('#envioTable').DataTable();
        const rowData = tabla.row($(this).closest('tr')).data();

        const numeroGuia = rowData[0];
        const pkEnvio = rowData[7];

        window.location.href = `./cajas?envio=${encodeURIComponent(pkEnvio)}`;
        
    });

    // Editar
    $('#envioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const numeroGuia = rowData[0];
        const nombreSocio = rowData[1];
        const nombrePaqueteria = rowData[2];
        const fechaEnvio = transformarFecha(rowData[3]);
        const numCajas = rowData[4];
        const fkSocioComercial = rowData[5];
        const fkPaqueteria = rowData[6];
        const pkEnvio = rowData[7];

        document.getElementById('numeroGuia').value = numeroGuia;
        document.getElementById('fechaIngreso').value = fechaEnvio;
        document.getElementById('socio_menu').value = fkSocioComercial;
        document.getElementById('paqueteria_menu').value = fkPaqueteria;

        abrirModalEnvio(2,pkEnvio);
    });

    // Eliminar
    $('#envioTable').on('click', '.eliminar-btn', function () {

        const pkEnvio = $(this).data('pk');
        const numeroGuia = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${numeroGuia}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarEnvio(pkEnvio);    
            }
        });
        
    });


    listarEnvios();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarEnvio").click(function() {
    abrirModalEnvio(1);
});


$("#switch-4").click(function () {
    const div = $("#paqueterias");
    
    div.slideToggle(500, function () {
        if (div.is(":visible")) {
            setTimeout(() => {
                $('#paqueteriaTable').DataTable().columns.adjust().draw();
            }, 1);
        }
    });
});

async function listarEnvios() {
    try {
        const response = await fetch('/api/envios', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{
            let tabla = $('#envioTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(sc => [
                sc.numeroGuia, //0 
                sc.nombreSocio, //1
                sc.nombrePaqueteria, //2 
                toformatearFecha(sc.fechaEnvio), //3
                sc.numCajas, //4
                sc.fkSocioComercial, //5
                sc.fkPaqueteria, //6
                sc.pkEnvio //7
            ])).draw();
        }catch{
            console.log('No hay tabla para: Envios');
        }

        try{

            const select = document.getElementById('envio_menu');
            select.innerHTML = "";

            data.forEach(s => {

                let option = document.createElement('option');
                option.value = s.pkEnvio;
                option.textContent = s.numeroGuia;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Envios')
        }

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarEnvio() {
    // Obtener los datos del formulario
    const numeroGuia = document.getElementById('numeroGuia').value.trim();
    const fechaEnvio = document.getElementById('fechaIngreso').value.trim();
    const fkPaqueteria = document.getElementById('paqueteria_menu').value;
    const fkSocioComercial = document.getElementById('socio_menu').value;
 

    // Verificar si los campos están completos
    if (!numeroGuia || !fechaEnvio || !fkSocioComercial || !fkPaqueteria ) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('/api/envios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroGuia, fechaEnvio, fkSocioComercial, fkPaqueteria })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        listarEnvios();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarEnvio(pkEnvio) {
    const numeroGuia = document.getElementById('numeroGuia').value.trim();
    const fechaEnvio = document.getElementById('fechaIngreso').value.trim();
    const fkPaqueteria = document.getElementById('paqueteria_menu').value;
    const fkSocioComercial = document.getElementById('socio_menu').value;
 

    // Verificar si los campos están completos
    if (!pkEnvio || !numeroGuia || !fechaEnvio || !fkSocioComercial || !fkPaqueteria ) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('/api/envios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkEnvio, numeroGuia, fechaEnvio, fkSocioComercial, fkPaqueteria })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-1').modal('hide');

        listarEnvios();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarEnvio(pkEnvio) {
    if (!pkEnvio) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('/api/envios', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkEnvio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarEnvios();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalEnvio(modo, pkEnvio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar socio comercial';
        modalButton.setAttribute('onclick', 'agregarEnvio()');
        
        document.getElementById('numeroGuia').value = '';
        document.getElementById('fechaIngreso').value = '';
        document.getElementById('socio_menu').value = '';
        document.getElementById('paqueteria_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar socio comercial';
        modalButton.setAttribute('onclick', `editarEnvio('${pkEnvio}')`);

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


