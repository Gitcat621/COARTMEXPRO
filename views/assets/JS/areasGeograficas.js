$(document).ready(function () {

    listar();

    if (sessionStorage.getItem("departamento") !== 'Logistica Comercial' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    
});



//Inicializar datatable
$(document).ready(function() {


    $('#areaGeograficaTable').DataTable({
        columns: [
            { title: "Codigo postal" },
            { title: "Pueblo / Ciudad" },
            { title: "Municipio" },
            { title: "Estado" },
            { title: "Pais" },
        ]
    });


});

function listar() {

    //Mapear datos
    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#areaGeograficaTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((ubicaciones) => [

            ubicaciones.codigoPostal, ubicaciones.nombrePuebloCiudad, ubicaciones.nombreMunicipio,ubicaciones.nombreEstado, ubicaciones.nombrePais,
            ubicaciones.pkUbicacion, ubicaciones.pkCodigoPostal, ubicaciones.pkPuebloCiudad, ubicaciones.pkMunicipio, ubicaciones.pkEstado, ubicaciones.pkPais

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}



