$(document).ready(function () {

     $('#miDropify').dropify();

    for (var i = 1; i < 4; i++) {

        listarArchivos(i);

    }

    
});

//Asignar funcion al boton de abrir modal
$("#agregarCirculacion").click(function() {

    const dropifyInput = $('#archivoSubido').dropify();
    dropifyInput.data('dropify').clearElement();

    document.getElementById('fechaIngreso').value = '';

    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    modalTitle.textContent = 'Actualizar tarjeta de circulacion';
    modalButton.setAttribute('onclick', 'agregarArchivo(1)');

});

$("#agregarMercantil").click(function() {

    const dropifyInput = $('#archivoSubido').dropify();
    dropifyInput.data('dropify').clearElement();

    document.getElementById('fechaIngreso').value = '';

    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    modalTitle.textContent = 'Actualizar permiso mercantil';
    modalButton.setAttribute('onclick', 'agregarArchivo(2)');
});

$("#agregarSeguro").click(function() {

    const dropifyInput = $('#archivoSubido').dropify();
    dropifyInput.data('dropify').clearElement();

    document.getElementById('fechaIngreso').value = '';

    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    modalTitle.textContent = 'Actualizar poliza de seguro';
    modalButton.setAttribute('onclick', 'agregarArchivo(3)');
});


function listarArchivos(tipo) {

    //Peticion GET al servidor
    fetch(`/api/documentos_logistica_comercial/documentos?tipo=${tipo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        let contenedor;
        if(tipo === 1){
            contenedor = document.getElementById('vigencia1');
        }else if(tipo ===2){
            contenedor = document.getElementById('vigencia2');
        }else{
            contenedor = document.getElementById('vigencia3');
        }
        contenedor.innerHTML = toformatearFecha(data.vigencia);
   })
   .catch(error => console.error("Error al cargar los datos:", error));
    
}

async function agregarArchivo(tipo) {

    const archivo = document.getElementById('archivoSubido').files[0];
    const vigencia = document.getElementById('fechaIngreso').value;

    if (!archivo) {

        toastr.warning('Por favor selecciona un archivo.', 'Advertencia', {"closeButton": true});

        return;
    }
    if(!vigencia || !tipo){

        toastr.warning('Por favor ingresa la vigencia.', 'Advertencia', {"closeButton": true});

        return;
    }

    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);
    formData.append('vigencia', vigencia);

    Swal.fire({

        title: 'Subiendo archivo...',
        text: 'Por favor espera mientras se procesa el archivo.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const response = await fetch('/api/documentos_logistica_comercial/documentos', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            Swal.close();
            return;
        }

        
        Swal.close();

        const iframe = document.getElementById(`iframe${tipo}`);
        iframe.src = iframe.src; // Volver a asignar la misma URL



        toastr.success(`${data.mensaje}`, 'Completado', {"closeButton": true,});


        $('#boostrapModal-1').modal('hide');
        listarArchivos(tipo);

    } catch (error) {

        Swal.close();

        console.error('Error:', error);

        toastr.error('No se pudo concretar la accion', 'Error', {"closeButton": true,});
    }
}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const fechaFormateada = fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });

    // Capitalizar primera letra del resultado
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}
