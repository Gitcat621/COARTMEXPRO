$(document).ready(function () {

    listarPaqueterias();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarPaqueteria").click(function() {
    abrirModalPaqueteria(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#paqueteriaTable').DataTable({
        columns: [
            { title: "Nombre del banco" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones 
    // Editar
    $('#paqueteriaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePaqueteria = rowData[0];
        const pkPaqueteria = rowData[1];


        document.getElementById('nombrePaqueteria').value = nombrePaqueteria;


        abrirModalPaqueteria(2,pkPaqueteria)

    });

    // Eliminar
    $('#paqueteriaTable').on('click', '.eliminar-btn', function () {


        const pkPaqueteria = $(this).data('pk');

        const nombrePaqueteria = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombrePaqueteria}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarPaqueterias(pkPaqueteria);
            }
        });

    });

});

function agregarPaqueteria(){

    // Obtener los datos del formulario
    const nombrePaqueteria = document.getElementById('nombrePaqueteria').value.trim();


    // Verificar si ambos campos están completos
    if (!nombrePaqueteria) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/paqueterias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombrePaqueteria })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-2').modal('hide');
        listarPaqueterias();

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

function listarPaqueterias() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/paqueterias', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        try{

            //Iniciar la datatable y asignarla a una variable
            let tabla = $('#paqueteriaTable').DataTable();
            
            // Limpiar la tabla antes de agregar nuevos datos
            tabla.clear().draw();

            // Agregar los nuevos datos
            tabla.rows.add(data.map((banco) => [

                banco.nombrePaqueteria, banco.pkPaqueteria

            ])).draw();

        }catch{
            console.log('No hay tabla para: Paqueterias')
        }

        try{
            const select = document.getElementById('paqueteria_menu');
            select.innerHTML = "";

            data.forEach(paq => {

                let option = document.createElement('option');
                option.value = paq.pkPaqueteria;
                option.textContent = paq.nombrePaqueteria;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Paqueterias')
        }

       
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarPaqueterias(pkPaqueteria){

    //Obtener valores del formulario
    const nombrePaqueteria = document.getElementById('nombrePaqueteria').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkPaqueteria || !nombrePaqueteria) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/paqueterias', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkPaqueteria, nombrePaqueteria })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarPaqueterias();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});

    })
    .catch(error => {

        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function eliminarPaqueterias(pkPaqueteria){

    // Verificar si llega el id
    if (!pkPaqueteria) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/paqueterias', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkPaqueteria })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarPaqueterias();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});

        
        return;
    });
}

function abrirModalPaqueteria(modo, pkPaqueteria) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar banco';
        modalButton.setAttribute('onclick', 'agregarPaqueteria()');

        document.getElementById('nombrePaqueteria').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar banco';
        modalButton.setAttribute('onclick', `editarPaqueterias(${pkPaqueteria})`);

    }

}


