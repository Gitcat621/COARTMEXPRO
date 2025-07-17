$(document).ready(function () {

    listarCajas();
    listarArticulos(0);
    
});

//Asignar funcion al boton de abrir modal
$("#agregarCaja").click(function() {
    abrirModalCajas(1);
});

// Editar caja
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-editar-caja')) {
        const pkCaja = e.target.closest('.btn-editar-caja').dataset.pk;
        console.log("Editar caja: " + pkCaja);
        listarArticulos(pkCaja);
        abrirModalCajas(2,pkCaja);
        // Lógica para editar...

    }
});

// Eliminar caja
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-eliminar-caja')) {
        const pkCaja = e.target.closest('.btn-eliminar-caja').dataset.pk;
        console.log("Eliminar caja: " + pkCaja);
        // Confirmar y eliminar...
        eliminarCaja(pkCaja);
    }
});

async function listarArticulos(pkCaja) {
    try {
        const response = await fetch(`/api/articulos`);
        const data = await response.json();

        const cantidadResponse = await fetch(`/api/envios/cajas_contenido?pkCaja=${pkCaja}`);
        const cantidadesData = await cantidadResponse.json();

        const mapaCantidades = {};
        cantidadesData.forEach(p => {
            mapaCantidades[p.codigoArticulo] = p.cantidad;
            console.log(p.cantidad);
        });

        const tabla = $('#cajaContenidoTable').DataTable({
            destroy: true,
            columns: [
              {
                title: "Seleccionar",
                data: "codigo",
                render: function (codigo, type, row) {
                  const checked = row.cantidad ? 'checked' : '';
                  return `<div class="text-center"><input type="checkbox" class="articulo-checkbox" data-codigo="${codigo}" ${checked}></div>`;
                }
              },
              { title: "Código", data: "codigo" },
              { title: "Nombre", data: "nombre" },
              {
                title: "Cantidad",
                data: "cantidad",
                render: function (cantidad, type, row) {
                  const value = cantidad || '';
                  return `<input type="number" class="form-control cantidad-articulo" data-codigo="${row.codigo}" value="${value}">`;
                }
              }
            ]
          });
          const datosTabla = data.map(art => ({
            codigo: art.codigoArticulo,
            nombre: art.nombreArticulo,
            cantidad: mapaCantidades[art.codigoArticulo] || ''
          }));

          tabla.clear().rows.add(datosTabla).draw();



    } catch (error) {
        console.error("Error:", error);
    }
}

async function listarCajas() {

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const pkEnvio = urlParams.get('envio');
        
        const response = await fetch(`/api/envios/cajas?pkEnvio=${pkEnvio}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        armarCajas(data);

        
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error(`Error al listar las cajas`, 'Error', {"closeButton": true,});
    }
}

function armarCajas(data){

    if(data.length >= 1){
        // 1. Agrupar por pkCaja
        const cajasMap = {};
        data.forEach(item => {
            if (!cajasMap[item.pkCaja]) {
                cajasMap[item.pkCaja] = [];
            }
            cajasMap[item.pkCaja].push(item);
        });

        // 2. Obtener contenedor donde insertar el HTML
        const contenedor = document.getElementById("contenedorCajas"); // Asegúrate de tener este div en el HTML
        contenedor.innerHTML = ""; // Limpia si ya existía algo

        // 3. Renderizar cada caja
        let cajaIndex = 1;

        Object.entries(cajasMap).forEach(([pkCaja, articulos]) => {
            const tablaId = `cajaTable_${pkCaja}`;

            let tablaHTML = `
                <div class="mb-4">
                    <h3>Caja ${cajaIndex} 
                        <button class="btn btn-circle btn-xs btn-editar-caja" data-pk="${pkCaja}">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <span>  </span>
                        <button class="btn btn-circle btn-xs btn-eliminar-caja" data-pk="${pkCaja}">
                            <i class="fa fa-trash"></i>
                        </button> 
                    </h3>
                    <table id="${tablaId}" class="table table-small-font table-hover table-bordered display" style="width:100%">
                        <thead>
                            <tr>
                                <th>Articulo</th>
                                <th style="width: 20%;" class='text-center'>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            articulos.forEach(a => {
                tablaHTML += `
                    <tr>
                        <td>${a.nombreArticulo}</td>
                        <td class='text-center'>${a.cantidad}</td>
                    </tr>
                `;
            });

            tablaHTML += `
                        </tbody>
                    </table>
                </div>
            `;

            contenedor.innerHTML += tablaHTML;

            cajaIndex++; // Incrementar contador
        });


        setTimeout(() => {
            Object.keys(cajasMap).forEach(pkCaja => {
                $(`#cajaTable_${pkCaja}`).DataTable({
                    paging: false,
                    searching: false,
                    info: false
                });
            });
        }, 100);
    }else{
        // 2. Obtener contenedor donde insertar el HTML
        const contenedor = document.getElementById("contenedorCajas"); // Asegúrate de tener este div en el HTML
        contenedor.innerHTML = ""; // Limpia si ya existía algo

        contenedor.innerHTML = "<h3>Sin cajas</h3>"; // Limpia si ya existía algo
    }
    
}

