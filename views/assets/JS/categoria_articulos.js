$(document).ready(function () {

    listarCategoriaArticulos();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#categoriaArticuloTable').DataTable({
        columns: [
            { title: "Nombre de la categoria" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-sm editar-btn" data-row='${JSON.stringify(row)}'>Editar <i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-pk="${row[1]}">Eliminar <i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ]
    });

    

    // Event listeners para los botones 
    // Editar
    $('#categoriaArticuloTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreCategoriaArticulo = rowData[0];

        const pkCategoriaArticulo = rowData[1];


        document.getElementById('nombreCategoriaArticulo').value = nombreCategoriaArticulo;


        abrirModal(2,pkCategoriaArticulo)

    });

    // Eliminar
    $('#categoriaArticuloTable').on('click', '.eliminar-btn', function () {


        const pkCategoriaArticulo = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminarCategoriaArticulos(pkCategoriaArticulo);
        });
        
    });

});

function agregarCategoriaArticulos(){

    // Obtener los datos del formulario
    const nombreCategoriaArticulo = document.getElementById('nombreCategoriaArticulo').value.trim();


    // Verificar si ambos campos están completos
    if (!nombreCategoriaArticulo) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreCategoriaArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarCategoriaArticulos();

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

function listarCategoriaArticulos() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#categoriaArticuloTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((categoriaArticulos) => [

            categoriaArticulos.nombreCategoriaArticulo, categoriaArticulos.pkCategoriaArticulo

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarCategoriaArticulos(pkCategoriaArticulo){

    //Obtener valores del formulario
    const nombreCategoriaArticulo = document.getElementById('nombreCategoriaArticulo').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkCategoriaArticulo || !nombreCategoriaArticulo) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkCategoriaArticulo, nombreCategoriaArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarCategoriaArticulos();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});

    })
    .catch(error => {

        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function eliminarCategoriaArticulos(pkCategoriaArticulo){

    // Verificar si llega el id
    if (!pkCategoriaArticulo) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkCategoriaArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarCategoriaArticulos();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});

        
        return;
    });
}

function abrirModal(modo, pkCategoriaArticulo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar categoriaArticulos';
        modalButton.setAttribute('onclick', 'agregarCategoriaArticulos()');

        document.getElementById('nombreCategoriaArticulo').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar categoriaArticulos';
        modalButton.setAttribute('onclick', `editarCategoriaArticulos(${pkCategoriaArticulo})`);

    }

}


