$(document).ready(function () {

    listarOportunidades();

});

//Asignar funcion al boton de abrir modal
$("#agregarOportunidad").click(function() {
    modalOportunidad(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#oportunidadTable').DataTable({
        columns: [
            { title: "Oportunidad" },
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
    $('#oportunidadTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const oportunidad = rowData[0];
        const pkOportunidad = rowData[1];


        document.getElementById('oportunidad').value = oportunidad;

        modalOportunidad(2,pkOportunidad);
    });

    // Eliminar
    $('#oportunidadTable').on('click', '.eliminar-btn', function () {


        const pkOportunidad = $(this).data('pk');
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
                  eliminarOportunidad(pkOportunidad);    
            }
        });
    });

});

async function agregarOportunidad() {
    try {
        const oportunidad = document.getElementById('oportunidad').value.trim();


        if (!oportunidad) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oportunidad })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-6').modal('hide');
        await listarOportunidades();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarOportunidades() {

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidades', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#oportunidadTable').DataTable();

        console.log(data);

        function traducirTiempo(texto) {
            let traducido = texto.includes("day") ? texto.replace("day", "día") : texto;
            return traducido.replace(/(\d+):(\d+):(\d+)/, "$1 hrs, $2 mins");
        }

        tabla.clear().draw();
        tabla.rows.add(data.map(oportunidad => [oportunidad.oportunidad,oportunidad.pkOportunidad])).draw();

        try{
            const select = document.getElementById('oportunidad_menu');
            document.getElementById('oportunidad_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(oportunidades => {

                let option = document.createElement('option');
                option.value = oportunidades.pkOportunidad;
                option.textContent = oportunidades.oportunidad;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los oportunidades`, 'Error', {"closeButton": true,});
    }
}

async function editarOportunidad(pkOportunidad) {
    try {
        const oportunidad = document.getElementById('oportunidad').value.trim();


        if (!oportunidad) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }


        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidades', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkOportunidad, oportunidad})
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarOportunidades();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarOportunidad(pkOportunidad) {
    try {
        if (!pkOportunidad) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidades', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkOportunidad })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarOportunidades();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalOportunidad(modo, pkOportunidad) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel6');
    const modalButton = document.querySelector('#boostrapModal-6 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar oportunidad';
        modalButton.setAttribute('onclick', 'agregarOportunidad()');

        document.getElementById('oportunidad').value = '';

        
    } else if (modo === 2) {

        $('#boostrapModal-6').modal('show');
        modalTitle.textContent = 'Editar oportunidad';
        modalButton.setAttribute('onclick', `editarOportunidad(${pkOportunidad})`);

    }

}


