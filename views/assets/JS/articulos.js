$(document).ready(function () {

    listarArticulos();
    listarProveedores();
    listarCategoriaArticulos();
    
});


//Listar los registros foraneos
async function listarProveedores() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('proveedor_menu').innerHTML = "";

        // Mapear en un select
        data.forEach((proveedor) => {
            let HTML = `<option value="${proveedor.pkProveedor}">${proveedor.nombreProveedor}</option>`;
            document.getElementById('proveedor_menu').innerHTML += HTML;
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function listarCategoriaArticulos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('categoria_menu').innerHTML = "";

        // Mapear en un select
        data.forEach((categoria) => {
            let HTML = `<option value="${categoria.pkCategoriaArticulo}">${categoria.nombreCategoriaArticulo}</option>`;
            document.getElementById('categoria_menu').innerHTML += HTML;
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

//Asignar funcion al boton de abrir modal
$("#agregarArticulo").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#articuloTable').DataTable({
        columns: [
            { title: "Codigo del articulo" },
            { title: "Nombre del articulo" },
            { title: "Costo" },
            { title: "Proveedor" },
            { title: "Categoria" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[0]}" data-nombre="${row[1]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
        dom: 'Bfrtip', // 🔹 Activa la barra de botones
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Descargar Excel',
                className: 'btn btn-success',
                title: 'Listado de Artículos' // Nombre del archivo
            }
        ]
    });


    // Event listeners para los botones
    // Editar
    $('#articuloTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const codigoArticulo = rowData[0];
        const nombreArticulo = rowData[1];
        const precioAlmacen = rowData[2];
        const fkProveedor = rowData[5];
        const fkCategoriaArticulo = rowData[6];

        document.getElementById('codigoArticulo').value = codigoArticulo;
        document.getElementById('nombreArticulo').value = nombreArticulo;
        document.getElementById('precioAlmacen').value = precioAlmacen;
        document.getElementById('categoria_menu').value = fkCategoriaArticulo;
        document.getElementById('proveedor_menu').value = fkProveedor;

        abrirModal(2,codigoArticulo);
    });

    // Eliminar
    $('#articuloTable').on('click', '.eliminar-btn', function () {

        const codigoArticulo = $(this).data('pk');

        const nombreArticulo = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreArticulo}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarArticulo(codigoArticulo);    
            }
        });

        
    });
    

});

async function agregarArticulo() {
    try {


        // Obtener los datos del formulario
        const codigoArticulo = document.getElementById('codigoArticulo').value.trim();


        const nombreArticulo = document.getElementById('nombreArticulo').value.trim();


        const precioAlmacen = document.getElementById('precioAlmacen').value.trim();


        const proveedorMenu = document.getElementById('proveedor_menu');
        const fkProveedor = proveedorMenu.value;


        const categoriaMenu = document.getElementById('categoria_menu');
        const fkCategoriaArticulo = categoriaMenu.value;


        // Verificar si todos los campos están completos
        if (!codigoArticulo || !nombreArticulo || !precioAlmacen || !fkProveedor || !fkCategoriaArticulo) {

            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;

        }

        const bodyData = {
            codigoArticulo: codigoArticulo,
            nombreArticulo: nombreArticulo,
            precioAlmacen: parseFloat(precioAlmacen), // Convertir a número decimal
            fkProveedor: parseInt(fkProveedor), // Convertir a entero
            fkCategoriaArticulo: parseInt(fkCategoriaArticulo) // Convertir a entero
        };

        // Enviar los datos al backend (Flask) para insertar
        const response = await fetch('http://127.0.0.1:5000/coartmex/articulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;
            //throw new Error(`Error HTTP: ${response.status}`);

        }

    
        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        // Acciones posteriores (Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarArticulos();

    } catch (error) {

        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });

    }
}

async function listarArticulos() {

    try {

        // Petición GET al servidor
        const response = await fetch(`http://127.0.0.1:5000/coartmex/articulos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Iniciar la datatable y asignarla a una variable
        let tabla = $('#articuloTable').DataTable();

        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((articulos) => [
            //    0                              1                      2                               3             
            articulos.codigoArticulo, articulos.nombreArticulo, '$' + articulos.precioAlmacen, articulos.nombreProveedor,
            //                       4                   5                               6                         
            articulos.nombreCategoriaArticulo, articulos.fkProveedor, articulos.fkCategoriaArticulo
        ])).draw();

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function editarArticulo(codigoArticuloOriginal) {
    try {
        // Obtener los datos del formulario
        const codigoArticulo = document.getElementById('codigoArticulo').value.trim();
        const nombreArticulo = document.getElementById('nombreArticulo').value.trim();
        const precioAlmacen = document.getElementById('precioAlmacen').value.trim();
        const proveedorMenu = document.getElementById('proveedor_menu');
        const fkProveedor = proveedorMenu.value;
        const categoriaMenu = document.getElementById('categoria_menu');
        const fkCategoriaArticulo = categoriaMenu.value;

        // Verificar que ningún campo esté vacío
        if (!codigoArticuloOriginal || !codigoArticulo || !nombreArticulo || !precioAlmacen || !fkProveedor || !fkCategoriaArticulo) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const bodyData = {
            codigoArticuloOriginal : codigoArticuloOriginal,
            codigoArticulo: codigoArticulo,
            nombreArticulo: nombreArticulo,
            precioAlmacen: parseFloat(precioAlmacen), // Convertir a número decimal
            fkProveedor: parseInt(fkProveedor), // Convertir a entero
            fkCategoriaArticulo: parseInt(fkCategoriaArticulo) // Convertir a entero
        };

        // Enviar los datos al backend (Flask) para editar
        const response = await fetch('http://127.0.0.1:5000/coartmex/articulos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });

            return;

        }

        // Mostrar el mensaje de la respuesta de la API
        listarArticulos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarArticulo(codigoArticulo) {
    try {
        // Verificar si llega el id
        if (!codigoArticulo) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        // Enviar los datos al backend (Flask) para eliminar
        const response = await fetch('http://127.0.0.1:5000/coartmex/articulos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigoArticulo })
        });


        const data = await response.json();

        if (!response.ok) {
            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });
            return;
        }

        // Mostrar el mensaje de la respuesta de la API
        listarArticulos();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModal(modo, codigoArticulo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar articulo';
        modalButton.setAttribute('onclick', 'agregarArticulo()');
        
        document.getElementById('codigoArticulo').value = '';
        document.getElementById('nombreArticulo').value = '';
        document.getElementById('precioAlmacen').value = '';
        proveedorMenu = document.getElementById('proveedor_menu').value = '';
        categoriaMenu = document.getElementById('categoria_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar articulo';
        modalButton.setAttribute('onclick', `editarArticulo('${codigoArticulo}')`);

    }

}


