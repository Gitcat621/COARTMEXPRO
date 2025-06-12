$(document).ready(function() {

    listarColaboradores();
    listarPuestos();

});

//Inicializar datatable
$(document).ready(function() {

    $('#colaboradorTable').DataTable({
        columns: [
            { title: "No. empleado" },
            { title: "Nombre del empleado" },
            { title: "Sueldo" }, 
            { title: "Puesto" },
            { title: "Departamento" },
            { title: "Estado" },
            {
                title: "Opciones",
                render: function (data, type, row) { 
                return `<div class="text-center">
                            <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                            <button class="btn btn-xs eliminar-btn" data-rfc="${row[0]}" data-nombre="${row[1]}">
                                    <i class="fa fa-trash"></i>
                            </button>
                        </div>`;
                }
            }            
        ],
        scrollX: true,
        dom: 'Bfrtip', // 🔹 Activa la barra de botones
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Descargar Excel',
                className: 'btn btn-success',
                title: 'Listado de Artículos' // Nombre del archivo
            }
        ]
    });

    // Event listeners para los botones
    // Editar
    $('#colaboradorTable').on('click', '.editar-btn', function () {

        // Obtiene la fila de datos desde el atributo data-row
        const rowData = $(this).data('row');
        const numeroEmpleado = rowData[0];

        window.location.href=`./perfil.html?id=${numeroEmpleado}`;
  
    });

    // Eliminar
    $('#colaboradorTable').on('click', '.eliminar-btn', function () {

        const numeroEmpleado = $(this).data('rfc');
        const nombreEmpleado = $(this).data('nombre'); // Capturamos el nombre
    
        Swal.fire({
            title: `¿Eliminar a ${nombreEmpleado}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarColaborador(numeroEmpleado);
            }
        });
    });
    
});

$("#newEmployee").click(function() {
    agregarColaborador();
});

async function listarColaboradores() {
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

        let tabla = $('#colaboradorTable').DataTable();

        tabla.clear().draw();

        tabla.rows.add(data.map((empleados) => [

            empleados.numeroEmpleado, //0

            empleados.nombreEmpleado, //1

            '$' + (parseFloat(empleados.nomina) + parseFloat(empleados.vale)).toLocaleString(),//

            empleados.nombrePuesto, //

            empleados.nombreDepartamento, //

            empleados.estado,//

        ])).draw();


    } catch (error) {


        console.error("Error al cargar los datos:", error);


        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});


    }
}

async function agregarColaborador() {

    try {

        const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();

        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();

        const nomina = document.getElementById('nomina').value.trim();

        const vale = document.getElementById('vale').value.trim();

        const estado = 1

        const Menu = document.getElementById('puesto_menu');
        const fkPuesto = Menu.value;

        const partes = fechaIngreso.split("-");
        const numeroEmpleado = partes[2] + partes[1] + partes[0].slice(2);

        if (!numeroEmpleado || !nombreEmpleado || !fechaIngreso || !nomina || !vale || !fkPuesto) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }
        

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, nombreEmpleado, fechaIngreso, nomina, vale, estado, fkPuesto })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-1').modal('hide');


        listarColaboradores();


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

async function eliminarColaborador(numeroEmpleado) {

    try {

        if (!numeroEmpleado) {
            toastr.warning('No se pudo obtener el id del colaborador', 'Advertencia', {"closeButton": true});
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

        listarColaboradores();

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});

    } catch (error) {

        console.error('Error:', error);

        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});
    }
}

async function listarPuestos() {

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        const select = document.getElementById('puesto_menu');
        select.innerHTML = "";


        data.forEach(puesto => {

            let option = document.createElement('option');
            option.value = puesto.pkPuesto;
            option.textContent = puesto.nombrePuesto;
            select.appendChild(option);
        });


    } catch (error) {


        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});


        console.error("Error al cargar los datos:", error);
    }
}