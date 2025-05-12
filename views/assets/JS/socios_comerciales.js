$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarSociosComerciales();
    listarGrupos();
    listarUbicaciones();
    
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

function listarUbicaciones(){

    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('ubicacion_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkUbicacion}">${data.nombrePuebloCiudad} - ${data.nombreMunicipio} - ${data.nombreEstado} </option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('ubicacion_menu').innerHTML += HTML;


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
            // { title: "Codigo postal" },
            // { title: "Pueblo / Ciudad" },
            // { title: "Municipio" },
            // { title: "Estado" },
            // { title: "Pais" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[15]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
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
        const fkGrupoSocio = rowData[8];
        const fkUbicacion = rowData[9];
        const pkSocioComercial = rowData[15];

        document.getElementById('nombreSocio').value = nombreSocio;
        document.getElementById('razonSocial').value = razonSocial;
        document.getElementById('grupo_menu').value = fkGrupoSocio;
        document.getElementById('ubicacion_menu').value = fkUbicacion;

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

function agregarSocioComercial(){

    // Obtener los datos del formulario
    const nombreSocio = document.getElementById('nombreSocio').value;


    const razonSocial = document.getElementById('razonSocial').value;


    const grupoMenu = document.getElementById('grupo_menu');


    const fkGrupoSocio = grupoMenu.value;


    const ubicacionMenu = document.getElementById('ubicacion_menu');


    const fkUbicacion = ubicacionMenu.value;


    // Verificar si ambos campos están completos
    if (!nombreSocio || !razonSocial || !fkGrupoSocio || !fkUbicacion) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});


        return;
    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });


        // Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarSociosComerciales();


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function listarSociosComerciales() {

    //Peticion GET al servidor
    fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#socioTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((sc) => [
//                  0               1               2                   3                   4                   5                   6               7
            sc.nombreSocio, sc.razonSocial, sc.nombreGrupoSocio, sc.codigoPostal, sc.nombrePuebloCiudad, sc.nombreMunicipio, sc.nombreEstado, sc.nombrePais,
//                      8           9               10                  11              12              13          14              15
            sc.fkGrupoSocio, sc.fkUbicacion, sc.pkCodigoPostal, sc.pkPuebloCiudad, sc.pkMunicipio, sc.pkEstado, sc.pkPais, sc.pkSocioComercial

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarSocioComercial(pkSocioComercial){

    // Obtener los datos del formulario
    const nombreSocio = document.getElementById('nombreSocio').value;


    const razonSocial = document.getElementById('razonSocial').value;


    const grupoMenu = document.getElementById('grupo_menu');


    const fkGrupoSocio = grupoMenu.value;


    const ubicacionMenu = document.getElementById('ubicacion_menu');


    const fkUbicacion = ubicacionMenu.value;


    // Verificar si ambos campos están completos
    if (!pkSocioComercial || !nombreSocio || !razonSocial || !fkGrupoSocio || !fkUbicacion) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkSocioComercial, nombreSocio, razonSocial, fkGrupoSocio, fkUbicacion })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarSociosComerciales();
        
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;
    });
}

function eliminarSocioComercial(pkSocioComercial){

    // Verificar si llega el id
    if (!pkSocioComercial) {


        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkSocioComercial })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarSociosComerciales();

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});
        return;

    });
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
        document.getElementById('ubicacion_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar socio comercial';
        modalButton.setAttribute('onclick', `editarSocioComercial('${pkSocioComercial}')`);

    }

}


