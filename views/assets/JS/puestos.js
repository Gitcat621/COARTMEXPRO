$(document).ready(function () {

    listar();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#puestoTable').DataTable({
        columns: [
            { title: "Nombre del puesto" },
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
    $('#puestoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePuesto = rowData[0];
        const pkPuesto = rowData[1];


        document.getElementById('nombrePuesto').value = nombrePuesto;

        abrirModal(2,pkPuesto);
    });

    // Eliminar
    $('#puestoTable').on('click', '.eliminar-btn', function () {

        const pkPuesto = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkPuesto);    
        });
        
    });

});

async function agregar() {
    try {
        const nombrePuesto = document.getElementById('nombrePuesto').value.trim();

        if (!nombrePuesto) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombrePuesto })
        });

        const data = await response.json();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        await listar();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listar() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#puestoTable').DataTable();

        tabla.clear().draw();
        tabla.rows.add(data.map(puesto => [puesto.nombrePuesto, puesto.pkPuesto])).draw();
        try{
            document.getElementById('puesto_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(function(dep) {
                let HTML = `<option value="${dep.pkPuesto}">${dep.nombrePuesto}</option>`;
                // Mapear valor por cada elemento en la consulta 
                document.getElementById('puesto_menu').innerHTML += HTML;
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function editar(pkPuesto) {
    try {
        const nombrePuesto = document.getElementById('nombrePuesto').value.trim();

        if (!pkPuesto || !nombrePuesto) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPuesto, nombrePuesto })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminar(pkPuesto) {
    try {
        if (!pkPuesto) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPuesto })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModal(modo, pkPuesto) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar puesto';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombrePuesto').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar puesto';
        modalButton.setAttribute('onclick', `editar(${pkPuesto})`);

    }

}


