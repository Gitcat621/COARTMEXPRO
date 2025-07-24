$(document).ready(function () {

    $('#usuarioTable').DataTable({
        columns: [
            { title: "Nombre" },
            { title: "Departamento" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xss editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i> EDITAR</button>
                                <button class="btn btn-xss eliminar-btn" data-pk="${row[3]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i> ELIIMINAR</button>
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
        const contrasena = "NO VISIBLE PASSWORD. CHANGE IF YOU FORGOT IT";
        const fkDepartamento = rowData[2];
        const pkUsuario = rowData[3];


        document.getElementById('nombreUsuario').value = nombreUsuario;
        document.getElementById('contrasena').value = contrasena;
        document.getElementById('departamento_menu').value = fkDepartamento;

        abrirModal(2,pkUsuario);
    });

    // Eliminar
    $('#usuarioTable').on('click', '.eliminar-btn', function () {

        const pkUsuario = $(this).data('pk');
        const nombreUsuario = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreUsuario}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarUsuario(pkUsuario);  
            }
        });
        
    });

    listarUsuarios();
    
});

//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

async function listarUsuarios() {
    try {
        const response = await fetch('/api/usuarios', {
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
            usuarios.nombreUsuario, 
            usuarios.nombreDepartamento,
            usuarios.fkDepartamento, 
            usuarios.pkUsuario
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('No se pudo obtener a los usuarios', 'Error', {"closeButton": true,});
    }
}

async function agregarUsuario() {
    try {
        const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const fkDepartamento = document.getElementById('departamento_menu').value;

        if (!nombreUsuario || !contrasena || !fkDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario, contrasena, fkDepartamento })
        });
        
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
        $('#boostrapModal-1').modal('hide');
        listarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarUsuario(pkUsuario) {
    try {
        const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const fkDepartamento = document.getElementById('departamento_menu').value;

        if (!pkUsuario || !nombreUsuario || !contrasena || !fkDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/usuarios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkUsuario, nombreUsuario, contrasena, fkDepartamento })
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

        const response = await fetch('/api/usuarios', {
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
        Menu = document.getElementById('departamento_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar usuario';
        modalButton.setAttribute('onclick', `editarUsuario('${pkUsuario}')`);

    }

}


