$(document).ready(function () {

    listarPuesto();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarPuesto").click(function() {
    modalPuesto(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#puestoTable').DataTable({
        columns: [
            { title: "Nombre del puesto" },
            { title: "Departamento perteneciente" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editarPuesto-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminarPuesto-btn" data-pk="${row[3]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones
    // editarPuesto
    $('#puestoTable').on('click', '.editarPuesto-btn', function () {

        const rowData = $(this).data('row'); 

        const nombrePuesto = rowData[0];
        const fkDepartamento = rowData[2];
        const pkPuesto = rowData[3];


        document.getElementById('nombrePuesto').value = nombrePuesto;
        document.getElementById('departamento_menu').value = fkDepartamento;

        modalPuesto(2,pkPuesto);
    });

    // eliminarPuesto
    $('#puestoTable').on('click', '.eliminarPuesto-btn', function () {

        const pkPuesto = $(this).data('pk');
        const nombrePuesto = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombrePuesto}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                 eliminarPuesto(pkPuesto);    
            }
        });

        
    });

});

async function agregarPuesto() {
    try {
        const nombrePuesto = document.getElementById('nombrePuesto').value.trim();

        const fkDepartamento = document.getElementById('departamento_menu').value;

        if (!nombrePuesto || !fkDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombrePuesto, fkDepartamento })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-2').modal('hide');
        await listarPuesto();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarPuesto() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#puestoTable').DataTable();

        tabla.clear().draw();
        tabla.rows.add(data.map(puesto => [puesto.nombrePuesto, puesto.nombreDepartamento, puesto.fkDepartamento, puesto.pkPuesto])).draw();

        try{
            const select = document.getElementById('puesto_menu');
            document.getElementById('puesto_menu').innerHTML = "";

            data.forEach(niveles => {

                let option = document.createElement('option');
                option.value = niveles.pkPuesto;
                option.textContent = niveles.nombrePuesto;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los puestos`, 'Error', {"closeButton": true,});
    }
}

async function editarPuesto(pkPuesto) {
    try {
        const nombrePuesto = document.getElementById('nombrePuesto').value.trim();

        const fkDepartamento = document.getElementById('departamento_menu').value;


        if (!pkPuesto || !nombrePuesto || !fkDepartamento) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPuesto, nombrePuesto, fkDepartamento })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarPuesto();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarPuesto(pkPuesto) {
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

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarPuesto();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalPuesto(modo, pkPuesto) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(agregarPuesto o editarPuesto)
    if (modo === 1) {
       
        modalTitle.textContent = 'Agregar puesto';
        modalButton.setAttribute('onclick', 'agregarPuesto()');

        document.getElementById('nombrePuesto').value = '';
        document.getElementById('depertamento_menu').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar puesto';
        modalButton.setAttribute('onclick', `editarPuesto(${pkPuesto})`);

    }

}


// toastr.success(`Si`, 'simon', {"closeButton": true,});