$(document).ready(function () {

    listarNumerosEmergencia();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#numerosEmergenciaTable').DataTable({
        columns: [
            { title: "Numero" },
            { title: "Empleado" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                     return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[9]}" data-nombre="${row[2]}">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    

    // Event listeners para los botones 
    // Editar
    $('#numerosEmergenciaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const numeroEmergencia = rowData[0];
        const pkNumeroEmergencia = rowData[1];


        document.getElementById('numeroEmergencia').value = numeroEmergencia;


        abrirModal(2,pkNumeroEmergencia)

    });

    // Eliminar
    $('#numerosEmergenciaTable').on('click', '.eliminar-btn', function () {


        const pkNumeroEmergencia = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkNumeroEmergencia);
        });
        
    });

});

function agregarNumerosEmergencia(){

    // Obtener los datos del formulario
    const numeroEmergencia = document.getElementById('numeroEmergencia').value.trim();


    // Verificar si ambos campos están completos
    if (!numeroEmergencia) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/numeros_emergencia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numeroEmergencia })
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

function listarNumerosEmergencia() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/numeros_emergencia', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#numerosEmergenciaTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((numeroEmergencia) => [

            numeroEmergencia.numeroEmergencia, numeroEmergencia.nombreEmpleado, numeroEmergencia.pkNumeroEmergencia

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarNumerosEmergencia(pkNumeroEmergencia){

    //Obtener valores del formulario
    const numeroEmergencia = document.getElementById('numeroEmergencia').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkNumeroEmergencia || !numeroEmergencia) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/numeros_emergencia', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkNumeroEmergencia, numeroEmergencia })
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

function eliminarNumerosEmergencia(pkNumeroEmergencia){

    // Verificar si llega el id
    if (!pkNumeroEmergencia) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/numeros_emergencia', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkNumeroEmergencia })
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

function abrirModal(modo, pkNumeroEmergencia) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar país';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('numeroEmergencia').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar país';
        modalButton.setAttribute('onclick', `editar(${pkNumeroEmergencia})`);

    }

}


