$(document).ready(function () {

    $('#miDropify').dropify();

    $('#relojTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Peso / Tamaño" },
            { title: "Fecha de subida" },
            { title: "Ruta de almacenamiento" },
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
    $('#relojTable').on('click', '.editar-btn', function () {

        alert("Como presionaste este boton?");

    });

    // Eliminar
    $('#relojTable').on('click', '.eliminar-btn', function () {

        const rowData = $(this).data('row');

        const nombreArchivo = rowData[0];

        Swal.fire({
            title: `¿Eliminar a ${nombreArchivo}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarArchivo(nombreArchivo);    
            }
        });
        
    });

    listarArchivos();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
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
        const response = await fetch('/api/reportes_reloj_checador/', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        console.log(data);

        Swal.close();

        if (!response.ok) {

            toastr.error(data.mensaje, 'Error', {"closeButton": true});
            const listaHTML = data.detalles.map(m => `<li>${m}</li>`).join("");

            Swal.fire({
            width: 500,
            title: "Archivo subido",
            html: `<p>${data.mensaje}</p><ul>${listaHTML}</ul>`,
            icon: 'error',
            });
            return;
        }

        const listaHTML = data.detalles.map(m => `<li>${m}</li>`).join("");

        Swal.fire({
          width: 500,
          title: "Archivo subido",
          html: `<p>${data.mensaje}</p><ul>${listaHTML}</ul>`,
          icon: 'success',
        });

        // Acciones posteriores (Cerrar modal y actualizar lista)
        $('#boostrapModal-1').modal('hide');
        listarArchivos();

    } catch (error) {

        Swal.close();

        console.error('Error:', error);

        toastr.error('No se pudo concretar la accion', 'Error', {"closeButton": true,});
    }
}


async function listarArchivos() {
    try {
        // Petición GET al servidor
        const response = await fetch('/api/reportes_reloj_checador', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {

            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        const data = await response.json();

        //console.log(data);

        try{

            // Iniciar la datatable y asignarla a una variable
            let tabla = $('#relojTable').DataTable();

            // Limpiar la tabla antes de agregar nuevos datos
            tabla.clear().draw();

            // Agregar los nuevos datos
            tabla.rows.add(data.map((asistencias) => [
                asistencias.nombreArchivo,
                asistencias.peso / 1e+6 + " Mbs",
                asistencias.fechaSubida,
                asistencias.ruta,
                asistencias.pkArchivo
            ])).draw();
            

        }catch{

            toastr.error('No se pudo mapear en el elemento', 'Error', {"closeButton": true});

        }
        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('Error al obtener los reportes del reloj en sistema', 'Error', {"closeButton": true});
    }
}


async function eliminarArchivo(nombreArchivo) {

    // Verificar si llega el id
    if (!nombreArchivo) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        // Enviar los datos al backend (Flask) para eliminar
        const response = await fetch('/api/reportes_reloj_checador', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreArchivo })
        });

        const data = await response.json();

        if (!response.ok) {

            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true});

            throw new Error('Hubo un problema al enviar la solicitud');
        }

      

        // Mostrar el mensaje de la respuesta de la API
        listarArchivos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
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
