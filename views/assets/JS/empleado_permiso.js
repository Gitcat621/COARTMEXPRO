//PERMISOS
$("#agregarPermiso").click(function() {
    abrirModalPermisos(1);
});

async function agregarPermisoEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const descripcionPermiso = document.getElementById('descripcionPermiso').value;

        const fechaPermiso = document.getElementById('fechaPermiso').value;

        if (!numeroEmpleado || !descripcionPermiso || !fechaPermiso) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/permisos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, descripcionPermiso, fechaPermiso })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-3').modal('hide');


        obtenerPermisosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarPermisoEmpleado(pkPermiso) {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const descripcionPermiso = document.getElementById('descripcionPermiso').value;

        const fechaPermiso = document.getElementById('fechaPermiso').value;

        if (!pkPermiso || !numeroEmpleado || !descripcionPermiso || !fechaPermiso) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/permisos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPermiso, descripcionPermiso, fechaPermiso })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-3').modal('hide');


        obtenerPermisosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarPermiso(pkPermiso) {
    try {
        if (!pkPermiso) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/permisos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPermiso })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalPermisos(modo, permiso) {

    if (modo === 1) {

        document.getElementById('myModalLabel3').textContent = 'Agregar permiso otorgado';
        
        document.getElementById('descripcionPermiso').value = '';
        document.getElementById('fechaPermiso').value = '';

        document.getElementById('newPermission').textContent = 'Agregar';
        document.getElementById('newPermission').setAttribute('onclick', 'agregarPermisoEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel3').textContent = 'Editar permiso otorgado';

        document.getElementById('descripcionPermiso').value = permiso.descripcionPermiso;

        const fecha = new Date(permiso.fechaPermiso);

        const año = fecha.getUTCFullYear();
        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fecha.getUTCDate()).padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${dia}`;
        document.getElementById('fechaPermiso').value = fechaFormateada;

        document.getElementById('newPermission').textContent = 'Actualizar';
    
        document.getElementById('newPermission').setAttribute('onclick', `editarPermisoEmpleado(${permiso.pkPermiso})`);

        $('#boostrapModal-3').modal('show');

    }

    
}
