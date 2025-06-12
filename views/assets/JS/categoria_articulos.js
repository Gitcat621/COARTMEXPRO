$(document).ready(function () {

    listarCategoriaArticulos();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarCategoriaArticulo").click(function() {
    abrirModalCategoria(1);
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
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'>Editar <i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}">Eliminar <i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones 
    // Editar
    $('#categoriaArticuloTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreCategoriaArticulo = rowData[0];

        const pkCategoriaArticulo = rowData[1];


        document.getElementById('nombreCategoriaArticulo').value = nombreCategoriaArticulo;


        abrirModalCategoria(2,pkCategoriaArticulo)

    });

    // Eliminar
    $('#categoriaArticuloTable').on('click', '.eliminar-btn', function () {


        const pkCategoriaArticulo = $(this).data('pk');

        const nombreCategoriaArticulo = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreCategoriaArticulo}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarCategoriaArticulos(pkCategoriaArticulo); 
            }
        });
        
    });

});

async function agregarCategoriaArticulos() {
    // Obtener los datos del formulario
    const nombreCategoriaArticulo = document.getElementById('nombreCategoriaArticulo').value.trim();

    // Verificar si el campo está completo
    if (!nombreCategoriaArticulo) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCategoriaArticulo })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;

        }

        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        // Acciones posteriores (Cerrar modal y mapear datos)
        $('#boostrapModal-2').modal('hide');
        listarCategoriaArticulos();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarCategoriaArticulos() {
    try {
        // Mapear datos
        const response = await fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;

        }

        const data = await response.json();

        // Iniciar la datatable y asignarla a una variable
        let tabla = $('#categoriaArticuloTable').DataTable();

        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((categoriaArticulos) => [
            categoriaArticulos.nombreCategoriaArticulo, 
            categoriaArticulos.pkCategoriaArticulo
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function editarCategoriaArticulos(pkCategoriaArticulo) {
    const nombreCategoriaArticulo = document.getElementById('nombreCategoriaArticulo').value.trim();

    // Verificar que ningún campo esté vacío
    if (!pkCategoriaArticulo || !nombreCategoriaArticulo) {
        toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para editar
        const response = await fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pkCategoriaArticulo, nombreCategoriaArticulo })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;

        }

        // Mostrar el mensaje de la respuesta de la API
        listarCategoriaArticulos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarCategoriaArticulos(pkCategoriaArticulo) {
    // Verificar si llega el id
    if (!pkCategoriaArticulo) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para eliminar
        const response = await fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pkCategoriaArticulo })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;

        }

        // Mostrar el mensaje de la respuesta de la API
        listarCategoriaArticulos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalCategoria(modo, pkCategoriaArticulo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar categoriaArticulos';
        modalButton.setAttribute('onclick', 'agregarCategoriaArticulos()');

        document.getElementById('nombreCategoriaArticulo').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar categoriaArticulos';
        modalButton.setAttribute('onclick', `editarCategoriaArticulos(${pkCategoriaArticulo})`);

    }

}


