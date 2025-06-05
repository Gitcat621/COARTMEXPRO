$(document).ready(function () {

    listarEmpleados();
    listarPuestos();
    listarNivelesEstudio();
    
});

async function listarPuestos() {

    try {

        const response = await fetch('http://127.0.0.1:5000/coartmex/puestos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        try{
            
            const select = document.getElementById('puesto_menu');
            document.getElementById('puesto_menu').innerHTML = "";

            data.forEach(niveles => {

                let option = document.createElement('option');
                option.value = niveles.pkPuesto;
                option.textContent = niveles.nombrePuesto;
                select.appendChild(option);

            });

        }catch{
            console.log('no existe este elemento: Puestos');
        }

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error(`Error al listar los puestos`, 'Error', {"closeButton": true,});

    }
}

async function listarNivelesEstudio() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/niveles_estudio`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('niveles_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkNivelEstudio;
            option.textContent = niveles.nombreNivel;
            select.appendChild(option);

        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de niveles de estudio no se pudo concretar', 'Error', {"closeButton": true,});
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
            { title: "No. empleado" },
            { title: "RFC" },
            { title: "Nombre del empleado" },
            { title: "Fecha de ingreso" },
            { title: "Fecha de Nacimiento" },
            { title: "Nomina" },
            { title: "Vales" },
            { title: "nomina" }, 
            { title: "Puesto" },
            { title: "Departamento" },
            { title: "Nivel educacion" },
            { title: "Lugar de nacimiento" },
            { title: "Estado" },
            {
                title: "Opciones",
                render: function (data, type, row) { 
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-rfc="${row[9]}" data-nombre="${row[2]}">
                                    <i class="fa fa-trash"></i>
                                </button>
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

        const numeroEmpleado = rowData[9];
        const rfc = rowData[1];
        const nombreEmpleado = rowData[2];
        const fechaIngreso = rowData[3];
        const formateada = formatearFecha(fechaIngreso);
        const nomina = rowData[4];
        const vale = rowData[5];
        const fkPuesto = rowData[7];

        // Asignar valores a los inputs del modal
        document.getElementById('rfc').value = rfc;
        document.getElementById('nombreEmpleado').value = nombreEmpleado;
        document.getElementById('fechaIngreso').value = formateada;
        document.getElementById('nomina').value = nomina;
        document.getElementById('vale').value = vale;
        document.getElementById('puesto_menu').value = fkPuesto;

        abrirModal(2,numeroEmpleado)
    });

    // Eliminar
    $('#empleadoTable').on('click', '.eliminar-btn', function () {

        const rfc = $(this).data('rfc');
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
                eliminarEmpleado(rfc);
            }
        });
    });
    

});

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

        console.log(data);

        let tabla = $('#empleadoTable').DataTable();
        tabla.clear().draw();
        tabla.rows.add(data.map((empleados) => [
            empleados.numeroEmpleado, //0
            empleados.rfc,  //1
            empleados.nombreEmpleado, //2 
            toformatearFecha(empleados.fechaIngreso), //3
            toformatearFecha(empleados.fechaNacimiento), //4
            '$' + empleados.nomina.toLocaleString('es-MX'),
            '$' + empleados.vale.toLocaleString('es-MX'),
            '$' + (parseFloat(empleados.nomina) + parseFloat(empleados.vale)).toLocaleString('es-MX'),
            empleados.nombrePuesto,
            empleados.nombreDepartamento, //
            empleados.nombreNivel,
            empleados.ubicacion,
            empleados.estado,
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function agregarEmpleado() {
    try {

        const rfc = document.getElementById('rfc').value.trim();

        const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();

        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();

        const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();

        const nomina = document.getElementById('nomina').value.trim();

        const vale = document.getElementById('vale').value.trim();

        const puesto_menu = document.getElementById('puesto_menu');
        const fkPuesto = puesto_menu.value;

        const niveles_menu = document.getElementById('niveles_menu');
        const fkNivelEstudio = niveles_menu.value;

        const estado = document.getElementById('estado').value;

        const partes = fechaIngreso.split("-");
        const numeroEmpleado = partes[2] + partes[1] + partes[0].slice(2);

        if (!numeroEmpleado || !rfc || !nombreEmpleado || !fechaIngreso || !fechaNacimiento || !nomina || !vale  || !estado || !fkPuesto || !fkNivelEstudio) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, fechaNacimiento, nomina, vale, estado, fkPuesto, fkNivelEstudio })
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

async function editarEmpleado(numeroEmpleado) {
    try {
        const rfc = document.getElementById('rfc').value.trim();
        const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();
        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();
        const nomina = document.getElementById('nomina').value.trim();
        const vale = document.getElementById('vale').value.trim();
        const fkPuesto = document.getElementById('puesto_menu').value;

        if (!numeroEmpleado || !rfc || !nombreEmpleado || !fechaIngreso || !nomina || !vale || !fkPuesto) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, rfc, nombreEmpleado, fechaIngreso, nomina, vale, fkPuesto })
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
        document.getElementById('nomina').value = '';
        document.getElementById('vale').value = '';
        document.getElementById('puesto_menu').value = '';
        document.getElementById('niveles_menu').value = '';

    } else if (modo === 2) {
        
        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar empleado';
        modalButton.setAttribute('onclick', `editarEmpleado('${rfc}')`);
    }

}

//Formatea las fecha para tener un formato YYYY/MM/DD
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}