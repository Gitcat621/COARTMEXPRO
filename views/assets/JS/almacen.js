$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Compras' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarArticulos();
    
});


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
        ],
        scrollX: true,
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


