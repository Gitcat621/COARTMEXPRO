$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Sistemas' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    listarGruposSocios();
    
});

//Asignar funcion al boton de abrir modal
$("#agregarGrupoSocio").click(function() {
    abrirModalGrupoSocio(1);
});

//Inicializar datatable
$(document).ready(function() {


    $('#grupoTable').DataTable({
        columns: [
            { title: "Nombre del grupo" },
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
    $('#grupoTable').on('click', '.editar-btn', function () {

        const rowData = $(this).data('row'); 

        const nombreGrupoSocio = rowData[0];
        const pkGrupoSocio = rowData[1];


        document.getElementById('nombreGrupoSocio').value = nombreGrupoSocio;


        abrirModalGrupoSocio(2,pkGrupoSocio);
    });

    // Eliminar
    $('#grupoTable').on('click', '.eliminar-btn', function () {

        const pkGrupoSocio = $(this).data('pk');
        const nombreGrupoSocio = $(this).data('nombre');

        Swal.fire({
            title: `¿Eliminar a ${nombreGrupoSocio}?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarGrupoSocio(pkGrupoSocio);    
            }
        });
        
    });
});

async function agregarGrupoSocio() {
    const nombreGrupoSocio = document.getElementById('nombreGrupoSocio').value.trim();

    if (!nombreGrupoSocio) {
        toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreGrupoSocio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
        $('#boostrapModal-2').modal('hide');
        listarGruposSocios();
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


async function listarGruposSocios() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        try{

            const tabla = $('#grupoTable').DataTable();
            tabla.clear().draw();
            tabla.rows.add(data.map(grupo => [
                grupo.nombreGrupoSocio,
                grupo.pkGrupoSocio
            ])).draw();

        }catch{
            console.log('No existe tabla para: Grupo de socios comerciales');
        }

        try{

            document.getElementById('grupo_menu').innerHTML = "";

            //Mapear en un select
            data.forEach(function(data) {
                
            
                let HTML = `<option value="${data.pkGrupoSocio}">${data.nombreGrupoSocio}</option>`;
            
                //Mapear valor por cada elemento en la consulta 
                document.getElementById('grupo_menu').innerHTML += HTML;


            });

        }catch{
            console.log('No existe menu para: Grupo de socios comerciales');
        }

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}


async function editarGrupoSocio(pkGrupoSocio) {
    const nombreGrupoSocio = document.getElementById('nombreGrupoSocio').value.trim();

    if (!pkGrupoSocio || !nombreGrupoSocio) {
        toastr.warning('Por favor, completa todos los campos', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkGrupoSocio, nombreGrupoSocio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarGruposSocios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


async function eliminarGrupoSocio(pkGrupoSocio) {
    if (!pkGrupoSocio) {
        toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/gruposSocio', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkGrupoSocio })
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        listarGruposSocios();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalGrupoSocio(modo, pkGrupoSocio) {

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel2');
    const modalButton = document.querySelector('#boostrapModal-2 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        modalTitle.textContent = 'Agregar grupo de socio';
        modalButton.setAttribute('onclick', 'agregarGrupoSocio()');

        document.getElementById('nombreGrupoSocio').value = '';
    } else if (modo === 2) {

        $('#boostrapModal-2').modal('show');
        modalTitle.textContent = 'Editar grupo de socio';
        modalButton.setAttribute('onclick', `editarGrupoSocio(${pkGrupoSocio})`);

    }

}


