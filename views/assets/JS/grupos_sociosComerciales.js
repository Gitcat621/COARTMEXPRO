$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarGruposSocios();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#grupoTable').DataTable({
        columns: [
            { title: "Nombre del grupo" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-sm editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-pk="${row[1]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ]
    });


    // Event listeners para los botones
    // Editar
    $('#grupoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreGrupoSocio = rowData[0];
        const pkGrupoSocio = rowData[1];


        document.getElementById('nombreGrupoSocio').value = nombreGrupoSocio;


        abrirModal(2,pkGrupoSocio);
    });

    // Eliminar
    $('#grupoTable').on('click', '.eliminar-btn', function () {

        const pkGrupoSocio = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarGrupoSocio(pkGrupoSocio);    
        });
        
    });
});

function agregarGrupoSocio(){

    // Obtener los datos del formulario
    const nombreGrupoSocio = document.getElementById('nombreGrupoSocio').value.trim();


    // Verificar si ambos campos están completos
    if (!nombreGrupoSocio) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreGrupoSocio })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarGruposSocios();

    })
    .catch(error => {
        //Imprimir errores
        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {
            "closeButton": true,
        });

        return;
    });
}

function listarGruposSocios() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#grupoTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((grupos) => [

            grupos.nombreGrupoSocio, grupos.pkGrupoSocio

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarGrupoSocio(pkGrupoSocio){

    //Obtener valores del formulario
    const nombreGrupoSocio = document.getElementById('nombreGrupoSocio').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkGrupoSocio || !nombreGrupoSocio) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkGrupoSocio, nombreGrupoSocio })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarGruposSocios();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});

    })
    .catch(error => {

        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function eliminarGrupoSocio(pkGrupoSocio){

    // Verificar si llega el id
    if (!pkGrupoSocio) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkGrupoSocio })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarGruposSocios();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});

        
        return;
    });
}

function abrirModal(modo, pkGrupoSocio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar area';
        modalButton.setAttribute('onclick', 'agregarGrupoSocio()');

        document.getElementById('nombreGrupoSocio').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar area';
        modalButton.setAttribute('onclick', `editarGrupoSocio(${pkGrupoSocio})`);

    }

}


