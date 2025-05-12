$(document).ready(function () {

    listarCursos();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#cursoTable').DataTable({
        columns: [
            { title: "Nombre del curso" },
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
    $('#cursoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreCurso = rowData[0];
        const pkCurso = rowData[1];


        document.getElementById('nombreCurso').value = nombreCurso;

        abrirModal(2,pkCurso);
    });

    // Eliminar
    $('#cursoTable').on('click', '.eliminar-btn', function () {

        const pkCurso = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminar(pkCurso);    
        });
        
    });

});

async function agregar() {
    try {
        const nombreCurso = document.getElementById('nombreCurso').value.trim();

        if (!nombreCurso) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCurso })
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

async function listarCursos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#cursoTable').DataTable();

        tabla.clear().draw();
        tabla.rows.add(data.map(curso => [curso.nombreCurso, curso.pkCurso])).draw();
        try{
            document.getElementById('curso_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(function(dep) {
                let HTML = `<option value="${dep.pkCurso}">${dep.nombreCurso}</option>`;
                // Mapear valor por cada elemento en la consulta 
                document.getElementById('curso_menu').innerHTML += HTML;
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function editar(pkCurso) {
    try {
        const nombreCurso = document.getElementById('nombreCurso').value.trim();

        if (!pkCurso || !nombreCurso) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCurso, nombreCurso })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminar(pkCurso) {
    try {
        if (!pkCurso) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCurso })
        });

        const data = await response.json();

        await listar();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModal(modo, pkCurso) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar curso';
        modalButton.setAttribute('onclick', 'agregar()');

        document.getElementById('nombreCurso').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar curso';
        modalButton.setAttribute('onclick', `editar(${pkCurso})`);

    }

}


