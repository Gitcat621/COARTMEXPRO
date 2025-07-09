$(document).ready(function () {

    //Inicializar datatable
    $('#zonaTable').DataTable({
        columns: [
            { title: "Nombre de la zona" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i> EDITAR</button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i> ELIMINAR</button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones 
    // Editar
    $('#zonaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreZonaRuta = rowData[0];
        const pkZonaRuta = rowData[1];


        document.getElementById('nombreZonaRuta').value = nombreZonaRuta;


        abrirModalZonasRuta(2,pkZonaRuta)

    });

    // Eliminar
    $('#zonaTable').on('click', '.eliminar-btn', function () {


        const pkZonaRuta = $(this).data('pk');
        const nombreZonaRuta = $(this).data('nombre');


        Swal.fire({
            title: `¿Eliminar a ${nombreZonaRuta}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarZonasRuta(pkZonaRuta);
            }
        });
    });

    listarZonasRuta();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarZonaRuta").click(function() {
    abrirModalZonasRuta(1);
});


async function listarZonasRuta() {

    try {
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/zonas_ruta', {
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
            let tabla = $('#zonaTable').DataTable();
            tabla.clear().rows.add(data.map(pais => [
                pais.nombreZonaRuta, 
                pais.pkZonaRuta
            ])).draw();

        }catch{
            console.log('No hay tabla para: zonasRuta')
        }

        try{

            const select = document.getElementById('zona_menu');
            select.innerHTML = "";

            data.forEach(pais => {

                let option = document.createElement('option');
                option.value = pais.pkZonaRuta;
                option.textContent = pais.nombreZonaRuta;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: zonasRuta')
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los zonasRuta`, 'Error', {"closeButton": true,});
    }
}

async function agregarZonaRuta() {
    try {
        const nombreZonaRuta = document.getElementById('nombreZonaRuta').value.trim();

        if (!nombreZonaRuta) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/zonas_ruta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreZonaRuta })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-3').modal('hide');
        await listarZonasRuta();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarZonasRuta(pkZonaRuta) {
    try {
        const nombreZonaRuta = document.getElementById('nombreZonaRuta').value.trim();

        if (!pkZonaRuta || !nombreZonaRuta) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/zonas_ruta', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkZonaRuta, nombreZonaRuta })
        });

        const data = await response.json();
        await listarZonasRuta();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarZonasRuta(pkZonaRuta) {
    try {
        if (!pkZonaRuta) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/zonas_ruta', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkZonaRuta })
        });

        const data = await response.json();
        await listarZonasRuta();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalZonasRuta(modo, pkZonaRuta) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel3');
    const modalButton = document.querySelector('#boostrapModal-3 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar zona de ruta';
        modalButton.setAttribute('onclick', 'agregarZonaRuta()');

        document.getElementById('nombreZonaRuta').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-3').modal('show');
        modalTitle.textContent = 'Editar zona de ruta';
        modalButton.setAttribute('onclick', `editarZonasRuta(${pkZonaRuta})`);

    }

}


