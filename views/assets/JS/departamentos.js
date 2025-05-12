$(document).ready(function () {

    listarDepartamentos();

});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#departamentoTable').DataTable({
        columns: [
            { title: "Nombre del departamento" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[1]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    

// Event listeners para los botones
    // Editar
    $('#departamentoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreDepartamento = rowData[0];
        const pkDepartamento = rowData[1];


        document.getElementById('nombreDepartamento').value = nombreDepartamento;

        abrirModal(2,pkDepartamento);
    });

    // Eliminar
    $('#departamentoTable').on('click', '.eliminar-btn', function () {

        const pkDepartamento = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkDepartamento);    
        });
        
    });

});

async function agregar() {
    try {
        const nombreDepartamento = document.getElementById('nombreDepartamento').value.trim();

        if (!nombreDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreDepartamento })
        });

        const data = await response.json();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        // Cerrar modal y actualizar la lista
        $('#boostrapModal-1').modal('hide');
        await listar();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarDepartamentos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#departamentoTable').DataTable();

        tabla.clear().draw();
        tabla.rows.add(data.map(depa => [depa.nombreDepartamento, depa.pkDepartamento])).draw();

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function editar(pkDepartamento) {
    try {
        const nombreDepartamento = document.getElementById('nombreDepartamento').value.trim();

        if (!pkDepartamento || !nombreDepartamento) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkDepartamento, nombreDepartamento })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminar(pkDepartamento) {
    try {
        if (!pkDepartamento) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkDepartamento })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModal(modo, pkDepartamento) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar departamento';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombreDepartamento').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar departamento';
        modalButton.setAttribute('onclick', `editar(${pkDepartamento})`);

    }

}


