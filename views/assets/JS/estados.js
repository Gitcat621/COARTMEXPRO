$(document).ready(function () {

    listar();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#estadoTable').DataTable({
        columns: [
            { title: "Nombre del estado" },
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
    $('#estadoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreEstado = rowData[0];
        const pkEstado = rowData[1];


        document.getElementById('nombreEstado').value = nombreEstado;


        abrirModal(2,pkEstado)

    });

    // Eliminar
    $('#estadoTable').on('click', '.eliminar-btn', function () {


        const pkEstado = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkEstado);
        });
        
    });

});

function agregar(){

    // Obtener los datos del formulario
    const nombreEstado = document.getElementById('nombreEstado').value.trim();


    // Verificar si ambos campos están completos
    if (!nombreEstado) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/estados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreEstado })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listar();

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

function listar() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/estados', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#estadoTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((estado) => [

            estado.nombreEstado, estado.pkEstado

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editar(pkEstado){

    //Obtener valores del formulario
    const nombreEstado = document.getElementById('nombreEstado').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkEstado || !nombreEstado) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/estados', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkEstado, nombreEstado })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listar();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});

    })
    .catch(error => {

        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function eliminar(pkEstado){

    // Verificar si llega el id
    if (!pkEstado) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/estados', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkEstado })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listar();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});

        
        return;
    });
}

function abrirModal(modo, pkEstado) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar estado';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombreEstado').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar estado';
        modalButton.setAttribute('onclick', `editar(${pkEstado})`);

    }

}


