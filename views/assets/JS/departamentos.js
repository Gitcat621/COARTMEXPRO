$(document).ready(function () {

    listarDepartamentos();

});

//Asignar funcion al boton de abrir modal
$("#agregarDepartamento").click(function() {
    modalDepartamento(1);
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
                                <button class="btn btn-xs editarDepartamento-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminarDepartamento-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    // Editar
    $('#departamentoTable').on('click', '.editarDepartamento-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreDepartamento = rowData[0];
        const pkDepartamento = rowData[1];


        document.getElementById('nombreDepartamento').value = nombreDepartamento;

        modalDepartamento(2,pkDepartamento);
    });

    // Eliminar
    $('#departamentoTable').on('click', '.eliminarDepartamento-btn', function () {

        const pkDepartamento = $(this).data('pk');
        const nombreDepartamento = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreDepartamento}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarDepartamento(pkDepartamento);    
            }
        });
       

        
    });

});

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

        try{
            
            const select = document.getElementById('departamento_menu');
            document.getElementById('departamento_menu').innerHTML = "";

            data.forEach(depar => {

                let option = document.createElement('option');
                option.value = depar.pkDepartamento;
                option.textContent = depar.nombreDepartamento;
                select.appendChild(option);

            });

        }catch{
            console.log('no existe este elemento: Departamentos');
        }
        
    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error(`Error al listar los departamentos`, 'Error', {"closeButton": true,});
        
    }
}

async function agregarDepartamento() {
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

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        // Cerrar modal y actualizar la lista
        $('#boostrapModal-1').modal('hide');
        await listarDepartamentos();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarDepartamento(pkDepartamento) {
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

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarDepartamentos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarDepartamento(pkDepartamento) {
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

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarDepartamentos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function modalDepartamento(modo, pkDepartamento) {
    
    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#guardarDepartamento');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar departamento';
        modalButton.setAttribute('onclick', 'agregarDepartamento()');

        document.getElementById('nombreDepartamento').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar departamento';
        modalButton.setAttribute('onclick', `editarDepartamento(${pkDepartamento})`);

    }

}


