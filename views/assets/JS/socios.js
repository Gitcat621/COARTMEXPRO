$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Logistica Comercial' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarSociosComerciales();
    listarGrupos();
    listarUbicaciones();
    
});

//Listar los registros foraneos
function listarGrupos(){

    fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('grupo_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkGrupoSocio}">${data.nombreGrupoSocio}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('grupo_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

function listarUbicaciones(){

    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('ubicacion_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkUbicacion}">${data.nombrePuebloCiudad} - ${data.nombreMunicipio} - ${data.nombreEstado} </option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('ubicacion_menu').innerHTML += HTML;


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


    $('#socioTable').DataTable({
        columns: [
            { title: "Nombre del socio" },
            { title: "Razon social" },
            { title: "Grupo" },
            { title: "Codigo postal" },
            { title: "Pueblo / Ciudad" },
            { title: "Municipio" },
            { title: "Estado" },
            { title: "Pais" }
        ]
    });



});



function listarSociosComerciales() {

    //Peticion GET al servidor
    fetch('http://127.0.0.1:5000/coartmex/sociosComerciales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#socioTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((sc) => [
//                  0               1               2                   3                   4                   5                   6               7
            sc.nombreSocio, sc.razonSocial, sc.nombreGrupoSocio, sc.codigoPostal, sc.nombrePuebloCiudad, sc.nombreMunicipio, sc.nombreEstado, sc.nombrePais,
//                      8           9               10                  11              12              13          14              15
            sc.fkGrupoSocio, sc.fkUbicacion, sc.pkCodigoPostal, sc.pkPuebloCiudad, sc.pkMunicipio, sc.pkEstado, sc.pkPais, sc.pkSocioComercial

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}



