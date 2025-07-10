var tabla;

$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'REABASTO' && sessionStorage.getItem("departamento") !== 'DIRECCION COMERCIAL') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }

    //Inicializar datatable
    $('#rutaTable').DataTable({
        ordering: false,
        columns: [
            { title: "Empleado", width: "20%" },
            { title: "Destino", width: "12%" },
            { title: "Dia", width: "12%" },
            { title: "Tiendas" },
            {
                title: "Opciones", width: "10%",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[6]}" data-nombre="${row[2]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    // Editar
    $('#rutaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const fechaRuta = transformarFecha(rowData[2]);
        const fkZonaRuta = rowData[4];
        const numeroEmpleado = rowData[5];
       
        const pkRuta = rowData[6];

        document.getElementById('fechaNacimiento').value = fechaRuta;
        document.getElementById('zona_menu').value = fkZonaRuta;
        document.getElementById('pkRuta').value = pkRuta;

        abrirModalRuta(2,pkRuta);

        chatGtp(fkZonaRuta,pkRuta);
    });

    // Eliminar
    $('#rutaTable').on('click', '.eliminar-btn', function () {

        const pkRuta = $(this).data('pk');
        const fechaRuta = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a la ruta del ${fechaRuta}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarRuta(pkRuta);    
            }
        });
        
    });

    tabla = $('#tiendaTable').DataTable({
        destroy: true,
        columns: [
            {
                title: "Seleccionar",
                render: function (data, type, row, meta) {
                    const checkboxId = `checkbox-socio-${meta.row}`;
                    const checked = data.checked ? 'checked' : '';
                    return `<div class="text-center">
                                <div class="checkbox circled primary">
                                    <input type="checkbox" id="${checkboxId}" class="checkbox-socio" data-index="${meta.row}" data-pk="${data.pk}" ${checked}>
                                    <label for="${checkboxId}"></label>
                                </div>
                            </div>`;
                }
            },
            { title: "Nombre del socio", width: "70%" },
            { title: "Grupo", width: "30%" }
        ],
        scrollX: true,
        pageLength: 10
    });




    listarRutas();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarRuta").click(function() {
    abrirModalRuta(1);
});

document.getElementById('busqueda').addEventListener('click', () => {

    listarRutas();

});

function obtenerSociosSeleccionados() {
    const seleccionados = [];
    $('.checkbox-socio:checked').each(function () {
        seleccionados.push(Number(this.dataset.pk));
    });
    return seleccionados;
}


const zonaSelect = document.getElementById("zona_menu");

zonaSelect.addEventListener("change", function () {
    const valorSeleccionado = this.value;
    let pkRuta = document.getElementById('pkRuta').value;
    if(!pkRuta){
        pkRuta = 0;
    }
    chatGtp(valorSeleccionado,pkRuta);
});

async function chatGtp(fkZonaRuta,pkRuta) {

    const [tiendasResponse, destinosResponse] = await Promise.all([
    fetch(`http://127.0.0.1:5000/coartmex/tiendas?fkZonaRuta=${fkZonaRuta}`),
    fetch(`http://127.0.0.1:5000/coartmex/destinos?pkRuta=${pkRuta}`)
    ]);

    const tiendas = await tiendasResponse.json();
    const destinos = await destinosResponse.json();

    if (!tiendasResponse.ok || !destinosResponse.ok) {
        toastr.error(`Error al obtener datos`, 'Error', {"closeButton": true});
        return;
    }

    const sociosMarcados = new Set(destinos.map(d => d.fkSocioComercial));

    let tabla = $('#tiendaTable').DataTable();
    tabla.clear().draw();

    tabla.rows.add(tiendas.map((r, index) => {
        const isChecked = sociosMarcados.has(r.pkSocioComercial);
        return [
            { pk: r.pkSocioComercial, checked: isChecked }, // columna 0: objeto
            r.nombreSocio,                                   // columna 1
            r.nombreGrupoSocio                               // columna 2
        ];
    })).draw();


    
}



async function listarTiendas(fkZonaRuta) {
    try {

        const response = await fetch(`http://127.0.0.1:5000/coartmex/tiendas?fkZonaRuta=${fkZonaRuta}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{
            let tabla = $('#tiendaTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(r => [
                r.pkSocioComercial,
                r.nombreSocio,
                r.nombreGrupoSocio
            ])).draw();
        }catch{
            console.log('No hay tabla');
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function listarDestinosEmpleado(pkRuta) {
    try {

        const response = await fetch(`http://127.0.0.1:5000/coartmex/destinos?pkRuta=${pkRuta}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        // try{
        //     let tabla = $('#rutaTable').DataTable();
        //     tabla.clear().draw();

        //     tabla.rows.add(data.map(r => [
        //         r.nombreEmpleado,
        //         r.nombreZonaRuta,                
        //         toformatearFechaRuta(r.fechaRuta),
        //         r.tiendas,
        //         r.fkZonaRuta,
        //         r.numeroEmpleado,
        //         r.pkRuta
        //     ])).draw();
        // }catch{
        //     console.log('No hay tabla');
        // }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function listarRutas() {
    try {

        let fechaRuta = document.getElementById('fechaIngreso').value.trim();
        let consulta  = 1;
        // Si está vacío, nulo o undefined, asignamos la fecha actual
        if (!fechaRuta) {
            consulta = 0;
        }

        const response = await fetch(`http://127.0.0.1:5000/coartmex/rutas?fechaRuta=${fechaRuta}&consulta=${consulta}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        try{
            let tabla = $('#rutaTable').DataTable();
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
            console.log('No hay tabla');
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarRuta() {
    try {

        const fechaRuta = document.getElementById('fechaNacimiento').value.trim();

        const fkEmpleado = sessionStorage.getItem("ID");

        const tiendas = obtenerSociosSeleccionados();

        if (!fechaRuta || !fkEmpleado || !tiendas) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/rutas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fechaRuta, fkEmpleado, tiendas })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        await listarRutas();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarRuta(pkRuta) {
    try {
        const fechaRuta = document.getElementById('fechaNacimiento').value.trim();

        const fkEmpleado = sessionStorage.getItem("ID");

        const tiendas = obtenerSociosSeleccionados();

        if (!pkRuta ||!fechaRuta || !fkEmpleado || !tiendas) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/rutas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkRuta, fechaRuta, fkEmpleado, tiendas })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        await listarRutas();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarRuta(pkRuta) {
    try {
        if (!pkRuta) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/rutas', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkRuta })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarRutas();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

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

function abrirModalRuta(modo, pkZonaRuta) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel1');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    setTimeout(() => {
        tabla.columns.adjust().draw();
    }, 222);

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar ruta';
        modalButton.setAttribute('onclick', 'agregarRuta()');

        document.getElementById('fechaNacimiento').value = '';
        document.getElementById('zona_menu').value = '';
        document.getElementById('pkRuta').value = '';

        $('.checkbox-socio').prop('checked', false);
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar ruta';
        modalButton.setAttribute('onclick', `editarRuta(${pkZonaRuta})`);

    }

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