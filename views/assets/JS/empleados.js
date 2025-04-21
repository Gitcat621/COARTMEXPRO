$(document).ready(function () {
    
    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarDepartamentos();
    listarEmpleados();
    
});

//Formatea las fecha para tener un formato YYYY/MM/DD
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

//Listar los registros foraneos
async function listarDepartamentos() {

    try {

        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            if (response.status === 400) {
      
              toastr.error('No se pudo obtener los empleados', 'Error', {"closeButton": true,});
      
            }
            return;
        }

        document.getElementById('departamento_menu').innerHTML = "";

        // Mapear en un select
        data.forEach(function(dep) {
            let HTML = `<option value="${dep.pkDepartamento}">${dep.nombreDepartamento}</option>`;
            // Mapear valor por cada elemento en la consulta 
            document.getElementById('departamento_menu').innerHTML += HTML;
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de departamentos no se pudo conectar', 'Error', {"closeButton": true,});
    }
}


//Asignar funcion al boton de abrir modal
$("#modalAgregar").click(function() {
    abrirModal(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#empleadoTable').DataTable({
        columns: [
            { title: "Numero de empleado" },
            { title: "RFC" },
            { title: "Nombre del empleado" },
            { title: "Fecha de ingreso" },
            { title: "Sueldo" },
            { title: "Permisos" },
            { title: "Cursos tomados" },
            { title: "Departamento" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-rfc="${row[10]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });


    // Event listeners para los botones
    // Editar
    $('#empleadoTable').on('click', '.editar-btn', function () {

         // Obtiene la fila de datos desde el atributo data-row
        const rowData = $(this).data('row');

        const numeroEmpleado = rowData[10];
        const rfc = rowData[1];
        const nombreEmpleado = rowData[2];
        const fechaIngreso = rowData[3];
        const formateada = formatearFecha(fechaIngreso);
        const sueldo = rowData[4];
        const permisosPedidos = rowData[5];
        const fkDepartamento = rowData[8];

        // Asignar valores a los inputs del modal
        document.getElementById('rfc').value = rfc;
        document.getElementById('nombreEmpleado').value = nombreEmpleado;
        document.getElementById('fechaIngreso').value = formateada;
        document.getElementById('sueldo').value = sueldo;
        document.getElementById('permisosPedidos').value = permisosPedidos;
        document.getElementById('departamento_menu').value = fkDepartamento;

        abrirModal(2,numeroEmpleado)
    });

    // Eliminar
    $('#empleadoTable').on('click', '.eliminar-btn', function () {

        const rfc = $(this).data('rfc');

        var modal = $('[data-remodal-id="remodal"]').remodal();

        modal.open();

        $(document).on("confirmation", ".remodal", function () {

            eliminarEmpleado(rfc);    
            
        });
        
    });

});

async function agregarEmpleado() {
    try {
        const rfc = document.getElementById('rfc').value.trim();
        const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();
        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();
        const sueldo = document.getElementById('sueldo').value.trim();
        const permisosPedidos = document.getElementById('permisosPedidos').value.trim();
        const Menu = document.getElementById('departamento_menu');
        const fkDepartamento = Menu.value;
        const partes = fechaIngreso.split("-");
        const numeroEmpleado = partes[2] + partes[1] + partes[0].slice(2);

        if (!numeroEmpleado || !rfc || !nombreEmpleado || !fechaIngreso || !sueldo || !permisosPedidos || !fkDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});
        $('#boostrapModal-1').modal('hide');
        listarEmpleados();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});
    }
}

async function listarEmpleados() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        let tabla = $('#empleadoTable').DataTable();
        tabla.clear().draw();
        tabla.rows.add(data.map((empleados) => [
            empleados.numeroEmpleado, empleados.rfc, empleados.nombreEmpleado, toformatearFecha(empleados.fechaIngreso), empleados.sueldo,
            empleados.permisosPedidos, empleados.cursos, empleados.nombreDepartamento, empleados.pkDepartamento,
            empleados.pkCurso, empleados.numeroEmpleado
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

async function editarEmpleado(numeroEmpleado) {
    try {
        const rfc = document.getElementById('rfc').value.trim();
        const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();
        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();
        const sueldo = document.getElementById('sueldo').value.trim();
        const permisosPedidos = document.getElementById('permisosPedidos').value.trim();
        const fkDepartamento = document.getElementById('departamento_menu').value;

        if (!numeroEmpleado || !rfc || !nombreEmpleado || !fechaIngreso || !sueldo || !permisosPedidos || !fkDepartamento) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, sueldo, permisosPedidos, fkDepartamento })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarEmpleados();
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});
    }
}

async function eliminarEmpleado(numeroEmpleado) {
    try {
        if (!numeroEmpleado) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarEmpleados();
        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});
    }
}


function abrirModal(modo, rfc) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar empleado';
        modalButton.setAttribute('onclick', 'agregarEmpleado()');

        document.getElementById('rfc').value = '';
        document.getElementById('nombreEmpleado').value = '';
        document.getElementById('fechaIngreso').value = '';
        document.getElementById('sueldo').value = '';
        document.getElementById('permisosPedidos').value = '';
        document.getElementById('departamento_menu').value = '';

    } else if (modo === 2) {
        
        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar empleado';
        modalButton.setAttribute('onclick', `editarEmpleado('${rfc}')`);
    }

}


function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}