$(document).ready(function () {

    listarCursos();

});


//Asignar funcion al boton de abrir modal
$("#agregarCurso").click(function() {
    modalCurso(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#cursoTable').DataTable({
        columns: [
            { title: "Nombre del curso" },
            { title: "Documento/Beneficio obtenido" },
            { title: "Duracion" },
            { title: "Presentador" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[5]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
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
        const documentoObtenido = rowData[1];
        const duracion = rowData[2];
        const nombrePresentador = rowData[3]
        const fkPresentador = rowData[4]
        const pkCurso = rowData[5];


        document.getElementById('nombreCurso').value = nombreCurso;

        const select = document.getElementById('documento_menu');
        for (let option of select.options) {
            if (option.textContent === documentoObtenido) {  
                select.value = option.value; // Asigna el valor correcto al select
                break; // Rompe el bucle cuando encuentra coincidencia
            }
        }

        let dias = 0, horas = 0, minutos = 0;

        // Extraer días si están presentes
        const matchDias = duracion.match(/(\d+)\s*días?/);
        if (matchDias) dias = parseInt(matchDias[1], 10);

        // Extraer horas
        const matchHoras = duracion.match(/(\d+)\s*hrs?/);
        if (matchHoras) horas = parseInt(matchHoras[1], 10);

        // Extraer minutos
        const matchMinutos = duracion.match(/(\d+)\s*mins?/);
        if (matchMinutos) minutos = parseInt(matchMinutos[1], 10);

        // Asignar valores a los inputs
        document.getElementById('dias').value = dias;
        document.getElementById('horas').value = horas;
        document.getElementById('minutos').value = minutos;

        document.getElementById('presentador_menu').value = fkPresentador;

        modalCurso(2,pkCurso);
    });

    // Eliminar
    $('#cursoTable').on('click', '.eliminar-btn', function () {

        const pkCurso = $(this).data('pk');
        const nombreCurso = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreCurso}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                  eliminarCurso(pkCurso);    
            }
        });
        
    });

});

document.getElementById('horas').addEventListener('input', function () {
    if (this.value > 24) this.value = 24; // Limita el valor a 60
    if (this.value < 0) this.value = 0;   // Evita números negativos
});

document.getElementById('minutos').addEventListener('input', function () {
    if (this.value > 60) this.value = 60; // Limita el valor a 60
    if (this.value < 0) this.value = 0;   // Evita números negativos
});

async function agregarCurso() {
    try {
        const nombreCurso = document.getElementById('nombreCurso').value.trim();

        const documentoObtenido = document.getElementById('documento_menu').value;

        function formatTime(dias, horas, minutos) {
            // Convertir días a horas
            let totalHoras = dias * 24 + parseInt(horas);

            // Asegurar formato de dos dígitos
            let horasFormato = totalHoras.toString().padStart(2, '0');
            let minutosFormato = minutos.toString().padStart(2, '0');

            return `${horasFormato}:${minutosFormato}:00`;
        }

        const dias = document.getElementById('dias').value || 0;
        const horas = document.getElementById('horas').value || 0;
        const minutos = document.getElementById('minutos').value || 0;

        const duracionCurso = formatTime(dias, horas, minutos);

        const presentador = document.getElementById('presentador_menu').value;


        if (!nombreCurso || !documentoObtenido || !duracionCurso || !presentador) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCurso, documentoObtenido, duracionCurso, presentador })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-5').modal('hide');
        await listarCursos();

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

        console.log(data);

        function traducirTiempo(texto) {
            let traducido = texto.includes("day") ? texto.replace("day", "día") : texto;
            return traducido.replace(/(\d+):(\d+):(\d+)/, "$1 hrs, $2 mins");
        }

        tabla.clear().draw();
        tabla.rows.add(data.map(curso => [curso.nombreCurso, curso.documentoObtenido, traducirTiempo(curso.duracionCurso), curso.nombrePresentador, curso.fkPresentador, curso.pkCurso])).draw();

        try{
            const select = document.getElementById('curso_menu');
            document.getElementById('curso_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(cursos => {

                let option = document.createElement('option');
                option.value = cursos.pkCurso;
                option.textContent = cursos.nombreCurso;
                select.appendChild(option);
            });

        }catch{
            console.log('no existe este elemento')
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los cursos`, 'Error', {"closeButton": true,});
    }
}

async function editarCurso(pkCurso) {
    try {
        const nombreCurso = document.getElementById('nombreCurso').value.trim();

        const documentoObtenido = document.getElementById('documento_menu').value;

        function formatTime(dias, horas, minutos) {
            // Convertir días a horas
            let totalHoras = dias * 24 + parseInt(horas);

            // Asegurar formato de dos dígitos
            let horasFormato = totalHoras.toString().padStart(2, '0');
            let minutosFormato = minutos.toString().padStart(2, '0');

            return `${horasFormato}:${minutosFormato}:00`;
        }

        const dias = document.getElementById('dias').value || 0;
        const horas = document.getElementById('horas').value || 0;
        const minutos = document.getElementById('minutos').value || 0;

        const duracionCurso = formatTime(dias, horas, minutos);

        const presentador = document.getElementById('presentador_menu').value;


        if (!nombreCurso || !documentoObtenido || !duracionCurso || !presentador) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }


        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCurso, nombreCurso, documentoObtenido, duracionCurso, presentador })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarCursos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarCurso(pkCurso) {
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

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarCursos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function modalCurso(modo, pkCurso) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel5');
    const modalButton = document.querySelector('#boostrapModal-5 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar curso';
        modalButton.setAttribute('onclick', 'agregarCurso()');

        document.getElementById('nombreCurso').value = '';
        document.getElementById('documento_menu').value = '';
        document.getElementById('dias').value = '';
        document.getElementById('horas').value = '';
        document.getElementById('minutos').value = '';
        document.getElementById('presentador_menu').value = '';
        
    } else if (modo === 2) {

        $('#boostrapModal-5').modal('show');
        modalTitle.textContent = 'Editar curso';
        modalButton.setAttribute('onclick', `editarCurso(${pkCurso})`);

    }

}