async function agregarCaja() {
    try {
        const articulos = obtenerArticulosSeleccionados();
        if (articulos.length <= 0){
            toastr.warning('No se han seleccionado articulos', 'Advertencia', { "closeButton": true });
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const pkEnvio = urlParams.get('envio');

        const response = await fetch('/api/envios/cajas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkEnvio, articulos })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

        $('#boostrapModal-1').modal('hide');
        await listarCajas();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function obtenerArticulosSeleccionados() {
    const tabla = $('#cajaContenidoTable').DataTable();
    const seleccionados = [];
    let hayErrores = false;

    tabla.rows().every(function () {
        const rowNode = this.node();
        const checkbox = $(rowNode).find('.articulo-checkbox');

        if (checkbox.is(':checked')) {
            const data = this.data();
            const cantidad = $(rowNode).find('.cantidad-articulo').val();

            // Validar que el cantidad no esté vacío y sea un número válido
            if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
                hayErrores = true;
                $(rowNode).find('.cantidad-articulo').addClass('is-invalid'); // estilo visual
            } else {
                $(rowNode).find('.cantidad-articulo').removeClass('is-invalid');
                seleccionados.push({
                    codigo: data.codigo,
                    cantidad: parseFloat(cantidad)
                });
            }
        }
    });

    if (hayErrores) {
        Swal.fire({
        title: "Hay articulos sin cantidad",
        text: "Hay uno o mas articulos seleccionados sin cantidad",
        icon: "warning",
        confirmButtonColor: "#3085D6",
        confirmButtonText: "Entendido",
    });
        return [];
    }

    console.log("Artículos seleccionados y validados:", seleccionados);
    return seleccionados;
}

async function editarCaja(pkCaja) {
    try {
        const articulos = obtenerArticulosSeleccionados();
        if (articulos.length <= 0){
            toastr.warning('No se han seleccionado articulos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/envios/cajas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCaja, articulos })
        });

        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        await listarCajas();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function eliminarCaja(pkCaja) {
    try {
        if (!pkCaja) {
            toastr.warning('No se pudo obtener el elemento', 'Advertencia', { "closeButton": true });
            return;
        }

        const result = await Swal.fire({
            title: `¿Eliminar a esta caja?`,
            text: "No se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B71C1C",
            cancelButtonColor: "#C1C0C0",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) {
            toastr.info('Acción cancelada por el usuario', 'Cancelado', { "closeButton": true });
            return;
        }

        const response = await fetch('/api/envios/cajas', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkCaja })
        });

        const data = await response.json();
        await listarCajas();
        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}


function abrirModalCajas(modo, pkCaja) {

    setTimeout(() => {
        $('#cajaContenidoTable').DataTable().columns.adjust().draw();
    }, 222);

    //Obtener el valor de los elementos del modal
    const modalTitle = document.getElementById('myModalLabel');
    const modalButton = document.querySelector('#boostrapModal-1 .modal-footer .btn-primary');

    //Asignar diseño y comportamiento del modal dependiendo de la accion(Agregar o Editar)
    if (modo === 1) {

        const tabla = $('#cajaContenidoTable').DataTable();

        tabla.rows().every(function () {
            const $node = $(this.node());

            // Desmarcar el checkbox
            $node.find('input.articulo-checkbox').prop('checked', false);

            // Limpiar el campo de cantidad
            $node.find('input.cantidad-articulo').val('');
        });
        
        modalTitle.textContent = 'Agregar articulos a caja';
        modalButton.setAttribute('onclick', 'agregarCaja()');

        
    } else if (modo === 2) {

        $('#boostrapModal-1').modal('show');
        modalTitle.textContent = 'Editar contenido de caja';
        modalButton.setAttribute('onclick', `editarCaja(${pkCaja})`);

    }


}