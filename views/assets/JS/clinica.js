$(document).ready(function () {

    listarClinicas();

});


//Asignar funcion al boton de abrir modal
$("#agregarClinica").click(function() {
    modalClinica(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#clinicaTable').DataTable({
        columns: [
            { title: "Clinica" },
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
    $('#clinicaTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreClinica = rowData[0];
        const pkClinica = rowData[1];


        document.getElementById('nombreClinica').value = nombreClinica;

        modalClinica(2,pkClinica);
    });

    // Eliminar
    $('#clinicaTable').on('click', '.eliminar-btn', function () {


        const pkClinica = $(this).data('pk');
        const clinica = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${clinica}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                  eliminarClinica(pkClinica);    
            }
        });
    });

});

async function agregarClinica() {
    try {
        const nombreClinica = document.getElementById('nombreClinica').value.trim();


        if (!nombreClinica) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/clinicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreClinica })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-8').modal('hide');
        await listarClinicas();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarClinicas() {

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/clinicas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#clinicaTable').DataTable();

        console.log(data);

        tabla.clear().draw();
        tabla.rows.add(data.map(clinica => [clinica.nombreClinica,clinica.pkClinica])).draw();

        try{
            const select = document.getElementById('clinica_menu');
            document.getElementById('clinica_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(Clinicas => {

                let option = document.createElement('option');
                option.value = Clinicas.pkClinica;
                option.textContent = Clinicas.nombreClinica;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar las Clinicas`, 'Error', {"closeButton": true,});
    }
}

async function editarClinica(pkClinica) {
    try {
        const nombreClinica = document.getElementById('nombreClinica').value.trim();


        if (!nombreClinica) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }


        const response = await fetch('http://127.0.0.1:5000/coartmex/clinicas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkClinica, nombreClinica})
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarClinicas();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarClinica(pkClinica) {
    try {
        if (!pkClinica) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/clinicas', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkClinica })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarClinicas();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalClinica(modo, pkClinica) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel8');
    const modalButton = document.querySelector('#boostrapModal-8 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar clinica';
        modalButton.setAttribute('onclick', 'agregarClinica()');

        document.getElementById('nombreClinica').value = '';

        
    } else if (modo === 2) {

        $('#boostrapModal-8').modal('show');
        modalTitle.textContent = 'Editar clinica';
        modalButton.setAttribute('onclick', `editarClinica(${pkClinica})`);

    }

}


