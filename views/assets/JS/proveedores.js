$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarProveedores();
    
});


//Asignar funcion al boton de abrir modal
$("#agregarProveedor").click(function() {
    abrirModalProveedor(1);
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


        abrirModalProveedor(2,pkProveedor);
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

async function agregarProveedor() {
    const nombreProveedor = document.getElementById('nombreProveedor').value.trim();
    const correoProveedor = document.getElementById('correoProveedor').value.trim();
    const diasCredito = document.getElementById('diasCredito').value.trim();
    const facturaNota = document.getElementById('fn_menu').value;
    const diasEntrega = document.getElementById('diasEntrega').value.trim();
    const flete = document.getElementById('flete_menu').value;

    const codigoPostal = document.getElementById('codigosPostales_menu').value;
    const puebloCiudad = document.getElementById('pueblosCiudades_menu').value;
    const municipio = document.getElementById('municipios_menu').value;
    const estado = document.getElementById('estados_menu').value;

    const numerosSeleccionados = Array.from(document.getElementById('telefono_menu').selectedOptions).map(o => o.value);
    const paqueteriasSeleccionadas = Array.from(document.getElementById('paqueteria_menu').selectedOptions).map(o => o.value);

    if (!numerosSeleccionados.every(num => /^\d+$/.test(num))) {
        toastr.warning('Se ha escrito texto como número de emergencia', 'Atención', { "closeButton": true });
        return;
    }

    if (codigoPostal && codigoPostal.length === 5) {
        console.log("Cadena válida");
    } else {
        toastr.warning('EL codigo postal debe tener 5 caracteres', 'Atención', { "closeButton": true });
        return;
    }



    if (!nombreProveedor || !correoProveedor || !diasCredito || !facturaNota || !diasEntrega || !flete ||
        !codigoPostal || !puebloCiudad || !municipio || !estado ||
        numerosSeleccionados.length === 0 || paqueteriasSeleccionadas.length === 0) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete,
                codigoPostal, puebloCiudad, municipio, estado, numerosSeleccionados, paqueteriasSeleccionadas
            })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
        $('#boostrapModal-1').modal('hide');
        listarProveedores();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


async function listarProveedores() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();

        const tabla = $('#proveedorTable').DataTable();
        tabla.clear().draw();
        tabla.rows.add(data.map(p => [
            p.nombreProveedor, p.correoProveedor, p.telefonos, p.metodosPago, p.diasCredito,
            p.facturaNota, p.bancos, p.numerosCuenta, p.beneficiarios, p.diasEntrega,
            p.flete, p.paqueterias, p.codigoPostal, p.nombreMunicipio, p.nombreEstado,
            p.fkUbicacion, p.pkCodigoPostal, p.pkPuebloCiudad, p.pkMunicipio, p.pkEstado, p.pkProveedor
        ])).draw();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}


async function editarProveedor(pkProveedor) {
    const nombreProveedor = document.getElementById('nombreProveedor').value.trim();
    const correoProveedor = document.getElementById('correoProveedor').value.trim();
    const diasCredito = document.getElementById('diasCredito').value.trim();
    const facturaNota = document.getElementById('fn_menu').value;
    const fkUbicacion = document.getElementById('ubicacion_menu').value;

    if (!pkProveedor || !nombreProveedor || !correoProveedor || !diasCredito || !facturaNota || !fkUbicacion) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkProveedor, nombreProveedor, correoProveedor, diasCredito, facturaNota, fkUbicacion })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarProveedores();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


async function eliminarProveedor(pkProveedor) {
    if (!pkProveedor) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkProveedor })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarProveedores();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalProveedor(modo, pkProveedor) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar proveedor';
        modalButton.setAttribute('onclick', 'agregarProveedor()');
        
        // document.getElementById('nombreProveedor').value = '';
        // document.getElementById('correoProveedor').value = '';
        // document.getElementById('diasCredito').value = '';
        // document.getElementById('fn_menu').value = '';
        // document.getElementById('ubicacion_menu').value = '';
        // document.getElementById('telefono_menu').value = '';

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar proveedor';
        modalButton.setAttribute('onclick', `editarProveedor('${pkProveedor}')`);

    }

}

$("#info").click(function() {
    toastr.info('Posicione el cursor sobre la tabla, presione shift y mueva la rueda del raton', 'Informacion', {"closeButton": true,});
});
