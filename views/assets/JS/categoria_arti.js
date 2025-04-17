$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Compras' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarCategoriaArticulos();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#categoriaArticuloTable').DataTable({
        columns: [
            { title: "Nombre de la categoria" }
        ]
    });

    

});

function listarCategoriaArticulos() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/categoriaArticulos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#categoriaArticuloTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((categoriaArticulos) => [

            categoriaArticulos.nombreCategoriaArticulo, categoriaArticulos.pkCategoriaArticulo

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

