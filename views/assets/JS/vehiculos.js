$(document).ready(function () {

    //Inicializar datatable
    $('#vehiculoTable').DataTable({
        columns: [
            { title: "Vehiculo" },
            {
                title: "Opciones", width: "30%",
                render: function (data, type, row) {
                    return `<div class="text-center">
                    <button class="btn btn-xss servicios-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-list"></i> <i class="fa fa-wrench"></i> </button>
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true
    });


    // Event listeners para los botones
    // Agregar servicio
    $('#vehiculoTable').on('click', '.servicios-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreVehiculo = rowData[0];
        const pkVehiculo = rowData[1];

        window.location.href = `./servicios_vehiculo.html?vehiculo=${encodeURIComponent(pkVehiculo)}`;
        
    });

    // Editar
    $('#vehiculoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreVehiculo = rowData[0];
        const pkVehiculo = rowData[1];

        document.getElementById('nombreVehiculo').value = nombreVehiculo;

        abrirModalVehiculo(2,pkVehiculo);
    });

    // Eliminar
    $('#vehiculoTable').on('click', '.eliminar-btn', function () {

        const pkVehiculo = $(this).data('pk');
        const nombreVehiculo = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreVehiculo}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarVehiculo(pkVehiculo);    
            }
        });
        
    });

    listarVehiculos();
    
});

$("#agregarVehiculo").click(function() {
    abrirModalVehiculo(1);
});

async function listarVehiculos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/vehiculos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        let tabla = $('#vehiculoTable').DataTable();
        tabla.clear().draw();

        tabla.rows.add(data.map(v => [
            v.nombreVehiculo,
            v.pkVehiculo
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarVehiculo() {
    // Obtener los datos del formulario
    const nombreVehiculo = document.getElementById('nombreVehiculo').value;

    // Verificar si los campos están completos
    if (!nombreVehiculo) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/vehiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        listarVehiculos();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarVehiculo(pkVehiculo) {
    const nombreVehiculo = document.getElementById('nombreVehiculo').value;

    // Verificar si los campos están completos
    if (!pkVehiculo || !nombreVehiculo) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/vehiculos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkVehiculo, nombreVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-1').modal('hide');

        listarVehiculos();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarVehiculo(pkVehiculo) {
    if (!pkVehiculo) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/vehiculos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkVehiculo })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarVehiculos();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalVehiculo(modo, pkVehiculo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar vehiculo';
        modalButton.setAttribute('onclick', 'agregarVehiculo()');
        
        document.getElementById('nombreVehiculo').value = '';


    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar vehiculo';
        modalButton.setAttribute('onclick', `editarVehiculo('${pkVehiculo}')`);

    }

}
