$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarProveedores();
    listarUbicaciones();
    listarTelefonos();
    listarCuentas();
    listarPaqueterias();
    
});

//Listar los registros foraneos
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
            
        
            let HTML = `<option value="${data.pkUbicacion}">${data.codigoPostal} - ${data.nombreMunicipio} - ${data.nombreEstado}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('ubicacion_menu').innerHTML += HTML;


        });
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

async function listarTelefonos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/telefonos', { // Cambia la URL según tu API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error al obtener los datos:", response.status);
            return;
        }


        const select = document.getElementById('telefono_menu');
        select.innerHTML = ""; // Limpiar contenido previo

        option = document.createElement('option');
        option.value = '0';
        option.textContent = '1234567890';
        option.selected = true;
        select.appendChild(option);

        data.forEach(telefono => {

            let option = document.createElement('option');
            option.value = telefono.pkTelefono; // Asignar el nombre del telefono
            option.textContent = telefono.numeroTelefono;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

async function listarCuentas() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/cuentasBanco', { // Cambia la URL según tu API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error al obtener los datos:", response.status);
            return;
        }


        const select = document.getElementById('banco_menu');
        select.innerHTML = ""; // Limpiar contenido previo

        option = document.createElement('option');
        option.value = '0';
        option.textContent = 'Cuenta de banco';
        option.selected = true;
        select.appendChild(option);

        data.forEach(telefono => {

            let option = document.createElement('option');
            option.value = telefono.pkCuentaBanco; // Asignar el nombre del telefono
            option.textContent = telefono.numeroCuenta;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

async function listarPaqueterias() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/paqueterias', { // Cambia la URL según tu API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error al obtener los datos:", response.status);
            return;
        }


        const select = document.getElementById('paqueteria_menu');
        select.innerHTML = ""; // Limpiar contenido previo

        option = document.createElement('option');
        option.value = '0';
        option.textContent = 'Paqueteria';
        option.selected = true;
        select.appendChild(option);

        data.forEach(telefono => {

            let option = document.createElement('option');
            option.value = telefono.pkPaqueteria; // Asignar el nombre del telefono
            option.textContent = telefono.nombrePaqueteria;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#proveedorTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "correo" },
            { title: "Telefonos" },
            { title: "Metodos de pago" },
            { title: "Dias de credito" },
            { title: "Factura / Nota" },
            { title: "Bancos" },
            { title: "Cuentas de banco" },
            { title: "Beneficiarios" },
            { title: "Dias de entrega" },
            { title: "Flete" },
            { title: "Paqueterias" },
            { title: "CodigoPostal" },
            { title: "Municipio" },
            { title: "Estado" },
            
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[16]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });


    // Event listeners para los botones
    // Editar
    $('#proveedorTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreProveedor = rowData[0];
        const correoProveedor = rowData[1];
        const diasCredito = rowData[4];
        const fkUbicacion = rowData[15];
        const pkProveedor = rowData[16];


        document.getElementById('nombreProveedor').value = nombreProveedor;
        document.getElementById('correoProveedor').value = correoProveedor;
        document.getElementById('diasCredito').value = diasCredito;
        document.getElementById('ubicacion_menu').value = fkUbicacion;


        abrirModal(2,pkProveedor);
    });

    // Eliminar
    $('#proveedorTable').on('click', '.eliminar-btn', function () {

        const pkProveedor = $(this).data('pk');
        const nombreProveedor = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreProveedor}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarProveedor(pkProveedor); 
            }
        });
        
    });

});

function agregarProveedor(){

    // Obtener los datos del formulario
    const nombreProveedor = document.getElementById('nombreProveedor').value;


    const correoProveedor = document.getElementById('correoProveedor').value;

    
    const diasCredito = document.getElementById('diasCredito').value;


    const fnMenu = document.getElementById('fn_menu');


    const facturaNota = fnMenu.value;


    const ubicacionMenu = document.getElementById('ubicacion_menu');


    const fkUbicacion = ubicacionMenu.value;


    // Verificar si ambos campos están completos
    if (!nombreProveedor || !correoProveedor || !diasCredito || !facturaNota || !fkUbicacion) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});


        return;
    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/proveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        toastr.success(`${data.mensaje}`, 'Realizado', {
            "closeButton": true,
        });


        // Acciones posteriores(Cerrar modal y mapear datos)
        $('#boostrapModal-1').modal('hide');
        listarProveedores();


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;

    });
}

function listarProveedores() {

    //Peticion GET al servidor
    fetch('http://127.0.0.1:5000/coartmex/proveedores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        //Iniciar la datatable y asignarla a una variable
        let tabla = $('#proveedorTable').DataTable();
        
        // Limpiar la tabla antes de agregar nuevos datos
        tabla.clear().draw();

        // Agregar los nuevos datos
        tabla.rows.add(data.map((proveedores) => [

            //           0                           1                           2                       3                       4
            proveedores.nombreProveedor, proveedores.correoProveedor, proveedores.telefonos, proveedores.metodosPago, proveedores.diasCredito, 
            //          5                           6                   7                       8                           9   
            proveedores.facturaNota, proveedores.bancos, proveedores.numerosCuenta, proveedores.beneficiarios, proveedores.diasEntrega,
            //          10                    11                          12                      13                      14 
            proveedores.flete, proveedores.paqueterias,  proveedores.codigoPostal, proveedores.nombreMunicipio, proveedores.nombreEstado,
            //          15                      16
            proveedores.fkUbicacion ,proveedores.pkProveedor

        ])).draw();
    })
    .catch(error => console.error("Error al cargar los datos:", error));
    
}

function editarProveedor(pkProveedor){

    // Obtener los datos del formulario
    const nombreProveedor = document.getElementById('nombreProveedor').value.trim();

    const correoProveedor = document.getElementById('correoProveedor').value.trim();

    const diasCredito = document.getElementById('diasCredito').value.trim();

    const fnMenu = document.getElementById('fn_menu');

    const facturaNota = fnMenu.value;

    const ubicacionMenu = document.getElementById('ubicacion_menu');

    const fkUbicacion = ubicacionMenu.value;

    const infopMenu = document.getElementById('infop_menu');

    // Verificar que ningún campo esté vacío
    if (!pkProveedor || !nombreProveedor || !correoProveedor || !diasCredito|| !facturaNota || !fkUbicacion) {


        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para editar
    fetch('http://127.0.0.1:5000/coartmex/proveedores', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkProveedor, nombreProveedor, correoProveedor, diasCredito, facturaNota ,fkUbicacion })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarProveedores();
        
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true,});
        return;
    });
}

function eliminarProveedor(pkProveedor){

    // Verificar si llega el id
    if (!pkProveedor) {


        toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true,});
        return;


    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/coartmex/proveedores', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pkProveedor })
    })
    .then(response => response.json())
    .then(data => {


        // Mostrar el mensaje de la respuesta de la API
        listarProveedores();

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true,});


    })
    .catch(error => {


        console.error('Error:', error);

        toastr.success(`${data.mensaje}`, 'Error', {"closeButton": true,});
        return;

    });
}

function abrirModal(modo, pkProveedor) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar proveedor';
        modalButton.setAttribute('onclick', 'agregarProveedor()');
        
        document.getElementById('nombreProveedor').value = '';
        document.getElementById('correoProveedor').value = '';
        document.getElementById('diasCredito').value = '';
        document.getElementById('fn_menu').value = '';
        document.getElementById('ubicacion_menu').value = '';
        document.getElementById('telefono_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar proveedor';
        modalButton.setAttribute('onclick', `editarProveedor('${pkProveedor}')`);

    }

}

$("#info").click(function() {
    toastr.info('Posicione el cursor sobre la tabla, presione shift y mueva la rueda del raton', 'Informacion', {"closeButton": true,});
});
