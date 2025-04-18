$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarCP();
    listarPC();
    listarM();
    listarE();
    listarP();
    listarUbicaciones();
    
});

function listarCP(){

    fetch('http://127.0.0.1:5000/coartmex/codigosPostales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('cp_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkCodigoPostal}">${data.codigoPostal}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('cp_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));

}

function listarPC(){

    fetch('http://127.0.0.1:5000/coartmex/pueblosCiudades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('pc_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkPuebloCiudad}">${data.nombrePuebloCiudad}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('pc_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));

}

function listarM(){

    fetch('http://127.0.0.1:5000/coartmex/municipios', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('m_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkMunicipio}">${data.nombreMunicipio}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('m_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));

}

function listarE(){

    fetch('http://127.0.0.1:5000/coartmex/estados', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('e_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkEstado}">${data.nombreEstado}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('e_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));

}

function listarP(){

    fetch('http://127.0.0.1:5000/coartmex/paises', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('p_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.pkPais}">${data.nombrePais}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('p_menu').innerHTML += HTML;


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


    $('#ubicacionTable').DataTable({
        columns: [
            { title: "Codigo postal" },
            { title: "Pueblo / Ciudad" },
            { title: "Municipio" },
            { title: "Estado" },
            { title: "País" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-sm editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-pk="${row[10]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    

    // Event listeners para los botones
    // Editar
    $('#ubicacionTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        var pkUbicacion = rowData[10];
        var fkCodigoPostal = rowData[5];
        var fkPuebloCiudad = rowData[6];
        var fkMunicipio = rowData[7];
        var fkEstado = rowData[8];
        var fkPais = rowData[9];

        document.getElementById('cp_menu').value = fkCodigoPostal;
        document.getElementById('pc_menu').value = fkPuebloCiudad;
        document.getElementById('m_menu').value = fkMunicipio;
        document.getElementById('e_menu').value = fkEstado;
        document.getElementById('p_menu').value = fkPais;

        abrirModal(2,pkUbicacion);
    });

    // Eliminar
    $('#ubicacionTable').on('click', '.eliminar-btn', function () {

        const pkUbicacion = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarUbicacion(pkUbicacion);    
        });
        
    });

});

function agregarUbicacion(){

    // Obtener los datos del formulario
    // const nombreUbicacion = document.getElementById('nombreUbicacion').value.trim();
    

    const cpMenu = document.getElementById('cp_menu');


    const fkCodigoPostal = cpMenu.value;


    const pcMenu = document.getElementById('pc_menu');


    const fkPuebloCiudad = pcMenu.value;


    const mMenu = document.getElementById('m_menu');


    const fkMunicipio = mMenu.value;


    const eMenu = document.getElementById('e_menu');


    const fkEstado = eMenu.value;


    const pMenu = document.getElementById('p_menu');


    const fkPais = pMenu.value;


    // Verificar si ambos campos están completos
    if (!fkCodigoPostal || !fkPuebloCiudad  || !fkMunicipio  || !fkEstado  || !fkPais) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fkCodigoPostal, fkPuebloCiudad, fkMunicipio, fkEstado, fkPais })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });

        //Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarUbicaciones();

    })
    .catch(error => {
        //Imprimir errores
        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {
            "closeButton": true,
        });

        return;
    });
}

function listarUbicaciones() {

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
        let tabla = $('#ubicacionTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((ubicaciones) => [
//                  0                               1                               2                       3                           4
            ubicaciones.codigoPostal, ubicaciones.nombrePuebloCiudad, ubicaciones.nombreMunicipio,ubicaciones.nombreEstado, ubicaciones.nombrePais,
//                      5                           6                           7                           8                   9                   10          
            ubicaciones.pkCodigoPostal, ubicaciones.pkPuebloCiudad, ubicaciones.pkMunicipio, ubicaciones.pkEstado, ubicaciones.pkPais, ubicaciones.pkUbicacion

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarUbicacion(pkUbicacion){

    //Obtener valores del formulario
    //const nombreUbicacion = document.getElementById('nombreUbicacion').value.trim();


    const cpMenu = document.getElementById('cp_menu');


    const fkCodigoPostal = cpMenu.value;


    const pcMenu = document.getElementById('pc_menu');


    const fkPuebloCiudad = pcMenu.value;


    const mMenu = document.getElementById('m_menu');


    const fkMunicipio = mMenu.value;


    const eMenu = document.getElementById('e_menu');


    const fkEstado = eMenu.value;


    const pMenu = document.getElementById('p_menu');


    const fkPais = pMenu.value;


    // Verificar si ambos campos están completos
    if (!fkCodigoPostal || !fkPuebloCiudad  || !fkMunicipio  || !fkEstado  || !fkPais) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;


    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkUbicacion, fkCodigoPostal, fkPuebloCiudad, fkMunicipio, fkEstado, fkPais })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarUbicaciones();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;
    });
}

function eliminarUbicacion(pkUbicacion){

    // Verificar si llega el id
    if (!pkUbicacion) {


        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para eliminar
    fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkUbicacion })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarUbicaciones();


        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});



    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});
        return;
    });
}

function abrirModal(modo, pkUbicacion) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar ubicaciones';
        modalButton.setAttribute('onclick', 'agregarUbicacion()');
        document.getElementById('cp_menu').value = '';
        document.getElementById('pc_menu').value = '';
        document.getElementById('m_menu').value = '';
        document.getElementById('e_menu').value = '';
        document.getElementById('p_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar ubicaciones';
        modalButton.setAttribute('onclick', `editarUbicacion(${pkUbicacion})`);

    }

}


