$(document).ready(function () {

    listar();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#codigoTable').DataTable({
        columns: [
            { title: "Codigo postal" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-sm editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-pk="${row[1]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    

    // Event listeners para los botones 
    // Editar
    $('#codigoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const codigoPostal = rowData[0];
        const pkCodigoPostal = rowData[1];


        document.getElementById('codigoPostal').value = codigoPostal;


        abrirModal(2,pkCodigoPostal)

    });

    // Eliminar
    $('#codigoTable').on('click', '.eliminar-btn', function () {


        const pkCodigoPostal = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkCodigoPostal);
        });
        
    });

});

function agregar(){

    // Obtener los datos del formulario
    const codigoPostal = document.getElementById('codigoPostal').value.trim();


    // Verificar si ambos campos están completos
    if (!codigoPostal) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoPostal })
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
    fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#codigoTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((cp) => [

            cp.codigoPostal, cp.pkCodigoPostal

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editar(pkCodigoPostal){

    //Obtener valores del formulario
    const codigoPostal = document.getElementById('codigoPostal').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkCodigoPostal || !codigoPostal) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkCodigoPostal, codigoPostal })
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

function eliminar(pkCodigoPostal){

    // Verificar si llega el id
    if (!pkCodigoPostal) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkCodigoPostal })
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

function abrirModal(modo, pkCodigoPostal) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar municipio';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('codigoPostal').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar municipio';
        modalButton.setAttribute('onclick', `editar(${pkCodigoPostal})`);

    }

}


