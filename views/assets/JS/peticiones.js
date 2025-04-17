$(document).ready(function () {
    

});

function Mostrar(){

    fetch('http://127.0.0.1:5000/api/usuarios', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        $('#usuarioTable').DataTable({
            data: data.map((usuario, index) => [
              index + 1, // Número de fila
              usuario.nombreUsuario,
              usuario.contrasena,
              usuario.nombreEmpleado
            ]),
            columns: [
              { title: "#" },
              { title: "Nombre Usuario" },
              { title: "Contraseña" },
              { title: "Nombre Empleado" }
            ]
          });

        toastr.success('Se la hizo la consulta con fetch', 'FETCH', {
            "closeButton": true,
        });

    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('respuesta_GET').innerText = "Ocurrió un error al obtener los usuarios.";

        toastr.error('Hubo un error al cargar los datos', 'Error', {
            "closeButton": true,
        });
        return;
    });
}

function AJAX(){
    $.ajax({
        url: `http://127.0.0.1:5000/api/usuarios`,
		type: "GET",
		success: function (response) {

            $('#usuarioTable').DataTable({
                data: response.map((usuario, index) => [
                  index + 1, // Número de fila
                  usuario.nombreUsuario,
                  usuario.contrasena,
                  usuario.nombreEmpleado
                ]),
                columns: [
                  { title: "#" },
                  { title: "Nombre Usuario" },
                  { title: "Contraseña" },
                  { title: "Nombre Empleado" }
                ]
              });


		},
        error: function (xhr, textStatus, errorThrown) {
            toastr.error('hubo un error al cargar los datos de inserción', 'Error', {
                "closeButton": true,
            }); 

        },
        complete: function (data) {
            toastr.success('Se la hizo la consulta con ajax', 'AJAX', {
                "closeButton": true,
            });
        }
	});
}

document.getElementById('formulario_GET').addEventListener('submit', function(event) {
    event.preventDefault();

    Mostrar();

});

document.getElementById('formulario_GETAJAX').addEventListener('submit', function(event) {
    event.preventDefault();

    AJAX();

});

document.getElementById('formulario_POST').addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('respuesta_POST').innerText = " ";

    // Obtener los datos del formulario
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const contrasena = document.getElementById('contrasena').value;
    empleadoMenu = document.getElementById('empleadoMenu');
    fkEmpleado = empleadoMenu.value;

    // Verificar si ambos campos están completos
    if (!nombreUsuario || !contrasena || !fkEmpleado) {
        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;
    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreUsuario, contrasena, fkEmpleado })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el mensaje de la respuesta de la API
        toastr.success('Accion realizada', 'Realizado', {
            "closeButton": true,
        });
        document.getElementById('respuesta_POST').innerText = data.mensaje;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('respuesta_POST').innerText = "Ocurrió un error al insertar el usuario.";

        toastr.error('Hubo un error al intentar la acción', 'Error', {
            "closeButton": true,
        });
        return;
    });
});

document.getElementById('formulario_PUT').addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('respuesta_PUT').innerText = " ";

    // Obtener los datos del formulario
    const id = document.getElementById('id_PUT').value.trim();
    const nombre = document.getElementById('nombre_PUT').value.trim();
    const contrasena = document.getElementById('contrasena_PUT').value.trim();
    empleadoMenu = document.getElementById('empleadoMenu_PUT');
    fkEmpleado = empleadoMenu.value;
    

    // Verificar que ningún campo esté vacío
    if (!id || !nombre || !contrasena|| !fkEmpleado) {
        toastr.warning('Por favor, completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;
    }


    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/api/usuarios', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, nombre, correo })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el mensaje de la respuesta de la API
        toastr.success('Accion realizada', 'Realizado', {
            "closeButton": true,
        });
        document.getElementById('respuesta_PUT').innerText = data.mensaje;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('respuesta_PUT').innerText = "Ocurrió un error al editar el usuario.";

        toastr.error('Hubo un error al intentar la acción', 'Error', {
            "closeButton": true,
        });
        return;
    });
});

document.getElementById('formulario_DELETE').addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('respuesta_DELETE').innerText = " ";

    // Obtener los datos del formulario
    const id = document.getElementById('id_DELETE').value;

    // Verificar si ambos campos están completos
    if (!id) {
        toastr.warning('Porfavor completa todos los campos', 'Advertencia', {
            "closeButton": true,
        });
        return;
    }

    // Enviar los datos al backend (Flask) para insertar
    fetch('http://127.0.0.1:5000/api/usuarios', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el mensaje de la respuesta de la API
        toastr.success('Accion realizada', 'Realizado', {
            "closeButton": true,
        });
        document.getElementById('respuesta_DELETE').innerText = data.mensaje;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('respuesta_DELETE').innerText = "Ocurrió un error al eliminar el usuario.";

        toastr.error('Hubo un error al intentar la acción', 'Error', {
            "closeButton": true,
        });
        return;
    });
});