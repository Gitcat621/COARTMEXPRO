$(document).ready(function () {

    listarPresentadores();


});

//Asignar funcion al boton de abrir modal
$("#agregarPresentador").click(function() {
    modalPresentador(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#presentadorTable').DataTable({
        columns: [
            { title: "Presentador" },
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
    $('#presentadorTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const oportunidad = rowData[0];
        const pkPresentador = rowData[1];


        document.getElementById('oportunidad').value = oportunidad;

        modalPresentador(2,pkPresentador);
    });

    // Eliminar
    $('#presentadorTable').on('click', '.eliminar-btn', function () {


        const pkPresentador = $(this).data('pk');
        const oportunidad = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${oportunidad}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                  eliminarPresentador(pkPresentador);    
            }
        });
    });

});

async function agregarPresentador() {
    try {
        const nombrePresentador = document.getElementById('nombrePresentador').value.trim();


        if (!nombrePresentador) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/presentadores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombrePresentador })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-4').modal('hide');
        await listarPresentadores();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarPresentadores() {

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/presentadores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#presentadorTable').DataTable();

        console.log(data);

        tabla.clear().draw();
        tabla.rows.add(data.map(presentador => [presentador.nombrePresentador, presentador.pkPresentador])).draw();

        try{
            const select = document.getElementById('presentador_menu');
            select.innerHTML = "";


            data.forEach(depar => {

                let option = document.createElement('option');
                option.value = depar.pkPresentador;
                option.textContent = depar.nombrePresentador;
                select.appendChild(option);

            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los presentadores`, 'Error', {"closeButton": true,});
    }
}

async function editarPresentador(pkPresentador) {
    try {
        
        const nombrePresentador = document.getElementById('nombrePresentador').value.trim();


        if (!nombrePresentador) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }


        const response = await fetch('http://127.0.0.1:5000/coartmex/presentadores', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPresentador, nombrePresentador})
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarPresentadores();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarPresentador(pkPresentador) {
    try {
        if (!pkPresentador) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/presentadores', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPresentador })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarPresentadores();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function modalPresentador(modo, pkPresentador) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel4');
    const modalButton = document.querySelector('#boostrapModal-4 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar presentador';
        modalButton.setAttribute('onclick', 'agregarPresentador()');

        document.getElementById('oportunidad').value = '';

        
    } else if (modo === 2) {

        $('#boostrapModal-4').modal('show');
        modalTitle.textContent = 'Editar presentador';
        modalButton.setAttribute('onclick', `editarPresentador(${pkPresentador})`);

    }

}


