$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarUsuarios();
    listarEmpleados();
    
});

//Listar los registros foraneos
function listarEmpleados(){

    fetch('http://127.0.0.1:5000/coartmex/empleados', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {


        document.getElementById('empleado_menu').innerHTML = "";

        //Mapear en un select
        data.forEach(function(data) {
            
        
            let HTML = `<option value="${data.numeroEmpleado}">${data.nombreEmpleado}</option>`;
        
            //Mapear valor por cada elemento en la consulta 
            document.getElementById('empleado_menu').innerHTML += HTML;


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


    $('#usuarioTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Empleado" },
            { title: "Departamento" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-warning btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-danger btn-xs eliminar-btn" data-pk="${row[6]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });


    // Event listeners para los botones
    // Editar
    $('#usuarioTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreUsuario = rowData[0];
        const contrasena = rowData[1];
        const fkEmpleado = rowData[5];
        const pkUsuario = rowData[6];


        document.getElementById('nombreUsuario').value = nombreUsuario;
        document.getElementById('contrasena').value = contrasena;
        document.getElementById('empleado_menu').value = fkEmpleado;

        abrirModal(2,pkUsuario);
    });

    // Eliminar
    $('#usuarioTable').on('click', '.eliminar-btn', function () {

        const pkUsuario = $(this).data('pk');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {
            eliminarUsuario(pkUsuario);    
        });
        
    });

});

async function agregarUsuario() {
    try {
        const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const fkEmpleado = document.getElementById('empleado_menu').value;

        if (!nombreUsuario || !contrasena || !fkEmpleado) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario, contrasena, fkEmpleado })
        });

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }
        
        const data = await response.json();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
        $('#boostrapModal-1').modal('hide');
        listarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function listarUsuarios() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/usuarios', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        let tabla = $('#usuarioTable').DataTable();
        tabla.clear().draw();
        tabla.rows.add(data.map((usuarios) => [
            usuarios.nombreUsuario, usuarios.nombreEmpleado, usuarios.nombreDepartamento,
            usuarios.fkEmpleado, usuarios.pkUsuario
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

async function editarUsuario(pkUsuario) {
    try {
        const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const fkEmpleado = document.getElementById('empleado_menu').value;

        if (!pkUsuario || !nombreUsuario || !contrasena || !fkEmpleado) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/usuarios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkUsuario, nombreUsuario, contrasena, fkEmpleado })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarUsuarios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarUsuario(pkUsuario) {
    try {
        if (!pkUsuario) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/usuarios', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkUsuario })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarUsuarios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModal(modo, pkUsuario) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar usuario';
        modalButton.setAttribute('onclick', 'agregarUsuario()');
        
        document.getElementById('nombreUsuario').value = '';
        document.getElementById('contrasena').value = '';
        Menu = document.getElementById('empleado_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar usuario';
        modalButton.setAttribute('onclick', `editarUsuario('${pkUsuario}')`);

    }

}


