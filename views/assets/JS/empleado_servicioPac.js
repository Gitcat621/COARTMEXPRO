$("#agregarPAC").click(function() {
    abrirModalServiciosPac(1);
});

//BENEFICIOS
async function listarBeneficios() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/beneficios`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        const select = document.getElementById('beneficio_menu');
        select.innerHTML = "";


        data.forEach(bene => {

            let option = document.createElement('option');
            option.value = bene.pkBeneficio;
            option.textContent = bene.nombreBeneficio;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de beneficios no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function listarClinicas() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/clinicas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        const select = document.getElementById('clinica_menu');
            document.getElementById('clinica_menu').innerHTML = "";

            // Mapear en un select
            data.forEach(Clinicas => {

                let option = document.createElement('option');
                option.value = Clinicas.pkClinica;
                option.textContent = Clinicas.nombreClinica;
                select.appendChild(option);
            }
        );

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar las Clinicas`, 'Error', {"closeButton": true,});
    }
}

async function agregarServicioPacEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const numeroSesion = document.getElementById('numeroSesion').value;

        const fechaSesion = document.getElementById('fechaSesion').value;

        const costoSesion = document.getElementById('costoSesion').value;

        const montoApoyo = document.getElementById('montoApoyoPAC').value;

        const fkBeneficio = document.getElementById('beneficio_menu').value;

        const fkClinica = document.getElementById('clinica_menu').value;


        if (!numeroEmpleado || !numeroSesion || !fechaSesion || !costoSesion || !montoApoyo || !fkBeneficio || !fkClinica) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_pac', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, numeroSesion, fechaSesion, costoSesion, montoApoyo, fkBeneficio, fkClinica })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-6').modal('hide');


        obtenerServiciosPacEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarServicioPacEmpleado(pkServicioPac) {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const numeroSesion = document.getElementById('numeroSesion').value;

        const fechaSesion = document.getElementById('fechaSesion').value;

        const costoSesion = document.getElementById('costoSesion').value;

        const montoApoyo = document.getElementById('montoApoyoPAC').value;

        const fkBeneficio = document.getElementById('beneficio_menu').value;

        const fkClinica = document.getElementById('clinica_menu').value;


        if (!pkServicioPac || !numeroSesion || !fechaSesion || !costoSesion || !montoApoyo || !fkBeneficio || !fkClinica) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_pac', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkServicioPac, numeroSesion, fechaSesion, costoSesion, montoApoyo, fkBeneficio, fkClinica })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-6').modal('hide');


        obtenerServiciosPacEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarServicioPac(pkServicioPac) {
    try {
        if (!pkServicioPac) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/servicios_pac', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkServicioPac })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalServiciosPac(modo, servicio) {

    if (modo === 1) {

        document.getElementById('myModalLabel6').textContent = 'Agregar servicio tomado PAC';
        
        document.getElementById('beneficio_menu').value = '';
        document.getElementById('numeroSesion').value = '';
        document.getElementById('fechaSesion').value = '';
        document.getElementById('costoSesion').value = '';
        document.getElementById('clinica_menu').value = '';
        document.getElementById('montoApoyo').value = '';

        document.getElementById('newPAC').textContent = 'Agregar';
        document.getElementById('newPAC').setAttribute('onclick', 'agregarServicioPacEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel6').textContent = 'Editar servicio tomado PAC';

        document.getElementById('beneficio_menu').value = servicio.fkBeneficio;
        document.getElementById('numeroSesion').value = servicio.numeroSesion;
        document.getElementById('costoSesion').value = servicio.costoSesion;
        document.getElementById('clinica_menu').value = servicio.fkClinica;


        const fecha = new Date(servicio.fechaSesion);
        const año = fecha.getUTCFullYear();
        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia = String(fecha.getUTCDate()).padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${dia}`;
        document.getElementById('fechaSesion').value = fechaFormateada;

        document.getElementById('montoApoyoPAC').value = servicio.montoApoyo;


        document.getElementById('newPAC').textContent = 'Actualizar';
    
        document.getElementById('newPAC').setAttribute('onclick', `editarServicioPacEmpleado(${servicio.pkServicioPac})`);

        $('#boostrapModal-6').modal('show');

    }

    
}