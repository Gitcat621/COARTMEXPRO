$(document).ready(function () {

    listarArticulos();
    listarProveedores();
    listarCategoriaArticulos();
    
});

// Escuchar el cambio de fecha
$('#datepicker2').on('changeDate', function (e) {
    const fecha = e.date; // Obtiene la fecha seleccionada
    const mes = fecha.getMonth() + 1; // getMonth() devuelve un índice (0-11), sumamos 1 para obtener el número correcto

    listarArticulos(mes);
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
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#articuloTable').DataTable({
        columns: [
            { title: "Codigo del articulo" },
            { title: "Nombre del articulo" },
            { title: "Exis" },
            { title: "Costo" },
            { title: "Proveedor" },
            { title: "Categoria" }
        ],
        scrollX: true,
    });


});


async function listarArticulos(mes) {

    try {

        if(mes === undefined){
            mes = new Date().getMonth() + 1; // getMonth() devuelve de 0 a 11, sumamos 1 para que sea 1-12
        }

        // Petición GET al servidor
        const response = await fetch(`http://127.0.0.1:5000/coartmex/inventario?month=${mes}`, {
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
            articulos.codigoArticulo, articulos.nombreArticulo, articulos.precioAlmacen, articulos.nombreProveedor,
            //                       4                   5                               6                         
            articulos.nombreCategoriaArticulo, articulos.fkProveedor, articulos.fkCategoriaArticulo
        ])).draw();

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de analisis no se pudo concretar', 'Error', {"closeButton": true,});
    }
}




