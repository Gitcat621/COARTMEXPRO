$(document).ready(function () {

    listarMunicipios();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarMunicipio").click(function() {
    abrirModalMunicipio(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#municipioTable').DataTable({
        columns: [
            { title: "Nombre del municipio" },
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
    $('#municipioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreMunicipio = rowData[0];
        const pkMunicipio = rowData[1];


        document.getElementById('nombreMunicipio').value = nombreMunicipio;


        abrirModalMunicipio(2,pkMunicipio)

    });

    // Eliminar
    $('#municipioTable').on('click', '.eliminar-btn', function () {


        const pkMunicipio = $(this).data('pk');
        const nombreMunicipio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreMunicipio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarMunicipio(pkMunicipio);
            }
        });
        
    });

});

async function listarMunicipios() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/municipios', {
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

            let tabla = $('#municipioTable').DataTable();
            tabla.clear().rows.add(data.map(municipio => [
                municipio.nombreMunicipio, 
                municipio.pkMunicipio
            ])).draw();

        }catch{
            console.log('No hay tabla para: Municipios')
        }

        try{
            
            const select = document.getElementById('municipios_menu');
            select.innerHTML = "";

            data.forEach(municipio => {

                let option = document.createElement('option');
                option.value = municipio.pkMunicipio;
                option.textContent = municipio.nombreMunicipio;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: Municipio')
        }

        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarMunicipio() {
    try {
        const nombreMunicipio = document.getElementById('nombreMunicipio').value.trim();

        if (!nombreMunicipio) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/municipios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreMunicipio })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-4').modal('hide');
        await listarMunicipios();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarMunicipio(pkMunicipio) {
    try {
        const nombreMunicipio = document.getElementById('nombreMunicipio').value.trim();

        if (!pkMunicipio || !nombreMunicipio) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/municipios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkMunicipio, nombreMunicipio })
        });

        const data = await response.json();
        await listarMunicipios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarMunicipio(pkMunicipio) {
    try {
        if (!pkMunicipio) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/municipios', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkMunicipio })
        });

        const data = await response.json();
        await listarMunicipios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalMunicipio(modo, pkMunicipio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel4');
    const modalButton = document.querySelector('#boostrapModal-4 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar municipio';
        modalButton.setAttribute('onclick', 'agregarMunicipio()');

        document.getElementById('nombreMunicipio').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-4').modal('show');
        modalTitle.textContent = 'Editar municipio';
        modalButton.setAttribute('onclick', `editarMunicipio(${pkMunicipio})`);

    }

}


