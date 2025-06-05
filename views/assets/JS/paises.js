$(document).ready(function () {

    listarPaises();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarPais").click(function() {
    abrirModalPaises(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#paisTable').DataTable({
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
    $('#paisTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePais = rowData[0];
        const pkPais = rowData[1];


        document.getElementById('nombrePais').value = nombrePais;


        abrirModalPaises(2,pkPais)

    });

    // Eliminar
    $('#paisTable').on('click', '.eliminar-btn', function () {


        const pkPais = $(this).data('pk');
        const nombrePais = $(this).data('nombre');


        Swal.fire({
            title: `¿Eliminar a ${nombrePais}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarPaises(pkPais);
            }
        });
    });

});

async function listarPaises() {

    try {
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/paises', {
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
            let tabla = $('#paisTable').DataTable();
            tabla.clear().rows.add(data.map(pais => [
                pais.nombrePais, 
                pais.pkPais
            ])).draw();

        }catch{
            console.log('No hay tabla para: paises')
        }

        try{

            const select = document.getElementById('paises_menu');
            select.innerHTML = "";

            data.forEach(pais => {

                let option = document.createElement('option');
                option.value = pais.pkPais;
                option.textContent = pais.nombrePais;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: paises')
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los paises`, 'Error', {"closeButton": true,});
    }
}

async function agregarPais() {
    try {
        const nombrePais = document.getElementById('nombrePais').value.trim();

        if (!nombrePais) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/paises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombrePais })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-6').modal('hide');
        await listarPaises();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarPaises(pkPais) {
    try {
        const nombrePais = document.getElementById('nombrePais').value.trim();

        if (!pkPais || !nombrePais) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/paises', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPais, nombrePais })
        });

        const data = await response.json();
        await listarPaises();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarPaises(pkPais) {
    try {
        if (!pkPais) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/paises', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPais })
        });

        const data = await response.json();
        await listarPaises();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalPaises(modo, pkPais) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel6');
    const modalButton = document.querySelector('#boostrapModal-6 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar país';
        modalButton.setAttribute('onclick', 'agregarPais()');

        document.getElementById('nombrePais').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-6').modal('show');
        modalTitle.textContent = 'Editar país';
        modalButton.setAttribute('onclick', `editarPaises(${pkPais})`);

    }

}


