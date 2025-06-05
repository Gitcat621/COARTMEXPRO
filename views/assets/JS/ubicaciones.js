$(document).ready(function () {

    // if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
    //     //window.location.href = './index.html';
    //     //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    // }

    listarUbicaciones();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarUbicacion").click(function() {
    abrirModalUbicaciones(1);
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
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[10]}"><i class="fa fa-trash"></i></button>
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

        document.getElementById('codigosPostales_menu').value = fkCodigoPostal;
        document.getElementById('pueblosCiudades_menu').value = fkPuebloCiudad;
        document.getElementById('municipios_menu').value = fkMunicipio;
        document.getElementById('estados_menu').value = fkEstado;
        document.getElementById('paises_menu').value = fkPais;

        abrirModalUbicaciones(2,pkUbicacion);
    });

    // Eliminar
    $('#ubicacionTable').on('click', '.eliminar-btn', function () {

        const pkUbicacion = $(this).data('pk');

        Swal.fire({
            title: `¿Eliminar a esta ubicacion?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarUbicacion(pkUbicacion);  
            }
        });

          
        
    });

});

async function listarUbicaciones() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        let tabla = $('#ubicacionTable').DataTable();
        tabla.clear().rows.add(data.map(ubicaciones => [
            ubicaciones.codigoPostal, 
            ubicaciones.nombrePuebloCiudad, 
            ubicaciones.nombreMunicipio,
            ubicaciones.nombreEstado, 
            ubicaciones.nombrePais,
            ubicaciones.pkCodigoPostal, 
            ubicaciones.pkPuebloCiudad, 
            ubicaciones.pkMunicipio, 
            ubicaciones.pkEstado, 
            ubicaciones.pkPais, 
            ubicaciones.pkUbicacion
        ])).draw();

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function agregarUbicacion() {
    try {
        const fkCodigoPostal = document.getElementById('codigosPostales_menu').value;
        const fkPuebloCiudad = document.getElementById('pueblosCiudades_menu').value;
        const fkMunicipio = document.getElementById('municipios_menu').value;
        const fkEstado = document.getElementById('estados_menu').value;
        const fkPais = document.getElementById('paises_menu').value;

        if (!fkCodigoPostal || !fkPuebloCiudad || !fkMunicipio || !fkEstado || !fkPais) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fkCodigoPostal, fkPuebloCiudad, fkMunicipio, fkEstado, fkPais })
        });

        const data = await response.json();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        await listarUbicaciones();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarUbicacion(pkUbicacion) {
    try {
        await agregarUbicacion(pkUbicacion);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function eliminarUbicacion(pkUbicacion) {
    try {
        if (!pkUbicacion) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/ubicaciones', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkUbicacion })
        });

        const data = await response.json();
        await listarUbicaciones();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function abrirModalUbicaciones(modo, pkUbicacion) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar ubicacion';
        modalButton.setAttribute('onclick', 'agregarUbicacion()');
        document.getElementById('codigosPostales_menu').value = '';
        document.getElementById('pueblosCiudades_menu').value = '';
        document.getElementById('municipios_menu').value = '';
        document.getElementById('estados_menu').value = '';
        document.getElementById('paises_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar ubicacion';
        modalButton.setAttribute('onclick', `editarUbicacion(${pkUbicacion})`);

    }

}


