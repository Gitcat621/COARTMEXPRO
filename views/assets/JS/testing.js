$(document).ready(function() {
  var table = $('#example').DataTable();

  $('#example tbody').on('click', 'tr', function () {
    var tr = $(this);
    var row = table.row(tr);

    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
    } else {
      //<td>Juan Pérez</td>
      //row.child('<div style="padding: 10px;">Más información sobre ' + row.data()[0] + '</div>').show();
      row.child(`
        <tr>
          <td>Full name:</td>
        </tr>
        <tr>
          <td>Extension number:</td>
        </tr>
        <tr>
           <td>Extra info:</td>  
        </tr>
      `).show();
      tr.addClass('shown');
      }
  });

  cargarMetricasServicio();
});

async function cargarMetricasServicio() {

    const year = new Date().getFullYear();

    const meses = [1,2,3,4,5];

    const params = new URLSearchParams();
    meses.forEach((mes) => params.append("items[]", mes));

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/detalles?${params.toString()}&year=${year}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 500) {
            toastr.error('El servidor no pudo obtener la información', 'Error inesperado', {"closeButton": true});
            return;
        }

        const data = await response.json();

        mostrarServicio(data.servicio);
        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

function mostrarServicio(data) {
    const contenedor = document.getElementById('contenedorGruposServicio');
    contenedor.innerHTML = "";

    // Agrupar por grupo
    const grupos = {};
    let totalOrdenadas = 0;
    let totalVendidas = 0;
    let totalPorcentaje = 0;
    const ordenesUnicas = new Set();

    data.forEach(item => {
        const grupo = item.nombreGrupoSocio;
        if (!grupos[grupo]) grupos[grupo] = [];
        grupos[grupo].push(item);

        ordenesUnicas.add(`${item.nombreGrupoSocio}::${item.numeroOrdenCompra}`);
        totalOrdenadas += parseInt(item.cantidadOrdenada);
        totalVendidas += parseInt(item.cantidadVendida);
        totalPorcentaje += parseFloat(item.porcentajePromedioServicio);
    });

    let index = 0;
    for (const [grupoNombre, registros] of Object.entries(grupos)) {
        const tableId = `tablaGrupoServicio${index}`;
        let subtotalOrdenadas = 0;
        let subtotalVendidas = 0;
        let subtotalPorcentaje = 0;

        let tablaHTML = `
            <div class="mb-4">
                <h5 class="font-weight-bold">${grupoNombre}</h5>
                <table id="${tableId}" class="table table-bordered table-sm" style="width:100%">
                    <thead class="thead-light">
                        <tr>
                            <th>Socio</th>
                            <th>Pzas ordenadas</th>
                            <th>Pzas entregadas</th>
                            <th># OC</th>
                            <th>% Entrega</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        registros.forEach(item => {
            const ordenadas = parseInt(item.cantidadOrdenada);
            const vendidas = parseInt(item.cantidadVendida);
            const porcentaje = parseFloat(item.porcentajePromedioServicio);

            subtotalOrdenadas += ordenadas;
            subtotalVendidas += vendidas;
            subtotalPorcentaje += porcentaje;

            tablaHTML += `
                <tr>
                    <td>${item.nombreSocio}<br><small>${item.codigoArticulo} - ${item.nombreArticulo}</small></td>
                    <td class="text-center">${ordenadas}</td>
                    <td class="text-center">${vendidas}</td>
                    <td class="text-center">${item.numeroOrdenCompra}</td>
                    <td class="text-center">${porcentaje.toFixed(2)}%</td>
                </tr>
            `;
        });

        const promedioGrupo = (subtotalPorcentaje / registros.length).toFixed(2);
        tablaHTML += `
                    </tbody>
                    <tfoot style="font-weight:bold;">
                        <tr>
                            <td>Totales del grupo</td>
                            <td class="text-center">${subtotalOrdenadas.toLocaleString('es-MX')}</td>
                            <td class="text-center">${subtotalVendidas.toLocaleString('es-MX')}</td>
                            <td class="text-center">${new Set(registros.map(r => r.numeroOrdenCompra)).size}</td>
                            <td class="text-center">${promedioGrupo}%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        contenedor.innerHTML += tablaHTML;

        // Activar DataTable
        setTimeout(() => {
            $(`#${tableId}`).DataTable({
                paging: true,
                pageLength: 5,
                lengthChange: false,
                searching: false,
                info: false,
                ordering: false,
                scrollX: true,
                language: {
                    paginate: {
                        previous: "Anterior",
                        next: "Siguiente"
                    },
                    emptyTable: "No hay datos disponibles"
                }
            });
        }, 0);

        index++;
    }

    // Total general al final
    const promedioTotal = (totalPorcentaje / data.length).toFixed(2);
    const resumenHTML = `
        <div class="alert alert-secondary font-weight-bold mt-4">
            Total general — Ordenadas: ${totalOrdenadas.toLocaleString('es-MX')} · 
            Entregadas: ${totalVendidas.toLocaleString('es-MX')} · 
            # OCs: ${ordenesUnicas.size} · 
            % Entrega: ${promedioTotal}%
        </div>
    `;
    contenedor.innerHTML += resumenHTML;
}
