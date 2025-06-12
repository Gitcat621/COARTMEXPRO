$(document).ready(function () {

    listarBancos();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarBanco").click(function() {
    abrirModalBanco(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#bancoTable').DataTable({
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
    $('#bancoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreBanco = rowData[0];
        const pkBanco = rowData[1];


        document.getElementById('nombreBanco').value = nombreBanco;


        abrirModalBanco(2,pkBanco)

    });

    // Eliminar
    $('#bancoTable').on('click', '.eliminar-btn', function () {


        const pkBanco = $(this).data('pk');

        const nombreBanco = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreBanco}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarrBanco(pkBanco);
            }
        });
        
    });

});

function agregarBanco(){

    // Obtener los datos del formulario
    const nombreBanco = document.getElementById('nombreBanco').value.trim();


    // Verificar si ambos campos están completos
    if (!nombreBanco) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/bancos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreBanco })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-3').modal('hide');
        listarBancos();

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

function listarBancos() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/bancos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#bancoTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((banco) => [

            banco.nombreBanco, banco.pkBanco

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarBanco(pkBanco){

    //Obtener valores del formulario
    const nombreBanco = document.getElementById('nombreBanco').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkBanco || !nombreBanco) {

        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/bancos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkBanco, nombreBanco })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarBancos();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});

    })
    .catch(error => {

        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function eliminarrBanco(pkBanco){

    // Verificar si llega el id
    if (!pkBanco) {

        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;

    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/bancos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkBanco })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarBancos();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});

        
        return;
    });
}

function abrirModalBanco(modo, pkBanco) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel3');
    const modalButton = document.querySelector('#boostrapModal-3 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar banco';
        modalButton.setAttribute('onclick', 'agregarBanco()');

        document.getElementById('nombreBanco').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-3').modal('show');
        modalTitle.textContent = 'Editar banco';
        modalButton.setAttribute('onclick', `editarBanco(${pkBanco})`);

    }

}


