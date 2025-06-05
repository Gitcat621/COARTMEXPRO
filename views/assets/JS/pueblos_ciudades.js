$(document).ready(function () {

    listarPueblosCiudades();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarPuebloCiudad").click(function() {
    abrirModalPuebloCiudad(1);
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
    $('#puebloCiudadTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePuebloCiudad = rowData[0];
        const pkPuebloCiudad = rowData[1];


        document.getElementById('nombrePuebloCiudad').value = nombrePuebloCiudad;

        abrirModalPuebloCiudad(2,pkPuebloCiudad)

    });

    // Eliminar
    $('#puebloCiudadTable').on('click', '.eliminar-btn', function () {


        const pkPuebloCiudad = $(this).data('pk');
        const puebloCiudad = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${puebloCiudad}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarPuebloCiudad(pkPuebloCiudad);
            }
        });
        
    });

});

async function listarPueblosCiudades() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
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

            let tabla = $('#puebloCiudadTable').DataTable();
            tabla.clear().rows.add(data.map(pc => [
                pc.nombrePuebloCiudad, 
                pc.pkPuebloCiudad
            ])).draw();

        }catch{
            console.log('No hay tabla para: Pueblos y ciudades')
        }

        try{
            
            const select = document.getElementById('pueblosCiudades_menu');
            select.innerHTML = "";

            data.forEach(puebloCiudad => {

                let option = document.createElement('option');
                option.value = puebloCiudad.pkPuebloCiudad;
                option.textContent = puebloCiudad.nombrePuebloCiudad;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Pueblos y ciudades')
        }

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarPuebloCiudad() {
    try {
        const nombrePuebloCiudad = document.getElementById('nombrePuebloCiudad').value.trim();

        if (!nombrePuebloCiudad) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombrePuebloCiudad })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-3').modal('hide');
        await listarPueblosCiudades();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarPuebloCiudad(pkPuebloCiudad) {
    try {
        const nombrePuebloCiudad = document.getElementById('nombrePuebloCiudad').value.trim();

        if (!pkPuebloCiudad || !nombrePuebloCiudad) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPuebloCiudad, nombrePuebloCiudad })
        });

        const data = await response.json();
        await listarPueblosCiudades();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarPuebloCiudad(pkPuebloCiudad) {
    try {
        if (!pkPuebloCiudad) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPuebloCiudad })
        });

        const data = await response.json();
        await listarPueblosCiudades();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalPuebloCiudad(modo, pkPuebloCiudad) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel3');
    const modalButton = document.querySelector('#boostrapModal-3 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar pueblo o ciudad';
        modalButton.setAttribute('onclick', 'agregarPuebloCiudad()');

        document.getElementById('nombrePuebloCiudad').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-3').modal('show');
        modalTitle.textContent = 'Editar pueblo o ciudad';
        modalButton.setAttribute('onclick', `editarPuebloCiudad(${pkPuebloCiudad})`);

    }

}


