$("#agregarReunionIntegracion").click(function() {
    abrirModalReunionIntegracion(1);
});

async function agregarReunionIntegracionEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const fechaAsistencia = document.getElementById('fechaAsistenciaRI').value;


        if (!numeroEmpleado || !fechaAsistencia) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/reunionesIntegracion_empleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fechaAsistencia})
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-7').modal('hide');


        obtenerAsistenciaReunionesIntegracionEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarReunionIntegracionEmpleado(pkReunionIntegracion) {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const fechaAsistencia = document.getElementById('fechaAsistenciaRI').value;

        if (!pkReunionIntegracion || !fechaAsistencia) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/reunionesIntegracion_empleado', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkReunionIntegracion, fechaAsistencia})
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-7').modal('hide');


        obtenerAsistenciaReunionesIntegracionEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarReunionIntegracion(pkReunionIntegracion) {
    try {
        if (!pkReunionIntegracion) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/reunionesIntegracion_empleado', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkReunionIntegracion })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalReunionIntegracion(modo, reunionIntegracion) {

    if (modo === 1) {

        document.getElementById('myModalLabel7').textContent = 'Agregar asistencia a reunion de integracion';
        
        document.getElementById('fechaAsistenciaRI').value = '';


        document.getElementById('newMeeting').textContent = 'Agregar';
        document.getElementById('newMeeting').setAttribute('onclick', 'agregarReunionIntegracionEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel7').textContent = 'Editar asistencia a reunion de integracion';


        const fecha = new Date(reunionIntegracion.fechaAsistencia);
        const año = fecha.getUTCFullYear();
        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fecha.getUTCDate()).padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${dia}`;
        document.getElementById('fechaAsistenciaRI').value = fechaFormateada;


        document.getElementById('newMeeting').textContent = 'Actualizar';
    
        document.getElementById('newMeeting').setAttribute('onclick', `editarReunionIntegracionEmpleado(${reunionIntegracion.pkReunionIntegracion})`);

        $('#boostrapModal-7').modal('show');

    }

    
}