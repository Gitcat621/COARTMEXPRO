$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'SISTEMAS' && sessionStorage.getItem("departamento") !== 'DIRECCION COMERCIAL') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarProveedores();
    
});


//Asignar funcion al boton de abrir modal
$("#agregarProveedor").click(function() {
    abrirModalProveedor(1);
});


$(document).on('click', '.cuentas-btn', function () {

    const tabla = $('#proveedorTable').DataTable();
    const rowData = tabla.row($(this).closest('tr')).data();

    $('#boostrapModal-2').modal('show');
    abrirModalCuentaBanco(1,rowData[23]);
});



//Inicializar datatable
$(document).ready(function() {


    $('#proveedorTable').DataTable({
    columns: [
        { title: "Nombre" },
        { title: "Correo" },
        { title: "Telefonos" },
        { title: "Metodos de pago"},
        { title: "Dias de credito" },
        { title: "Factura / Nota" },
        {
            title: "Cuentas de banco",
            render: function (data, type, row) {
                const cuentas = data ? data : "Agregar cuenta"; // o usa "" si prefieres dejar vacío
                return `${cuentas} , <button class="btn btn-xsxs btn-success cuentas-btn"><i class="fa fa-plus"></i></button>`;
            }
        },
        { title: "Bancos" },
        { title: "Beneficiarios" },
        { title: "Dias de entrega" },
        { title: "Flete" },
        { title: "Paqueterias" },
        { title: "CodigoPostal" },
        { title: "Municipio" },
        { title: "Estado" },
        {
            title: "Opciones",
            render: function (data, type, row) {
                return `<div class="text-center">
                            <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                            <button class="btn btn-xs eliminar-btn" data-pk="${row[23]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                        </div>`;
            }
        }
    ],
    scrollX: true
    });


    // Event listeners para los botones
    // Editar
    $('#proveedorTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreProveedor     = rowData[0];
        const correoProveedor     = rowData[1];
        const telefonos           = rowData[2];
        const metodosPago         = rowData[3];
        const diasCredito         = rowData[4];
        const facturaNota         = rowData[5];
        const bancos              = rowData[6];
        const numerosCuenta       = rowData[7];
        const beneficiarios       = rowData[8];
        const diasEntrega         = rowData[9];
        const flete               = rowData[10];
        const paqueterias         = rowData[11];
        const codigoPostal        = rowData[12];
        const nombreMunicipio     = rowData[13];
        const nombreEstado        = rowData[14];
        const fkUbicacion         = rowData[15];
        const pkCodigoPostal      = rowData[16];
        const pkPuebloCiudad      = rowData[17];
        const pkMunicipio         = rowData[18];
        const pkEstado            = rowData[19];
        const pkMetodos           = rowData[20];
        const pkTelefonos         = rowData[21];
        const pkPaqueterias       = rowData[22];
        const pkProveedor         = rowData[23];



        document.getElementById('nombreProveedor').value = nombreProveedor;
        document.getElementById('correoProveedor').value = correoProveedor;
        document.getElementById('diasCredito').value = diasCredito;
        document.getElementById('diasEntrega').value = diasEntrega;

        //FLETES
        const flete_menu = document.getElementById("flete_menu");
        for (let i = 0; i < flete_menu.options.length; i++) {
            if (flete_menu.options[i].textContent.trim() === flete.trim()) {
                flete_menu.selectedIndex = i;
                break;
            }
        }

        //FACTURA / NOTA
        const fn_menu = document.getElementById('fn_menu');
        for (let i = 0; i < fn_menu.options.length; i++) {
            if (fn_menu.options[i].textContent.trim() === facturaNota.trim()) {
                fn_menu.selectedIndex = i;
                break;
            }
        }

        //TELEFONOS
        const select = document.getElementById("telefono_menu");
        select.innerHTML = ""; // Limpiar antes
        if (
            telefonos &&
            typeof telefonos === "string" &&
            telefonos.trim() !== "" &&
            pkTelefonos &&
            typeof pkTelefonos === "string" &&
            pkTelefonos.trim() !== ""
        ) {
            const numeros = telefonos
                .split(",")
                .map(t => t.trim())
                .filter(t => t !== "");

            const ids = pkTelefonos
                .split("-")
                .map(id => id.trim())
                .filter(id => id !== "");

            if (numeros.length > 0 && ids.length > 0 && numeros.length === ids.length) {
                numeros.forEach((telefono, index) => {
                    const option = document.createElement("option");
                    option.value = telefono;
                    option.textContent = telefono;
                    option.dataset.id = ids[index];
                    option.selected = true;
                    select.appendChild(option);
                });
            }
        }


        //PAQUETERIAS
        if (pkPaqueterias && pkPaqueterias.trim() !== "") {
            const idsSeleccionados = pkPaqueterias.split("-");

            const select = document.getElementById('paqueteria_menu');

            for (const option of select.options) {
                if (idsSeleccionados.includes(option.value)) {
                    option.selected = true;
                }
            }

            // Actualizar visualmente si usas Select2
            $('#paqueteria_menu').trigger('change');
        } else {
            console.warn("No se especificaron paqueterías para seleccionar.");
        }

        //Metodos
        if (pkMetodos && pkMetodos.trim() !== "") {
            const idsSeleccionados = pkMetodos.split("-");

            const select = document.getElementById('metodoPago_menu');

            for (const option of select.options) {
                if (idsSeleccionados.includes(option.value)) {
                    option.selected = true;
                }
            }

            // Actualizar visualmente si usas Select2
            $('#metodoPago_menu').trigger('change');
        } else {
            console.warn("No se especificaron metodos de pago para seleccionar.");
        }

        
        document.getElementById('diasCredito').value = diasCredito;
        document.getElementById('ubicacion_menu').value = fkUbicacion;

        $('#codigosPostales_menu').val([pkCodigoPostal]).trigger('change');
        $('#pueblosCiudades_menu').val([pkPuebloCiudad]).trigger('change');
        $('#municipios_menu').val([pkMunicipio]).trigger('change');
        $('#estados_menu').val([pkEstado]).trigger('change');


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
    const select = document.getElementById('codigosPostales_menu');
    const codigoPostalContenido = Array.from(select.selectedOptions).map(opt => opt.textContent);

    const puebloCiudad = document.getElementById('pueblosCiudades_menu').value;
    const municipio = document.getElementById('municipios_menu').value;
    const estado = document.getElementById('estados_menu').value;

    const metodosSeleccionados = Array.from(document.getElementById('metodoPago_menu').selectedOptions).map(o => o.value);
    const numerosSeleccionados = Array.from(document.getElementById('telefono_menu').selectedOptions).map(o => o.value);
    const paqueteriasSeleccionadas = Array.from(document.getElementById('paqueteria_menu').selectedOptions).map(o => o.value);

    //Validar datos ingresados

    if (!nombreProveedor || !correoProveedor || !diasCredito || !facturaNota || !diasEntrega || !flete ||
        !codigoPostal || !puebloCiudad || !municipio || !estado || metodosSeleccionados.length === 0 ||
        numerosSeleccionados.length === 0 || paqueteriasSeleccionadas.length === 0) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }
    

    if (!numerosSeleccionados.every(num => /^\d{10}$/.test(num))) {
        toastr.warning('Cada número de emergencia debe tener exactamente 10 dígitos numéricos', 'Atención', { "closeButton": true });
        return;
    }

    
    if (codigoPostalContenido[0].length !== 5) {
        toastr.warning('El código postal debe tener exactamente 5 caracteres', 'Atención', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete,
                codigoPostal, puebloCiudad, municipio, estado, metodosSeleccionados, numerosSeleccionados, paqueteriasSeleccionadas
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
        listarCodigosPostales();
        listarPueblosCiudades();
        listarMunicipios();
        listarEstados();
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

        //console.log(data);

        try {
            const tabla = $('#proveedorTable').DataTable();
            tabla.clear().draw();
            tabla.rows.add(data.map(p => [
                p.nombreProveedor, //0
                p.correoProveedor, //1
                p.telefonos, //2
                p.metodosPago, //3
                p.diasCredito, //4
                p.facturaNota, //5
                p.numerosCuenta, //6
                p.bancos, //7
                p.beneficiarios, //8
                p.diasEntrega, //9
                p.flete, //10
                p.paqueterias, //11 
                p.codigoPostal, //12
                p.nombreMunicipio, //13
                p.nombreEstado, //14
                p.fkUbicacion, //15
                p.pkCodigoPostal, //16
                p.pkPuebloCiudad, //17
                p.pkMunicipio, //18
                p.pkEstado, //19
                p.pkMetodos, //20
                p.pkTelefonos, //21
                p.pkPaqueterias, //22
                p.pkProveedor //23
            ])).draw();
        }catch{
            console.log('No existe una tabla para: Proveedores')
        }

        try {

            const select = document.getElementById('proveedor_menu');
            select.innerHTML = "";

            data.forEach(proveedor => {

                let option = document.createElement('option');
                option.value = proveedor.pkProveedor;
                option.textContent = proveedor.nombreProveedor;
                select.appendChild(option);

            });

        }catch{
            console.log('No existe un menu para: Proveedores')
        }

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}


async function editarProveedor(pkProveedor) {

    const nombreProveedor = document.getElementById('nombreProveedor').value.trim();
    const correoProveedor = document.getElementById('correoProveedor').value.trim();
    const diasCredito = document.getElementById('diasCredito').value.trim();
    const facturaNota = document.getElementById('fn_menu').value;
    const diasEntrega = document.getElementById('diasEntrega').value.trim();
    const flete = document.getElementById('flete_menu').value;

    const codigoPostal = document.getElementById('codigosPostales_menu').value;
    const codigosPostales_menu = document.getElementById('codigosPostales_menu');
    const codigoPostalContenido = Array.from(codigosPostales_menu.selectedOptions).map(opt => opt.textContent);

    const puebloCiudad = document.getElementById('pueblosCiudades_menu').value;
    const municipio = document.getElementById('municipios_menu').value;
    const estado = document.getElementById('estados_menu').value;

    const telefono_menu = document.getElementById("telefono_menu");
    const pkTelefonos = Array.from(telefono_menu.selectedOptions)
    .map(opt => opt.dataset.id)
    .filter(id => id !== undefined);


    const fkUbicacion = document.getElementById('ubicacion_menu').value;

    const metodosSeleccionados = Array.from(document.getElementById('metodoPago_menu').selectedOptions).map(o => o.value);
    const numerosSeleccionados = Array.from(document.getElementById('telefono_menu').selectedOptions).map(o => o.value);
    const paqueteriasSeleccionadas = Array.from(document.getElementById('paqueteria_menu').selectedOptions).map(o => o.value);
    //Validar datos ingresados

    if (!nombreProveedor || !correoProveedor || !diasCredito || !facturaNota || !diasEntrega || !flete ||
        !codigoPostal || !puebloCiudad || !municipio || !estado || metodosSeleccionados.length === 0 ||
        numerosSeleccionados.length === 0 || paqueteriasSeleccionadas.length === 0) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }
    

    if (!numerosSeleccionados.every(num => /^\d{10}$/.test(num))) {
        toastr.warning('Cada número de emergencia debe tener exactamente 10 dígitos numéricos', 'Atención', { "closeButton": true });
        return;
    }

    
    if (codigoPostalContenido[0].length !== 5) {
        toastr.warning('El código postal debe tener exactamente 5 caracteres', 'Atención', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/proveedores', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pkProveedor ,nombreProveedor, correoProveedor, diasCredito, facturaNota, diasEntrega, flete, fkUbicacion,
                codigoPostal, puebloCiudad, municipio, estado, metodosSeleccionados, numerosSeleccionados, pkTelefonos, paqueteriasSeleccionadas, 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

         $('#boostrapModal-1').modal('hide');
        listarProveedores();
        listarCodigosPostales();
        listarPueblosCiudades();
        listarMunicipios();
        listarEstados();
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
        
        document.getElementById('nombreProveedor').value = '';
        document.getElementById('correoProveedor').value = '';
        document.getElementById('diasCredito').value = '';
        document.getElementById('fn_menu').value = '';
        document.getElementById('diasEntrega').value = '';
        document.getElementById('flete_menu').value = '';

        $('#metodoPago_menu').val(null).trigger('change');
        $('#telefono_menu').val(null).trigger('change');
        $('#paqueteria_menu').val(null).trigger('change');

        $('#codigosPostales_menu').val(null).trigger('change');
        $('#pueblosCiudades_menu').val(null).trigger('change');
        $('#municipios_menu').val(null).trigger('change');
        $('#estados_menu').val(null).trigger('change');

    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar proveedor';
        modalButton.setAttribute('onclick', `editarProveedor('${pkProveedor}')`);

    }

}

$("#info").click(function() {
    toastr.info('Posicione el cursor sobre la tabla, presione shift y mueva la rueda del raton', 'Informacion', {"closeButton": true,});
});
