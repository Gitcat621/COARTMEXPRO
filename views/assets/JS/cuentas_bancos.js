$(document).ready(function () {

    listarCuentaBanco();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarCuentaBanco").click(function() {
    abrirModalCuentaBanco(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#cuentaBancoTable').DataTable({
        columns: [
            { title: "Numero de cuenta" },
            { title: "Banco afiliado" },
            { title: "Beneficiario" },
            { title: "Proveedor" },
            {
                title: "Opciones",
                render: function (data, type, row) { // 'row' contiene toda la fila de datos
                    return `<div class="text-center">
                                <button class="btn btn-xs editar-btn" data-row='${JSON.stringify(row)}'><i class="fa fa-pencil"></i></button>
                                <button class="btn btn-xs eliminar-btn" data-pk="${row[1]}" data-nombre="${row[0]}"><i class="fa fa-trash"></i></button>
                            </div>`;
                }
            }
        ],
        scrollX: true,
    });

    // Event listeners para los botones 
    // Editar
    $('#cuentaBancoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const numeroCuenta = rowData[0];
        const nombreBeneficiario = rowData[2];
        const fkBanco = rowData[4];
        const fkProveedor = rowData[5];
        const pkCuentaBanco = rowData[6];


        document.getElementById('numeroCuenta').value = numeroCuenta;
        document.getElementById('nombreBeneficiario').value = nombreBeneficiario;
        document.getElementById('banco_menu').value = fkBanco;
        document.getElementById('proveedor_menu').value = fkProveedor;
  
        abrirModalCuentaBanco(2,pkCuentaBanco)

    });

    // Eliminar
    $('#cuentaBancoTable').on('click', '.eliminar-btn', function () {


        const pkCuentaBanco = $(this).data('pk');
        const numeroCuenta = $(this).data('nombre');


        Swal.fire({
            title: `¿Eliminar a ${numeroCuenta}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
               eliminarCuentaBanco(pkCuentaBanco);
            }
        });
    });

});

async function listarCuentaBanco() {

    try {
        
        const response = await fetch('http://127.0.0.1:5000/coartmex/cuentas_banco', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        try{
            let tabla = $('#cuentaBancoTable').DataTable();
            tabla.clear().rows.add(data.map(cuentaBanco => [
                cuentaBanco.numeroCuenta, //0
                cuentaBanco.nombreBanco, //1
                cuentaBanco.nombreBeneficiario, //2
                cuentaBanco.nombreProveedor, //3
                cuentaBanco.fkBanco, //4
                cuentaBanco.fkProveedor, //5
                cuentaBanco.pkCuentaBanco //6
            ])).draw();

        }catch{
            console.log('No hay tabla para: cuentasBanco')
        }

        try{

            const select = document.getElementById('cuentaBanco_menu');
            select.innerHTML = "";

            data.forEach(cuentaBanco => {

                let option = document.createElement('option');
                option.value = cuentaBanco.pkCuentaBanco;
                option.textContent = cuentaBanco.numeroCuenta;
                select.appendChild(option);

            });

        }catch{
            console.log('No hay menu para: cuentasBanco')
        }
        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar los cuentasBanco`, 'Error', {"closeButton": true,});
    }
}

async function agregarCuentaBanco(fkProveedor) {
    try {

        if(!fkProveedor){
            fkProveedor = document.getElementById('proveedor_menu').value;
        }

        const numeroCuenta = document.getElementById('numeroCuenta').value.trim();
        const nombreBeneficiario = document.getElementById('nombreBeneficiario').value.trim();
        const fkBanco = document.getElementById('banco_menu').value;

        if (!numeroCuenta || !nombreBeneficiario || !fkBanco || !fkProveedor) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cuentas_banco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroCuenta, nombreBeneficiario, fkBanco, fkProveedor })
        });

        const data = await response.json();

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-2').modal('hide');

        await listarCuentaBanco();
        await listarProveedores();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarCuentaBanco(pkCuentaBanco) {
    try {
        const numeroCuenta = document.getElementById('numeroCuenta').value.trim();
        const nombreBeneficiario = document.getElementById('nombreBeneficiario').value.trim();
        const fkBanco = document.getElementById('banco_menu').value;
        const fkProveedor = document.getElementById('proveedor_menu').value;

        if (!pkCuentaBanco || !numeroCuenta || !nombreBeneficiario || !fkBanco || !fkProveedor) {
            toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cuentas_banco', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCuentaBanco, numeroCuenta, fkBanco, nombreBeneficiario, fkProveedor })
        });

        const data = await response.json();
        await listarCuentaBanco();
        await listarProveedores();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarCuentaBanco(pkCuentaBanco) {
    try {
        if (!pkCuentaBanco) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/cuentas_banco', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCuentaBanco })
        });

        const data = await response.json();
        await listarCuentaBanco();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalCuentaBanco(modo, pkCuentaBanco) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar cuenta de banco';
        modalButton.setAttribute('onclick', `agregarCuentaBanco(${pkCuentaBanco})`);

        document.getElementById('numeroCuenta').value = '';
        document.getElementById('nombreBeneficiario').value = '';
        document.getElementById('banco_menu').value = '';
        document.getElementById('proveedor_menu').value = '';
        
        let elemento = document.getElementById('proveedorContenedor');
        if (!pkCuentaBanco) {
            elemento.style.display = "block";

        } else {
            elemento.style.display = "none";
        }

    } else if (modo === 2) {
        
        modalTitle.textContent = 'Editar cuenta de banco';
        modalButton.setAttribute('onclick', `editarCuentaBanco(${pkCuentaBanco})`);

        $('#boostrapModal-2').modal('show');

    }

}


