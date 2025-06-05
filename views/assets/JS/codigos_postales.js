$(document).ready(function () {

    listarCodigosPostales();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarCodigoPostal").click(function() {
    abrirModalCodigoPostal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#codigoPostalTable').DataTable({
        columns: [
            { title: "Codigo postal" },
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
    $('#codigoPostalTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const codigoPostal = rowData[0];
        const pkCodigoPostal = rowData[1];


        document.getElementById('codigoPostal').value = codigoPostal;


        abrirModalCodigoPostal(2,pkCodigoPostal)

    });

    // Eliminar
    $('#codigoPostalTable').on('click', '.eliminar-btn', function () {


        const pkCodigoPostal = $(this).data('pk');
        const codigoPostal = $(this).data('nombre');


        Swal.fire({
            title: `¿Eliminar a ${codigoPostal}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarCodigoPostal(pkCodigoPostal);
            }
        });
            

        
    });

});

async function listarCodigosPostales() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
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

            let tabla = $('#codigoPostalTable').DataTable();
            tabla.clear().rows.add(data.map(cp => [
                cp.codigoPostal, cp.pkCodigoPostal
            ])).draw();

        }catch{
            console.log('No hay tabla para: Codigos postales')
        }

        try{
            
            const select = document.getElementById('codigosPostales_menu');
            select.innerHTML = "";

            data.forEach(codigoPostal => {

                let option = document.createElement('option');
                option.value = codigoPostal.pkCodigoPostal;
                option.textContent = codigoPostal.codigoPostal;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Codigos postales')
        }
        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarCodigoPostal() {
    try {
        const codigoPostal = document.getElementById('codigoPostal').value.trim();

        if (!codigoPostal) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigoPostal })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-2').modal('hide');
        await listarCodigosPostales();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarCodigoPostal(pkCodigoPostal) {
    try {
        const codigoPostal = document.getElementById('codigoPostal').value.trim();

        if (!pkCodigoPostal || !codigoPostal) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCodigoPostal, codigoPostal })
        });

        const data = await response.json();
        await listarCodigosPostales();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarCodigoPostal(pkCodigoPostal) {
    try {
        if (!pkCodigoPostal) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCodigoPostal })
        });

        const data = await response.json();
        await listarCodigosPostales();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalCodigoPostal(modo, pkCodigoPostal) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar codigo postal';
        modalButton.setAttribute('onclick', 'agregarCodigoPostal()');

        document.getElementById('codigoPostal').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar codigo postal';
        modalButton.setAttribute('onclick', `editarCodigoPostal(${pkCodigoPostal})`);

    }

}


