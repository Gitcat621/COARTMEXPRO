$(document).ready(function () {

    $('#miDropify').dropify();
  
});

//Asignar funcion al boton de abrir modal
$("#agregarCSF").click(function() {

    const dropifyInput = $('#archivoSubido').dropify();
    dropifyInput.data('dropify').clearElement();

    //document.getElementById('fechaIngreso').value = '';

    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    modalTitle.textContent = 'Actualizar constancia';
    modalButton.setAttribute('onclick', 'agregarArchivo()');

});

async function agregarArchivo(tipo) {

    const archivo = document.getElementById('archivoSubido').files[0];
    //const vigencia = document.getElementById('fechaIngreso').value;

    if (!archivo) {

        toastr.warning('Por favor selecciona un archivo.', 'Advertencia', {"closeButton": true});

        return;
    }
    // if(!vigencia){

    //     toastr.warning('Por favor ingresa la vigencia.', 'Advertencia', {"closeButton": true});

    //     return;
    // }

    const formData = new FormData();
    formData.append('archivo', archivo);
    //formData.append('vigencia', vigencia);

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
        const response = await fetch('/api/constancias_situacion_fiscal/documentos', {
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

        const iframe = document.getElementById(`iframe`);
        iframe.src = iframe.src; // Volver a asignar la misma URL

        toastr.success(`${data.mensaje}`, 'Completado', {"closeButton": true,});

        $('#boostrapModal-1').modal('hide');

    } catch (error) {

        Swal.close();

        console.error('Error:', error);

        toastr.error('No se pudo concretar la accion', 'Error', {"closeButton": true,});
    }
}