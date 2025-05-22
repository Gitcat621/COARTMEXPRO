$(document).ready(function () {

    listarCursos();

});

//CURSOS
async function listarCursos() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/cursos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('curso_menu');
        select.innerHTML = "";


        data.forEach(curso => {

            let option = document.createElement('option');
            option.value = curso.pkCurso;
            option.textContent = curso.nombreCurso;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de cursos no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

$("#agregarCurso").click(function() {
    abrirModalCursos(1);
});

async function agregarCursoEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('curso_menu');
        const fkCurso = Menu.value;

        const fechaAsistencia = document.getElementById('fechaAsistencia').value;

        if (!numeroEmpleado || !fkCurso || !fechaAsistencia) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/asistencia_cursos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fkCurso, fechaAsistencia })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-2').modal('hide');


        obtenerCursosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarCursoEmpleado(pkAsistenciaCurso) {

    try {
        
        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('curso_menu');
        const fkCurso = Menu.value;

        const fechaAsistencia = document.getElementById('fechaAsistencia').value;

        if (!pkAsistenciaCurso || !numeroEmpleado || !fkCurso || !fechaAsistencia) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/asistencia_cursos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkAsistenciaCurso, numeroEmpleado, fkCurso, fechaAsistencia })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});

        obtenerCursosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarCurso(pkAsistenciaCurso) {
    try {
        if (!pkAsistenciaCurso) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cursos_empleado', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkAsistenciaCurso })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalCursos(modo, curso) {

    if (modo === 1) {

        document.getElementById('myModalLabel2').textContent = 'Agregar asistencia de cursos';
        
        document.getElementById('curso_menu').value = '';
        document.getElementById('fechaAsistencia').value = '';

        document.getElementById('newCourse').textContent = 'Agregar';
        document.getElementById('newCourse').setAttribute('onclick', 'agregarCursoEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel2').textContent = 'Editar asistencia de cursos';
        document.getElementById('curso_menu').value = curso.pkCurso;

        const fecha = new Date(curso.fechaAsistencia);

        const año = fecha.getUTCFullYear();
        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fecha.getUTCDate()).padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${dia}`;
        document.getElementById('fechaAsistencia').value = fechaFormateada;
        document.getElementById('newCourse').textContent = 'Actualizar';
        
        $('#boostrapModal-2').modal('show');

        document.getElementById('newCourse').setAttribute('onclick', `editarCursoEmpleado(${curso.pkAsistenciaCurso})`);

    }

    
}


