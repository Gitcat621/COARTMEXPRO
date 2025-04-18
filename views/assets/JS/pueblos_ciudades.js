$(document).ready(function () {

    listar();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#puebloCiudadTable').DataTable({
        columns: [
            { title: "Nombre del Pueblo / Ciudad" },
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
    $('#puebloCiudadTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePuebloCiudad = rowData[0];
        const pkPuebloCiudad = rowData[1];


        document.getElementById('nombrePuebloCiudad').value = nombrePuebloCiudad;

        abrirModal(2,pkPuebloCiudad)

    });

    // Eliminar
    $('#puebloCiudadTable').on('click', '.eliminar-btn', function () {


        const pkPuebloCiudad = $(this).data('pk');


        //Activar y escuchar la confirmacion del remodal
        var modal = $('[data-remodal-id="remodal"]').remodal();


        modal.open();


        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkPuebloCiudad);
        });
        
    });

});

function agregar(){

    // Obtener los datos del formulario
    const nombrePuebloCiudad = document.getElementById('nombrePuebloCiudad').value.trim();


    // Verificar si ambos campos están completos
    if (!nombrePuebloCiudad) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombrePuebloCiudad })
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
    fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#puebloCiudadTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((pc) => [

            pc.nombrePuebloCiudad, pc.pkPuebloCiudad

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editar(pkPuebloCiudad){

    //Obtener valores del formulario
    const nombrePuebloCiudad = document.getElementById('nombrePuebloCiudad').value.trim();

    console.log(pkPuebloCiudad + nombrePuebloCiudad);

    // Verificar que ningún campo esté vacío
    if (!pkPuebloCiudad || !nombrePuebloCiudad) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkPuebloCiudad, nombrePuebloCiudad })
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

function eliminar(pkPuebloCiudad){

    // Verificar si llega el id
    if (!pkPuebloCiudad) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkPuebloCiudad })
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

function abrirModal(modo, pkPuebloCiudad) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar pueblo / ciudad';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombrePuebloCiudad').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar pueblo / ciudad';
        modalButton.setAttribute('onclick', `editar(${pkPuebloCiudad})`);

    }

}


