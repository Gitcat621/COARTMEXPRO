
$("#agregarOportunidad").click(function() {
    abrirModalOportunidades(1);
});

//OPORTUNIDADES
async function listarOportunidades() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/oportunidades`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        const select = document.getElementById('oportunidad_menu');
        select.innerHTML = "";


        data.forEach(oport => {

            let option = document.createElement('option');
            option.value = oport.pkOportunidad;
            option.textContent = oport.oportunidad;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de oportunidades no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function agregarOportunidadEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('oportunidad_menu');
        const fkOportunidad = Menu.value;


        if (!numeroEmpleado || !fkOportunidad) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidad_empleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fkOportunidad })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-4').modal('hide');


        obtenerOportunidadesEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarOportunidadEmpleado(fkOportunidadAnterior) {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('oportunidad_menu');
        const fkOportunidadNueva = Menu.value;


        if (!numeroEmpleado || !fkOportunidadAnterior || !fkOportunidadNueva) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidad_empleado', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fkOportunidadAnterior, fkOportunidadNueva })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-4').modal('hide');


        obtenerOportunidadesEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarOportunidad(fkOportunidad, fkEmpleado) {
    try {
        if (!fkOportunidad || !fkEmpleado) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidad_empleado', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fkOportunidad, fkEmpleado })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalOportunidades(modo, oportunidad) {

    if (modo === 1) {

        document.getElementById('myModalLabel4').textContent = 'Agregar oportunidad';
        
        document.getElementById('oportunidad_menu').value = '';

        document.getElementById('newOpportunity').textContent = 'Agregar';
        document.getElementById('newOpportunity').setAttribute('onclick', 'agregarOportunidadEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel4').textContent = 'Editar oportunidad';

        document.getElementById('oportunidad_menu').value = oportunidad.fkOportunidad;

        document.getElementById('newOpportunity').textContent = 'Actualizar';
    
        document.getElementById('newOpportunity').setAttribute('onclick', `editarOportunidadEmpleado(${oportunidad.fkOportunidad})`);

        $('#boostrapModal-4').modal('show');

    }

    
}