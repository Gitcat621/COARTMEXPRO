$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarSociosComerciales();
    listarGrupos();
});

//Listar los registros foraneos
function listarGrupos(){

    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('grupo_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkGrupoSocio}">${data.nombreGrupoSocio}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('grupo_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#socioTable').DataTable({
        columns: [
            { title: "Nombre del socio" },
            { title: "Razon social" },
            { title: "Grupo" },
            { title: "Pueblo / Ciudad" },
            { title: "Estado" },
            { title: "Pais" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[11]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
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
        const fkGrupoSocio = rowData[6];
        const fkUbicacion = rowData[7];
        const pkPuebloCiudad = rowData[8];
        const pkEstado = rowData[9];
        const pkPais = rowData[10];
        const pkSocioComercial = rowData[11];

        console.log(pkPuebloCiudad);
        console.log(pkEstado);
        console.log(pkPais);

        document.getElementById('nombreSocio').value = nombreSocio;
        document.getElementById('razonSocial').value = razonSocial;
        document.getElementById('grupo_menu').value = fkGrupoSocio;

        document.getElementById('ubicacion_menu').value = fkUbicacion;

        $('#pueblosCiudades_menu').val([pkPuebloCiudad]).trigger('change');
        $('#estados_menu').val([pkEstado]).trigger('change');
        $('#paises_menu').val([pkPais]).trigger('change');

      

        abrirModal(2,pkSocioComercial);
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

});

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

    // Verificar si los campos están completos
    if (!nombreSocio || !razonSocial || !fkGrupoSocio || !puebloCiudad  || !estado  || !pais ) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, puebloCiudad, estado, pais })
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

async function listarSociosComerciales() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();

        let tabla = $('#socioTable').DataTable();
        tabla.clear().draw();

        tabla.rows.add(data.map(sc => [
            sc.nombreSocio, //0 
            sc.razonSocial, //1
            sc.nombreGrupoSocio, //2 
            sc.nombrePuebloCiudad, //3
            sc.nombreEstado, //4
            sc.nombrePais, //5
            sc.fkGrupoSocio, //6
            sc.fkUbicacion, //7
            sc.pkPuebloCiudad, //8
            sc.pkEstado, //9
            sc.pkPais, //10
            sc.pkSocioComercial //11
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
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
            body: JSON.stringify({ pkSocioComercial, nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion, puebloCiudad, estado, pais })
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

function abrirModal(modo, pkSocioComercial) {

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

        $('#pueblosCiudades_menu').val(null).trigger('change');
        $('#estados_menu').val(null).trigger('change');
        $('#paises_menu').val(null).trigger('change');


    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar socio comercial';
        modalButton.setAttribute('onclick', `editarSocioComercial('${pkSocioComercial}')`);

    }

}


