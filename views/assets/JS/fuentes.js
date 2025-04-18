$(document).ready(function () {

    listarArchivos();

    if (sessionStorage.getItem("departamento") !== 'Admon. Contable y Fiscal' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }

    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

$(document).ready(function() {
    $('#miDropify').dropify();
});

//Inicializar datatable
$(document).ready(function() {


    $('#fuenteTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Peso / Tamaño" },
            { title: "fecha de subida" },
            { title: "ruta de almacenamiento" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
    
                                <button class="btn btn-danger btn-sm eliminar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });


    // Event listeners para los botones
    // Editar
    $('#fuenteTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreArchivo = rowData[0];
        const pkArchivo = rowData[4];

        abrirModal(2,pkArchivo, nombreArchivo);
    });

    // Eliminar
    $('#fuenteTable').on('click', '.eliminar-btn', function () {

        const rowData = $(this).data('row');

        const nombreArchivo = rowData[0];
        const pkArchivo = rowData[4];

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarArchivo(pkArchivo, nombreArchivo);    
        });
        
    });

});


// Función para validar archivo antes de enviarlo
function validarArchivo() {

    const archivo = document.getElementById('archivoSubido').files[0];

    if (!archivo) {

        toastr.warning('Por favor selecciona un archivo.', 'Advertencia', {"closeButton": true});

        return null;
    }

    const nombreArchivo = archivo.name;

    const extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.')).toLowerCase();

    const extensionesValidas = ['.xlsx', '.xls'];

    if (!extensionesValidas.includes(extension)) {

        Swal.fire({
            title: "Archivo invalido",
            text: "Por favor seleccionar un archivo valido para la subida",
            icon: "warning"
          });

        return null;
    }

    return archivo;
}

// Función asíncrona para enviar el archivo al backend
async function agregarArchivo() {

    const archivo = validarArchivo();

    if (!archivo) return; // Detiene el proceso si no es válido

    const formData = new FormData();
    formData.append('archivo', archivo);

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
        const response = await fetch('http://127.0.0.1:5000/coartmex/archivos', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {

            //Esto fuerza un error
            //throw new Error(`Error en la subida: ${response.status}`);
        }

        const data = await response.json();

        Swal.close();

        console.log(data.mensaje);

        // Mostrar mensaje de éxito o error

        const tipoMensaje = data.mensaje.includes('correctamente') ? 'success' : 'error';

        Swal.fire({

            title: tipoMensaje === 'success' ? "Archivo subido" : "No se pudo subir el archivo",
            text: data.mensaje,
            icon: tipoMensaje,
        });

        toastr[tipoMensaje](data.mensaje, 'Resultado', {"closeButton": true});

        // Acciones posteriores (Cerrar modal y actualizar lista)
        $('#boostrapModal-1').modal('hide');
        listarArchivos();

    } catch (error) {

        Swal.close();

        console.error('Error:', error);

        toastr.error('No se pudo concretar la accion', 'Error', {"closeButton": true,});
    }
}



function listarArchivos() {

    //Peticion GET al servidor
    fetch('http://127.0.0.1:5000/coartmex/archivos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#fuenteTable').DataTable();
        
       // Limpiar la tabla antes de agregar nuevos datos
       tabla.clear().draw();

       // Agregar los nuevos datos
       tabla.rows.add(data.map((fuentes) => [
        
            fuentes.nombreArchivo, fuentes.peso/1e+6 + " Mbs", fuentes.fechaSubida, fuentes.ruta, fuentes.pkArchivo

       ])).draw();
   })
   .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarArchivo(pkArchivo, nombreArchivo){   

    // Evita que se envíe el formulario si falta pkArchivo o nombreArchivo
    if (!pkArchivo || !nombreArchivo) {
        toastr.error('No se pudieron obtener los datos.', 'Error', {"closeButton": true});
        return false;
    }

    // Obtiene el archivo del input
    const archivo = document.getElementById('archivoSubido').files[0];

    // Evita que se envíe el formulario si no hay archivo
    if (!archivo) {
        toastr.warning('Por favor selecciona un archivo.', 'Advertencia', {"closeButton": true});
        return false;
    }

    // Obtiene la extensión del archivo
    const EnombreArchivo = archivo.name;
    const extension = EnombreArchivo.substring(EnombreArchivo.lastIndexOf('.')).toLowerCase();

    // Extensiones permitidas
    const extensionesValidas = ['.xlsx', '.xls', '.pdf'];

    if (!extensionesValidas.includes(extension)) {
        toastr.warning('Por favor, selecciona un archivo válido.', 'Advertencia', {"closeButton": true});
        return false;
    }

    // Crear FormData y agregar datos
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('pkArchivo', pkArchivo);
    formData.append('nombreArchivo', nombreArchivo);

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/archivos', {
        method: 'PUT',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarArchivos();
        
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;
    });
}

function eliminarArchivo(pkArchivo, nombreArchivo){

    // Verificar si llega el id
    if (!pkArchivo || !nombreArchivo) {


        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/archivos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkArchivo, nombreArchivo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarArchivos();

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});
        return;

    });
}

function abrirModal(modo, pkArchivo, nombreArchivo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar Archivo';
        modalButton.setAttribute('onclick', 'agregarArchivo()');

        document.getElementById('archivoSubido').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar Archivo';
        modalButton.setAttribute('onclick', `editarArchivo('${pkArchivo}', '${nombreArchivo}')`);

    }

}


