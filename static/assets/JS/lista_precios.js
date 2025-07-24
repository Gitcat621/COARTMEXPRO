$(document).ready(function () {

  //toastr.info(`Recarga la pagina si no se visualizan cambios realizados previamente`, 'Ver registros nuevos', {"closeButton": true,});

  $('#VerlistaPrecioTable').DataTable({
      columns: [
          { title: "Codigo" },
          { title: "Descripcion" },
          { title: "Precio" }
      ],
      scrollX: true,
  });

  obtenerTienda();
  listarArticulos();
  
});

$("#agregarListaPrecios").click(function() {

  const urlParams = new URLSearchParams(window.location.search);
  const pkSocioComercial = urlParams.get('lista');

  window.location.href = `./armar_lista_precios?lista=${encodeURIComponent(pkSocioComercial)}`;
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

  const urlParams = new URLSearchParams(window.location.search);
  const fkSocioComercial = urlParams.get('lista');

  try {
    const response = await fetch(`/api/listas_precios/lista_precios?fkSocioComercial=${fkSocioComercial}`, {
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
      let tabla = $('#VerlistaPrecioTable').DataTable();
      tabla.clear().rows.add(data.map(lista => [
          lista.fkArticulo, 
          lista.nombreArticulo,
          '$' + lista.precioArticulo.toLocaleString('es-MX')
      ])).draw();
    }catch{
      console.log('No hay tabla para: lista de precios')
    }

  } catch (error) {
      console.error("Error al cargar los datos:", error);
  }  
}


