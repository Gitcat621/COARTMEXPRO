$(document).ready(function () {

    //Inicializar datatable
    $('#manoTable').DataTable({
        columns: [
            { title: "Mano de obra" },
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
    $('#manoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 
        const nombreManoObra = rowData[0];
        const pkManoObra = rowData[1];

        document.getElementById('nombreManoObra').value = nombreManoObra;

        abrirModalManoObra(2,pkManoObra);
    });

    // Eliminar
    $('#manoTable').on('click', '.eliminar-btn', function () {

        const pkManoObra = $(this).data('pk');
        const nombreManoObra = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreManoObra}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarManoObra(pkManoObra);    
            }
        });
        
    });

    listarManosObra();
    
});

$("#agregarManoObra").click(function() {
    abrirModalManoObra(1);
});

async function listarManosObra() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/manos_obra', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{    

            let tabla = $('#manoTable').DataTable();
            tabla.clear().draw();

            tabla.rows.add(data.map(v => [
                v.nombreManoObra,
                v.pkManoObra
            ])).draw();

        }catch{

            console.log('No hay tabla para: manos de obra');

        }

        try{

            const select = document.getElementById('mano_menu');
            select.innerHTML = "";

            data.forEach(mano => {

                let option = document.createElement('option');
                option.value = mano.pkManoObra;
                option.textContent = mano.nombreManoObra;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: manos de obra');
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al cargar las manos de obra`, 'Error', {"closeButton": true,});
    }
}

async function agregarManoObra() {
    // Obtener los datos del formulario
    const nombreManoObra = document.getElementById('nombreManoObra').value;

    // Verificar si los campos están completos
    if (!nombreManoObra) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/manos_obra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreManoObra })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-3').modal('hide');
        listarManosObra();


    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarManoObra(pkManoObra) {
    const nombreManoObra = document.getElementById('nombreManoObra').value;

    // Verificar si los campos están completos
    if (!pkManoObra || !nombreManoObra) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/manos_obra', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkManoObra, nombreManoObra })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        $('#boostrapModal-3').modal('hide');

        listarManosObra();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarManoObra(pkManoObra) {
    if (!pkManoObra) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/manos_obra', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkManoObra })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarManosObra();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalManoObra(modo, pkManoObra) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel3');
    const modalButton = document.querySelector('#boostrapModal-3 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar mano de obra';
        modalButton.setAttribute('onclick', 'agregarManoObra()');
        
        document.getElementById('nombreManoObra').value = '';


    } else if (modo === 2) {

        $('#boostrapModal-3').modal('show');
        modalTitle.textContent = 'Editar mano de obra';
        modalButton.setAttribute('onclick', `editarManoObra('${pkManoObra}')`);

    }

}
