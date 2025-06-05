$(document).ready(function () {

    listarEstados();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarEstado").click(function() {
    abrirModalEstados(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#estadoTable').DataTable({
        columns: [
            { title: "Nombre del estado" },
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
    $('#estadoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreEstado = rowData[0];
        const pkEstado = rowData[1];


        document.getElementById('nombreEstado').value = nombreEstado;


        abrirModalEstados(2,pkEstado)

    });

    // Eliminar
    $('#estadoTable').on('click', '.eliminar-btn', function () {


        const pkEstado = $(this).data('pk');
        const nombreEstado = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreEstado}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarEstados(pkEstado);
            }
        });
        
    });

});

async function listarEstados() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/estados', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{

            let tabla = $('#estadoTable').DataTable();
            tabla.clear().rows.add(data.map(estado => [
                estado.nombreEstado, 
                estado.pkEstado
            ])).draw();

        }catch{
            console.log('No hay tabla para: Estados')
        }

        try{
            
            const select = document.getElementById('estados_menu');
            select.innerHTML = "";

            data.forEach(estado => {

                let option = document.createElement('option');
                option.value = estado.pkEstado;
                option.textContent = estado.nombreEstado;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Estados')
        }
        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarEstados() {

    try {

        const nombreEstado = document.getElementById('nombreEstado').value.trim();

        if (!nombreEstado) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/estados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreEstado })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-5').modal('hide');
        await listarEstados();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarEstados(pkEstado) {
    try {
        const nombreEstado = document.getElementById('nombreEstado').value.trim();

        if (!pkEstado || !nombreEstado) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/estados', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkEstado, nombreEstado })
        });

        const data = await response.json();
        await listarEstados();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarEstados(pkEstado) {
    try {
        if (!pkEstado) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/estados', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkEstado })
        });

        const data = await response.json();
        await listarEstados();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalEstados(modo, pkEstado) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel5');
    const modalButton = document.querySelector('#boostrapModal-5 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar estado';
        modalButton.setAttribute('onclick', 'agregarEstados()');

        document.getElementById('nombreEstado').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-5').modal('show');
        modalTitle.textContent = 'Editar estado';
        modalButton.setAttribute('onclick', `editarEstados(${pkEstado})`);

    }

}


