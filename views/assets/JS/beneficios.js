$(document).ready(function () {

    listarBeneficios();

});


//Asignar funcion al boton de abrir modal
$("#agregarBeneficio").click(function() {
    modalBeneficio(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#beneficioTable').DataTable({
        columns: [
            { title: "Beneficio" },
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
    $('#beneficioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreBeneficio = rowData[0];
        const pkBeneficio = rowData[1];


        document.getElementById('nombreBeneficio').value = nombreBeneficio;

        modalBeneficio(2,pkBeneficio);
    });

    // Eliminar
    $('#beneficioTable').on('click', '.eliminar-btn', function () {


        const pkBeneficio = $(this).data('pk');
        const beneficio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${beneficio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                  eliminarBeneficio(pkBeneficio);    
            }
        });
    });

});

async function agregarBeneficio() {
    try {
        const nombreBeneficio = document.getElementById('nombreBeneficio').value.trim();


        if (!nombreBeneficio) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/beneficios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreBeneficio })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-7').modal('hide');
        await listarBeneficios();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarBeneficios() {

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/beneficios', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#beneficioTable').DataTable();

        console.log(data);

        tabla.clear().draw();
        tabla.rows.add(data.map(beneficio => [beneficio.nombreBeneficio,beneficio.pkBeneficio])).draw();

        try{
            const select = document.getElementById('beneficio_menu');
            document.getElementById('beneficio_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(Beneficios => {

                let option = document.createElement('option');
                option.value = Beneficios.pkBeneficio;
                option.textContent = Beneficios.beneficio;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los Beneficios`, 'Error', {"closeButton": true,});
    }
}

async function editarBeneficio(pkBeneficio) {
    try {
        const nombreBeneficio = document.getElementById('nombreBeneficio').value.trim();


        if (!nombreBeneficio) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }


        const response = await fetch('http://127.0.0.1:5000/coartmex/beneficios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkBeneficio, nombreBeneficio})
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarBeneficios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarBeneficio(pkBeneficio) {
    try {
        if (!pkBeneficio) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/beneficios', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkBeneficio })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarBeneficios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalBeneficio(modo, pkBeneficio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel7');
    const modalButton = document.querySelector('#boostrapModal-7 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar beneficio';
        modalButton.setAttribute('onclick', 'agregarBeneficio()');

        document.getElementById('nombreBeneficio').value = '';

        
    } else if (modo === 2) {

        $('#boostrapModal-7').modal('show');
        modalTitle.textContent = 'Editar beneficio';
        modalButton.setAttribute('onclick', `editarBeneficio(${pkBeneficio})`);

    }

}


