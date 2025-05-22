$("#agregarPrestamo").click(function() {
    abrirModalPrestamos(1);
});

//PRESTAMOS
async function agregarPrestamoEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const motivoPrestamo = document.getElementById('motivoPrestamo').value;

        const montoPrestamo = document.getElementById('montoPrestamo').value;

        const formaPago = document.getElementById('formaPago_menu').value;

        const fechaPrestamo = document.getElementById('fechaPrestamo').value;

        const montoApoyo = document.getElementById('montoApoyo').value;

        const fechaTerminoPago = document.getElementById('fechaTerminoPago').value;


        if (!numeroEmpleado || !motivoPrestamo || !montoPrestamo || !formaPago || !fechaPrestamo || !montoApoyo || !fechaTerminoPago) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/prestamos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, motivoPrestamo, montoPrestamo, formaPago, fechaPrestamo, montoApoyo, fechaTerminoPago })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-5').modal('hide');


        obtenerPrestamosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function editarPrestamoEmpleado(pkPrestamo) {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const motivoPrestamo = document.getElementById('motivoPrestamo').value;

        const montoPrestamo = document.getElementById('montoPrestamo').value;

        const formaPago = document.getElementById('formaPago_menu').value;

        const fechaPrestamo = document.getElementById('fechaPrestamo').value;

        const montoApoyo = document.getElementById('montoApoyo').value;

        const fechaTerminoPago = document.getElementById('fechaTerminoPago').value;


        if (!pkPrestamo || !motivoPrestamo || !montoPrestamo || !formaPago || !fechaPrestamo || !montoApoyo || !fechaTerminoPago) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/prestamos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPrestamo, motivoPrestamo, montoPrestamo, formaPago, fechaPrestamo, montoApoyo, fechaTerminoPago })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-5').modal('hide');


        obtenerPrestamosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

async function eliminarPrestamo(pkPrestamo) {
    try {
        if (!pkPrestamo) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/prestamos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkPrestamo })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalPrestamos(modo, prestamo) {

    if (modo === 1) {

        document.getElementById('myModalLabel5').textContent = 'Agregar prestamo';
        
        document.getElementById('motivoPrestamo').value = '';
        document.getElementById('montoPrestamo').value = '';
        document.getElementById('formaPago_menu').value = '';
        document.getElementById('fechaPrestamo').value = '';
        document.getElementById('montoApoyo').value = '';
        document.getElementById('fechaTerminoPago').value = '';

        document.getElementById('newLending').textContent = 'Agregar';
        document.getElementById('newLending').setAttribute('onclick', 'agregarPrestamoEmpleado()');

        
    } else if (modo === 2) {

        document.getElementById('myModalLabel5').textContent = 'Editar prestamo';

        document.getElementById('motivoPrestamo').value = prestamo.motivoPrestamo;
        document.getElementById('montoPrestamo').value = prestamo.montoPrestamo;

        // Obtener el elemento select
        let selectElement = document.getElementById("formaPago_menu");

        // Recorrer las opciones para encontrar la que coincide con el texto y seleccionar su valor
        for (let option of selectElement.options) {
            if (option.text === prestamo.formaPago) {
                selectElement.value = option.value;
                break;
            }
        }

        const fecha1 = new Date(prestamo.fechaPrestamo);
        const año1 = fecha1.getUTCFullYear();
        const mes1 = String(fecha1.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia1 = String(fecha1.getUTCDate()).padStart(2, '0');
        const fechaFormateada1 = `${año1}-${mes1}-${dia1}`;
        document.getElementById('fechaPrestamo').value = fechaFormateada1;

        document.getElementById('montoApoyo').value = prestamo.montoApoyo;

        const fecha2 = new Date(prestamo.fechaTerminoPago);
        const año2 = fecha2.getUTCFullYear();
        const mes2 = String(fecha2.getUTCMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const dia2 = String(fecha2.getUTCDate()).padStart(2, '0');
        const fechaFormateada2 = `${año2}-${mes2}-${dia2}`;
        document.getElementById('fechaTerminoPago').value = fechaFormateada2;

        document.getElementById('newLending').textContent = 'Actualizar';
    
        document.getElementById('newLending').setAttribute('onclick', `editarPrestamoEmpleado(${prestamo.pkPrestamo})`);

        $('#boostrapModal-5').modal('show');

    }

    
}