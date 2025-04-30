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
    $('#fuenteTable').on('click', '.editar-btn', function () {

        // const rowData = $(this).data('row'); 

        // const nombreArchivo = rowData[0];
        // const pkArchivo = rowData[4];

        // abrirModal(2,pkArchivo, nombreArchivo);
        alert("Como presionaste este boton?");
    });

    // Eliminar
    $('#fuenteTable').on('click', '.eliminar-btn', function () {

        const rowData = $(this).data('row');

        const nombreArchivo = rowData[0];


        var modal = $('[data-remodal-id="remodal"]').remodal();

        document.getElementById("itemDelete").textContent = nombreArchivo;

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarArchivo(nombreArchivo);    
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

        const tipoMensaje = (
            data.mensaje.includes('correctamente') || 
            data.mensaje.includes('con errores')
        ) ? 'success' : 'error';
        

        const listaHTML = data.detalles.map(m => `<li>${m}</li>`).join("");

        Swal.fire({
          width: 500,
          title: tipoMensaje === 'success' ? "Archivo subido" : "No se pudo subir el archivo",
          html: `<p>${data.mensaje}</p><ul>${listaHTML}</ul>`,
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

async function editarArchivo(pkArchivo, nombreArchivo) {   

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

    try {
        // Enviar los datos al backend (Flask) para editar
        const response = await fetch('http://127.0.0.1:5000/coartmex/archivos', {
            method: 'PUT',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {

            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true});

            throw new Error('Hubo un problema al enviar la solicitud');
        }

        // Mostrar el mensaje de la respuesta de la API
        listarArchivos();
        
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});
        
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});
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
        const response = await fetch('http://127.0.0.1:5000/coartmex/archivos', {
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


document.getElementById('archivoSubido').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Validar que sea un archivo de Excel
    const extensionesValidas = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!extensionesValidas.includes(archivo.type)) {
        alert('Por favor, selecciona un archivo de Excel (.xlsx o .xls)');
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {
        const datos = new Uint8Array(e.target.result);
        const workbook = XLSX.read(datos, { type: 'array' });

        // Mostrar nombres de hojas
        const hojas = workbook.SheetNames;
        const contenedor = document.getElementById('contenidoExcel');
        contenedor.innerHTML = ''; // Limpiar contenido previo

        hojas.forEach(nombreHoja => {
            const hoja = workbook.Sheets[nombreHoja];
            const datosJSON = XLSX.utils.sheet_to_json(hoja, { header: 1 }); // Array de arrays

            // Contenedor con scroll
            let tablaHTML = `<h4>Hoja: ${nombreHoja}</h4>
                <div class='' style="overflow: auto; max-width: 100%; max-height: 400px; border: 1px solid #ccc;">
                    <table class='table table-bordered table-hover' cellpadding="5" style="width: max-content;">
                        `;
            datosJSON.forEach(fila => {
                tablaHTML += "<tr>";
                fila.forEach(celda => {
                    tablaHTML += `<td>${celda ?? ''}</td>`;
                });
                tablaHTML += "</tr>";
            });
            tablaHTML += "</table></div><br>";
            contenedor.innerHTML += tablaHTML;
        });
    };

    lector.readAsArrayBuffer(archivo);
});

//Mas bonita y datatable (Tiene errores)
// document.getElementById('archivoExcel').addEventListener('change', function (e) {
//     const archivo = e.target.files[0];
//     if (!archivo) return;

//     const lector = new FileReader();

//     lector.onload = function (e) {
//         const datos = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(datos, { type: 'array' });

//         const hojas = workbook.SheetNames;
//         const contenedor = document.getElementById('contenidoExcel');
//         contenedor.innerHTML = ''; // Limpiar previo

//         hojas.forEach((nombreHoja, index) => {
//             const hoja = workbook.Sheets[nombreHoja];
//             const datosJSON = XLSX.utils.sheet_to_json(hoja, { header: 1 });

//             if (datosJSON.length === 0) return;

//             const encabezados = datosJSON[0];
//             const filas = datosJSON.slice(1).filter(fila => fila.length === encabezados.length);

//             // Crear HTML con tabla única
//             const idTabla = `tablaExcel_${index}`;
//             contenedor.innerHTML += `
//                 <div style="margin-bottom: 30px;">
//                     <h4>Hoja: ${nombreHoja}</h4>
//                     <div style="overflow-x:auto">
//                         <table id="${idTabla}" class="display nowrap" style="width:100%">
//                             <thead><tr>${encabezados.map(col => `<th>${col}</th>`).join('')}</tr></thead>
//                             <tbody></tbody>
//                         </table>
//                     </div>
//                 </div>
//             `;

//             // Inicializar DataTable luego de crear el DOM
//             const tabla = $(`#${idTabla}`).DataTable({
//                 data: filas,
//                 scrollX: true,
//                 pageLength: 10,
//                 responsive: true
//             });
//         });
//     };

//     lector.readAsArrayBuffer(archivo);
// });
