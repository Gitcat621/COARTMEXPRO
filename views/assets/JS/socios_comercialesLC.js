$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'REABASTO' && sessionStorage.getItem("departamento") !== 'DIRECCION COMERCIAL') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }

    //Inicializar datatable
    $('#socioTable').DataTable({
        columns: [
            { title: "Nombre del socio" },
            { title: "Razon social" },
            { title: "Grupo" },
            { title: "Pueblo / Ciudad" },
            { title: "Estado" },
            { title: "Pais" },
            { title: "Zona de ruta" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xss articulos-btn" data-lista='${row[13]}'><i class="fa fa-list"></i> <i class="fa fa-dollar"></i> </button>
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[13]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    // Editar
    $('#socioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreSocio = rowData[0];
        const razonSocial = rowData[1];
        const nombrePuebloCiudad = rowData[3];
        const nombreEstado = rowData[4];
        const nombrePais = rowData[5];
        const nombreZonaRuta = rowData[6];
        const fkGrupoSocio = rowData[7];
        const fkUbicacion = rowData[8];
        const pkPuebloCiudad = rowData[9];
        const pkEstado = rowData[10];
        const pkPais = rowData[11];
        const pkZonaRuta = rowData[12];
        const pkSocioComercial = rowData[13];

        console.log(pkPuebloCiudad);
        console.log(pkEstado);
        console.log(pkPais);

        console.log(nombreZonaRuta);
        console.log(pkZonaRuta);

        document.getElementById('nombreSocio').value = nombreSocio;
        document.getElementById('razonSocial').value = razonSocial;
        document.getElementById('grupo_menu').value = fkGrupoSocio;
        document.getElementById('zona_menu').value = pkZonaRuta;

        document.getElementById('ubicacion_menu').value = fkUbicacion;

        $('#pueblosCiudades_menu').val([pkPuebloCiudad]).trigger('change');
        $('#estados_menu').val([pkEstado]).trigger('change');
        $('#paises_menu').val([pkPais]).trigger('change');

      

        abrirModalSocio(2,pkSocioComercial);
    });

    // Eliminar
    $('#socioTable').on('click', '.eliminar-btn', function () {

        const pkSocioComercial = $(this).data('pk');
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
                eliminarSocioComercial(pkSocioComercial);    
            }
        });
        
    });

    listarSociosComerciales();
    
});


$("#switch-4").click(function () {
    const div = $("#grupos");
    
    div.slideToggle(500, function () {
        if (div.is(":visible")) {
            setTimeout(() => {
                $('#grupoTable').DataTable().columns.adjust().draw();
            }, 1);
        }
    });
});

$("#switch-5").click(function () {
    const div = $("#zonas");
    
    div.slideToggle(500, function () {
        if (div.is(":visible")) {
            setTimeout(() => {
                $('#zonaTable').DataTable().columns.adjust().draw();
            }, 1);
        }
    });
});

$(document).on('click', '.articulos-btn', function () {
    const listaID = $(this).data('lista'); // o this.dataset.lista
    window.location.href = `./lista_precios.html?lista=${encodeURIComponent(listaID)}`;
});


//Asignar funcion al boton de abrir modal
$("#agregarSocio").click(function() {
    abrirModalSocio(1);
});

