$(document).ready(function () {

    listar();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#municipioTable').DataTable({
        columns: [
            { title: "Nombre del municipio" },
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
    $('#municipioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreMunicipio = rowData[0];
        const pkMunicipio = rowData[1];


        document.getElementById('nombreMunicipio').value = nombreMunicipio;


        abrirModal(2,pkMunicipio)

    });

    // Eliminar
    $('#municipioTable').on('click', '.eliminar-btn', function () {


        const pkMunicipio = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkMunicipio);
        });
        
    });

});

function agregar(){

    // Obtener los datos del formulario
    const nombreMunicipio = document.getElementById('nombreMunicipio').value.trim();


    // Verificar si ambos campos están completos
    if (!nombreMunicipio) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/municipios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreMunicipio })
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
    fetch('http://127.0.0.1:5000/coartmex/municipios', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#municipioTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((municipio) => [

            municipio.nombreMunicipio, municipio.pkMunicipio

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editar(pkMunicipio){

    //Obtener valores del formulario
    const nombreMunicipio = document.getElementById('nombreMunicipio').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkMunicipio || !nombreMunicipio) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/municipios', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkMunicipio, nombreMunicipio })
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

function eliminar(pkMunicipio){

    // Verificar si llega el id
    if (!pkMunicipio) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/municipios', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkMunicipio })
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

function abrirModal(modo, pkMunicipio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar municipio';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombreMunicipio').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar municipio';
        modalButton.setAttribute('onclick', `editar(${pkMunicipio})`);

    }

}


