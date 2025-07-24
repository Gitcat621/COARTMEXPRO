
$(document).ready(function () {

  obtenerTienda();
  listarArticulos();
  
});

async function obtenerTienda(){
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pkSocioComercial = urlParams.get('lista');

    const response = await fetch(`/api/socios_comerciales/socio_comercial?pkSocioComercial=${pkSocioComercial}`, {
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
      document.getElementById('nombreTienda').textContent = ' - ' + data[0].nombreSocio;
      document.getElementById('nombreGrupo').textContent = data[0].nombreGrupoSocio;

    }catch{
        console.log('No se pudo hacer la consulta')
    }
    
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    toastr.error(`Error al obtener el socio`, 'Error', {"closeButton": true,});
  }
}

async function listarArticulos() {
    try {
      const response = await fetch(`/api/articulos`);
      const data = await response.json();

      const urlParams = new URLSearchParams(window.location.search);
      const fkSocioComercial = urlParams.get('lista');

      const preciosResponse = await fetch(`/api/listas_precios/lista_precios?fkSocioComercial=${fkSocioComercial}`);
      const preciosData = await preciosResponse.json();

      const mapaPrecios = {};
      preciosData.forEach(p => {
          mapaPrecios[p.fkArticulo] = p.precioArticulo;
      });

      const tabla = $('#listaPrecioTable').DataTable({
          destroy: true,
          columns: [
            {
              title: `<div style="text-align:center">Add <i class="fa fa-plus"></i></div>`,

              width: '10%',
              data: "codigo",
              render: function (codigo, type, row) {
                const checked = row.precio ? 'checked' : '';
                return `<div class='text-center'><input type="checkbox" class="articulo-checkbox" data-codigo="${codigo}" ${checked}></div>`;
              }
            },
            { title: "Código", data: "codigo" },
            { title: "Nombre", data: "nombre" },
            {
              title: "Precio",
              data: "precio",
              render: function (precio, type, row) {
                const value = precio || '';
                return `<input type="number" class="form-control precio-articulo" data-codigo="${row.codigo}" value="${value}" placeholder="$">`;
              }
            }
          ]
      });

      const datosTabla = data.map(art => ({
          codigo: art.codigoArticulo,
          nombre: art.nombreArticulo,
          precio: mapaPrecios[art.codigoArticulo] || ''
      }));

      // Separar los artículos con precio (marcados) y sin precio (no marcados)
      const marcados = datosTabla.filter(a => a.precio !== '');
      const noMarcados = datosTabla.filter(a => a.precio === '');

      // Unir: primero los marcados, luego los no marcados
      const datosOrdenados = [...marcados, ...noMarcados];

      tabla.clear().rows.add(datosOrdenados).draw();

    } catch (error) {
        console.error("Error:", error);
    }
}

let modo = 0;
let mensaje = 'Unico'

$("#agregarListaPrecios").click(function() {

  let final;
  
  if (modo === 0) {
    final = document.getElementById('nombreTienda').textContent;

  } else {
    final = document.getElementById('nombreGrupo').textContent;
  }

  Swal.fire({
    title: `Guardar ${mensaje}`,
    text: `¿Se guardará asi para ${final}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085D6",
    cancelButtonColor: "#C1C0C0",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      agregarListaPrecio();
    }
  });
});


$("#switch-1").on("change", function () {
    if (this.checked) {
        modo = 1;
        mensaje = 'Todos'
    } else {
        modo = 0;
        mensaje = 'Unico'
    }

  toastr.clear(); 
  toastr.info(`"${mensaje}"`, 'Modo de guardado', { "closeButton": true });
});


async function agregarListaPrecio() {
  
  const articulos = obtenerArticulosSeleccionados();
  if (articulos.length <= 0){
    toastr.warning('No se han seleccionado articulos', 'Advertencia', { "closeButton": true });
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const fkSocioComercial = urlParams.get('lista');
  console.log("ID recibido:", fkSocioComercial);

  try {
  // Enviar los datos al backend (Flask) para insertar
  const response = await fetch(`/api/listas_precios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articulos, fkSocioComercial, modo })
  });

  const data = await response.json();

  if (!response.ok) {
    toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
    return;
  }

  toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });


  } catch (error) {
    console.error('Error:', error);
    toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
  }

}

function obtenerArticulosSeleccionados() {
    const tabla = $('#listaPrecioTable').DataTable();
    const seleccionados = [];
    let hayErrores = false;

    tabla.rows().every(function () {
        const rowNode = this.node();
        const checkbox = $(rowNode).find('.articulo-checkbox');

        if (checkbox.is(':checked')) {
            const data = this.data();
            const precio = $(rowNode).find('.precio-articulo').val();

            // Validar que el precio no esté vacío y sea un número válido
            if (!precio || isNaN(precio) || Number(precio) <= 0) {
                hayErrores = true;
                $(rowNode).find('.precio-articulo').addClass('is-invalid'); // estilo visual
            } else {
                $(rowNode).find('.precio-articulo').removeClass('is-invalid');
                seleccionados.push({
                    codigo: data.codigo,
                    precio: parseFloat(precio)
                });
            }
        }
    });

    if (hayErrores) {
        Swal.fire({
        title: "Hay articulos sin precio",
        text: "Hay uno o mas articulos seleccionados sin precio",
        icon: "warning",
        confirmButtonColor: "#3085D6",
        confirmButtonText: "Entendido",
    });
        return [];
    }

    console.log("Artículos seleccionados y validados:", seleccionados);
    return seleccionados;
}
