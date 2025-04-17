$(document).ready(function () {

    listarArticulos();
    listarProveedores();
    listarCategoriaArticulos();
    
});

//Listar los registros foraneos
function listarProveedores(){

    fetch('http://127.0.0.1:5000/coartmex/proveedores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('proveedor_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkProveedor}">${data.nombreProveedor}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('proveedor_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

function listarCategoriaArticulos(){

    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('categoria_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkCategoriaArticulo}">${data.nombreCategoriaArticulo}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('categoria_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#articuloTable').DataTable({
        columns: [
            { title: "Codigo del articulo" },
            { title: "Nombre del articulo" },
            { title: "Precio" },
            { title: "Proveedor" },
            { title: "Categoria" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-sm editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-pk="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
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

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarUsuario(codigoArticulo);    
        });
        
    });

});

function agregarUsuario(){

    // Obtener los datos del formulario
    const codigoArticulo = document.getElementById('codigoArticulo').value.trim();

    const nombreArticulo = document.getElementById('nombreArticulo').value.trim();

    const precioAlmacen = document.getElementById('precioAlmacen').value.trim();
    
    const proveedorMenu = document.getElementById('proveedor_menu');

    const fkProveedor = proveedorMenu.value;

    const categoriaMenu = document.getElementById('categoria_menu');
    
    const fkCategoriaArticulo = categoriaMenu.value;



    // Verificar si ambos campos están completos
    if (!codigoArticulo || !nombreArticulo || !precioAlmacen || !fkProveedor || !fkCategoriaArticulo) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});


        return;
    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/articulos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });


        // Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarArticulos();


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function listarArticulos() {

   try{

        var fecha = document.getElementById('datepicker-autoclose').value;

    }catch{

        var fecha;
    }


    if (fecha === ""){


        const ahora = new Date();


        fecha = ahora.geet;
        
    }

    //Peticion GET al servidor
    fetch(`http://127.0.0.1:5000/coartmex/articulos?fecha=${fecha}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);return;

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#articuloTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((articulos) => [
            //    0                              1                      2                               3             
            articulos.codigoArticulo, articulos.nombreArticulo, articulos.precioAlmacen, articulos.nombreProveedor,
            //                       4                   5                               6                         
            articulos.nombreCategoriaArticulo, articulos.fkProveedor, articulos.fkCategoriaArticulo

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarUsuario(codigoArticuloOriginal){

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


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/articulos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoArticuloOriginal, codigoArticulo, nombreArticulo, precioAlmacen, fkProveedor, fkCategoriaArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarArticulos();
        
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;
    });
}

function eliminarUsuario(codigoArticulo){

    // Verificar si llega el id
    if (!codigoArticulo) {


        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/articulos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoArticulo })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarArticulos();

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});
        return;

    });
}

function abrirModal(modo, codigoArticulo) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar articulo';
        modalButton.setAttribute('onclick', 'agregarUsuario()');
        
        document.getElementById('codigoArticulo').value = '';
        document.getElementById('nombreArticulo').value = '';
        document.getElementById('precioAlmacen').value = '';
        proveedorMenu = document.getElementById('proveedor_menu').value = '';
        categoriaMenu = document.getElementById('categoria_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar articulo';
        modalButton.setAttribute('onclick', `editarUsuario('${codigoArticulo}')`);

    }

}


