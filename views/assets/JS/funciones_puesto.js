$(document).ready(function () {

    listarfuncionesPuesto();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarFuncionesPuesto").click(function() {
    modalfuncionesPuesto(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#funcionPuestoTable').DataTable({
        columns: [
            { title: "Descripcion" },
            { title: "Puesto perteneciente" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editarfuncionesPuesto-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminarfuncionesPuesto-btn" data-pk="${row[3]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    // editarfuncionesPuesto
    $('#funcionPuestoTable').on('click', '.editarfuncionesPuesto-btn', function () {

        const rowData = $(this).data('row'); 

        const descripcionFuncion = rowData[0];
        const fkPuesto = rowData[2];
        const pkFuncionPuesto = rowData[3];


        document.getElementById('descripcionFuncion').value = descripcionFuncion;
        document.getElementById('puesto_menu').value = fkPuesto;

        modalfuncionesPuesto(2,pkFuncionPuesto);
    });

    // eliminarfuncionesPuesto
    $('#funcionPuestoTable').on('click', '.eliminarfuncionesPuesto-btn', function () {

        const pkFuncionPuesto = $(this).data('pk');
        const descripcionFuncion = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${descripcionFuncion}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                 eliminarfuncionesPuesto(pkFuncionPuesto);    
            }
        });

        
    });

});

async function agregarfuncionesPuesto() {
    try {
        const descripcionFuncion = document.getElementById('descripcionFuncion').value.trim();

        const fkPuesto = document.getElementById('puesto_menu').value;

        if (!descripcionFuncion || !fkPuesto) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/funciones_puesto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcionFuncion, fkPuesto })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-3').modal('hide');
        await listarfuncionesPuesto();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarfuncionesPuesto() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/funciones_puesto', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#funcionPuestoTable').DataTable();

        tabla.clear().draw();
        tabla.rows.add(data.map(funcionesPuesto => [funcionesPuesto.descripcionFuncion, funcionesPuesto.nombrePuesto, funcionesPuesto.fkPuesto, funcionesPuesto.pkFuncionPuesto])).draw();

        try{
            const select = document.getElementById('funcionesPuesto_menu');
            document.getElementById('funcionesPuesto_menu').innerHTML = "";

            data.forEach(niveles => {

                let option = document.createElement('option');
                option.value = niveles.pkFuncionPuesto;
                option.textContent = niveles.descripcionFuncion;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los funciones_puesto`, 'Error', {"closeButton": true,});
    }
}

async function editarfuncionesPuesto(pkFuncionPuesto) {
    try {
        const descripcionFuncion = document.getElementById('descripcionFuncion').value.trim();

        const fkPuesto = document.getElementById('puesto_menu').value;


        if (!pkFuncionPuesto || !descripcionFuncion || !fkPuesto) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/funciones_puesto', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkFuncionPuesto, descripcionFuncion, fkPuesto })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarfuncionesPuesto();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarfuncionesPuesto(pkFuncionPuesto) {
    try {
        if (!pkFuncionPuesto) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/funciones_puesto', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkFuncionPuesto })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarfuncionesPuesto();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalfuncionesPuesto(modo, pkFuncionPuesto) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel3');
    const modalButton = document.querySelector('#boostrapModal-3 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(agregarfuncionesPuesto o editarfuncionesPuesto)
    if (modo === 1) {
       
        modalTitle.textContent = 'Agregar funcion de puesto';
        modalButton.setAttribute('onclick', 'agregarfuncionesPuesto()');

        document.getElementById('descripcionFuncion').value = '';
        document.getElementById('puesto_menu').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-3').modal('show');
        modalTitle.textContent = 'Editar funcion de puesto';
        modalButton.setAttribute('onclick', `editarfuncionesPuesto(${pkFuncionPuesto})`);

    }

}


// toastr.success(`Si`, 'simon', {"closeButton": true,});