async function listarSociosComerciales() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{
            let tabla = $('#socioTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(sc => [
                sc.nombreSocio, //0 
                sc.razonSocial, //1
                sc.nombreGrupoSocio, //2 
                sc.nombrePuebloCiudad, //3
                sc.nombreEstado, //4
                sc.nombrePais, //5
                sc.nombreZonaRuta,//6
                sc.fkGrupoSocio, //7
                sc.fkUbicacion, //8
                sc.pkPuebloCiudad, //9
                sc.pkEstado, //10
                sc.pkPais, //11
                sc.pkZonaRuta, //12
                sc.pkSocioComercial //13
            ])).draw();
        }catch{
            console.log('No hay tabla para: Socios comerciales');
        }

        try{

            const select = document.getElementById('socio_menu');
            select.innerHTML = "";

            data.forEach(s => {

                let option = document.createElement('option');
                option.value = s.pkSocioComercial;
                option.textContent = s.nombreSocio;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Socios comerciales')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarSocioComercial() {
    // Obtener los datos del formulario
    const nombreSocio = document.getElementById('nombreSocio').value.trim();
    const razonSocial = document.getElementById('razonSocial').value.trim();
    const fkGrupoSocio = document.getElementById('grupo_menu').value;
    const fkUbicacion = null;

    const ciudad_menu = document.getElementById('pueblosCiudades_menu');
    const ciudadSeleccionada = Array.from(ciudad_menu.selectedOptions).map(option => option.value);

    const estado_menu = document.getElementById('estados_menu');
    const estadoSeleccionada = Array.from(estado_menu.selectedOptions).map(option => option.value);

    const pais_menu = document.getElementById('paises_menu');
    const paisSeleccionado = Array.from(pais_menu.selectedOptions).map(option => option.value);

    const fkZonaRuta = document.getElementById('zona_menu').value;

    if (ciudadSeleccionada.length > 1 || estadoSeleccionada.length > 1 || paisSeleccionado.length > 1) {
        let mensaje = ciudadSeleccionada.length > 1 
            ? "Selecciona solo una ciudad o pueblo" 
            : estadoSeleccionada.length > 1 
            ? "Selecciona solo un estado" 
            : "Selecciona solo un país";

        toastr.warning(mensaje, 'Atención', {"closeButton": true});
        return;
    }

    const puebloCiudad = ciudadSeleccionada[0];
    const estado = estadoSeleccionada[0];
    const pais = paisSeleccionado[0];    

    // Verificar si los campos están completos
    if (!nombreSocio || !razonSocial || !fkGrupoSocio  || !fkZonaRuta || !puebloCiudad  || !estado  || !pais) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }
    
    console.log(nombreSocio);
    console.log(razonSocial);
    console.log(fkGrupoSocio);
    console.log(fkZonaRuta);
    console.log(puebloCiudad);
    console.log(estado);
    console.log(pais);


    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreSocio, razonSocial, fkGrupoSocio, fkZonaRuta, fkUbicacion, puebloCiudad, estado, pais })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        listarSociosComerciales();
        listarPueblosCiudades();
        listarEstados();
        listarPaises();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarSocioComercial(pkSocioComercial) {
    const nombreSocio = document.getElementById('nombreSocio').value.trim();
    const razonSocial = document.getElementById('razonSocial').value.trim();
    const fkGrupoSocio = document.getElementById('grupo_menu').value;
    const fkUbicacion = document.getElementById('ubicacion_menu').value;

    const ciudad_menu = document.getElementById('pueblosCiudades_menu');
    const ciudadSeleccionada = Array.from(ciudad_menu.selectedOptions).map(option => option.value);

    const estado_menu = document.getElementById('estados_menu');
    const estadoSeleccionada = Array.from(estado_menu.selectedOptions).map(option => option.value);

    const pais_menu = document.getElementById('paises_menu');
    const paisSeleccionado = Array.from(pais_menu.selectedOptions).map(option => option.value);

    const fkZonaRuta = document.getElementById('zona_menu').value;

    if (ciudadSeleccionada.length > 1 || estadoSeleccionada.length > 1 || paisSeleccionado.length > 1) {
        let mensaje = ciudadSeleccionada.length > 1 
            ? "Selecciona solo una ciudad o pueblo" 
            : estadoSeleccionada.length > 1 
            ? "Selecciona solo un estado" 
            : "Selecciona solo un país";

        toastr.warning(mensaje, 'Atención', {"closeButton": true});
        return;
    }

    puebloCiudad = ciudadSeleccionada[0];
    estado = estadoSeleccionada[0];
    pais = paisSeleccionado[0];

    if (!pkSocioComercial || !nombreSocio || !razonSocial || !fkGrupoSocio || !puebloCiudad || !estado || !pais) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkSocioComercial, nombreSocio, razonSocial, fkGrupoSocio, fkZonaRuta, fkUbicacion, puebloCiudad, estado, pais })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-1').modal('hide');

        listarSociosComerciales();
        listarPueblosCiudades();
        listarEstados();
        listarPaises();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarSocioComercial(pkSocioComercial) {
    if (!pkSocioComercial) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkSocioComercial })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarSociosComerciales();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalSocio(modo, pkSocioComercial) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar socio comercial';
        modalButton.setAttribute('onclick', 'agregarSocioComercial()');
        
        document.getElementById('nombreSocio').value = '';
        document.getElementById('razonSocial').value = '';
        document.getElementById('grupo_menu').value = '';
        document.getElementById('zona_menu').value = '';

        $('#pueblosCiudades_menu').val(null).trigger('change');
        $('#estados_menu').val(null).trigger('change');
        $('#paises_menu').val(null).trigger('change');


    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar socio comercial';
        modalButton.setAttribute('onclick', `editarSocioComercial('${pkSocioComercial}')`);

    }

}
