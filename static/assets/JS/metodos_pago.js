$(document).ready(function () {

    listarMetodosPago();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarMetodoPago").click(function() {
    abrirModalMetodosPago(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#MetodoPagoTable').DataTable({
        columns: [
            { title: "Nombre del país" },
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
    $('#MetodoPagoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreMetodoPago = rowData[0];
        const pkMetodoPago = rowData[1];


        document.getElementById('nombreMetodoPago').value = nombreMetodoPago;


        abrirModalMetodosPago(2,pkMetodoPago)

    });

    // Eliminar
    $('#MetodoPagoTable').on('click', '.eliminar-btn', function () {


        const pkMetodoPago = $(this).data('pk');
        const nombreMetodoPago = $(this).data('nombre');


        Swal.fire({
            title: `¿Eliminar a ${nombreMetodoPago}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarMetodosPago(pkMetodoPago);
            }
        });
    });

});

async function listarMetodosPago() {

    try {
        
        const response = await fetch('/api/metodos_pago', {
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
            let tabla = $('#metodoPagoTable').DataTable();
            tabla.clear().rows.add(data.map(MetodoPago => [
                MetodoPago.nombreMetodoPago, 
                MetodoPago.pkMetodoPago
            ])).draw();

        }catch{
            console.log('No hay tabla para: MetodosPago')
        }

        try{

            const select = document.getElementById('metodoPago_menu');
            select.innerHTML = "";

            data.forEach(MetodoPago => {

                let option = document.createElement('option');
                option.value = MetodoPago.pkMetodoPago;
                option.textContent = MetodoPago.nombreMetodoPago;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: MetodosPago')
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los MetodosPago`, 'Error', {"closeButton": true,});
    }
}

async function agregarMetodoPago() {
    try {
        const nombreMetodoPago = document.getElementById('nombreMetodoPago').value.trim();

        if (!nombreMetodoPago) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/metodos_pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreMetodoPago })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-6').modal('hide');
        await listarMetodosPago();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarMetodosPago(pkMetodoPago) {
    try {
        const nombreMetodoPago = document.getElementById('nombreMetodoPago').value.trim();

        if (!pkMetodoPago || !nombreMetodoPago) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/metodos_pago', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkMetodoPago, nombreMetodoPago })
        });

        const data = await response.json();
        await listarMetodosPago();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarMetodosPago(pkMetodoPago) {
    try {
        if (!pkMetodoPago) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/metodos_pago', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkMetodoPago })
        });

        const data = await response.json();
        await listarMetodosPago();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalMetodosPago(modo, pkMetodoPago) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel6');
    const modalButton = document.querySelector('#boostrapModal-6 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar país';
        modalButton.setAttribute('onclick', 'agregarMetodoPago()');

        document.getElementById('nombreMetodoPago').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-6').modal('show');
        modalTitle.textContent = 'Editar país';
        modalButton.setAttribute('onclick', `editarMetodosPago(${pkMetodoPago})`);

    }

}


