$(document).ready(function () {

    //Inicializar datatable
    $('#lugarTable').DataTable({
        columns: [
            { title: "Nombre del lugar" },
            {
                title: "Opciones", width: "30%",
                render: function (data, type, row) {
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true
    });


    // Event listeners para los botones
    // Editar
    $('#lugarTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreLugarServicio = rowData[0];
        const pkLugarServicio = rowData[1];

        document.getElementById('nombreLugarServicio').value = nombreLugarServicio;

        abrirModalLugar(2,pkLugarServicio);
    });

    // Eliminar
    $('#lugarTable').on('click', '.eliminar-btn', function () {

        const pkLugarServicio = $(this).data('pk');
        const nombreLugarServicio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreLugarServicio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarLugar(pkLugarServicio);    
            }
        });
        
    });

    listarLugares();
    
});


$("#agregarLugar").click(function() {
    abrirModalLugar(1);
});

async function listarLugares() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/lugares_servicio', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{    

            let tabla = $('#lugarTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(v => [
                v.nombreLugarServicio,
                v.pkLugarServicio
            ])).draw();

        }catch{
            console.log('No hay tabla para: Lugares de servicio');
        }
        

        try{

            const select = document.getElementById('lugar_menu');
            select.innerHTML = "";

            data.forEach(lugar => {

                let option = document.createElement('option');
                option.value = lugar.pkLugarServicio;
                option.textContent = lugar.nombreLugarServicio;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: lugares de servicio');
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al cargar los lugares de servicio`, 'Error', {"closeButton": true,});
    }
}

async function agregarLugar() {
    // Obtener los datos del formulario
    const nombreLugarServicio = document.getElementById('nombreLugarServicio').value;

    // Verificar si los campos están completos
    if (!nombreLugarServicio) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/lugares_servicio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreLugarServicio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-2').modal('hide');
        listarLugares();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarLugar(pkLugarServicio) {
    const nombreLugarServicio = document.getElementById('nombreLugarServicio').value;

    // Verificar si los campos están completos
    if (!pkLugarServicio || !nombreLugarServicio) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/lugares_servicio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkLugarServicio, nombreLugarServicio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-2').modal('hide');

        listarLugares();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarLugar(pkLugarServicio) {
    if (!pkLugarServicio) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/lugares_servicio', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkLugarServicio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarLugares();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalLugar(modo, pkLugarServicio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar lugar de servicio';
        modalButton.setAttribute('onclick', 'agregarLugar()');
        
        document.getElementById('nombreLugarServicio').value = '';


    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar lugar de servicio';
        modalButton.setAttribute('onclick', `editarLugar('${pkLugarServicio}')`);

    }

}