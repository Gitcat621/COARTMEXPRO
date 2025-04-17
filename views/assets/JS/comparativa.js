$(document).ready(function () {

    //cargarMetricas();

    if (sessionStorage.getItem("departamento") !== 'Admon. Contable y Fiscal' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    
});

//Funcion que marca y desmarca las casillas de meses
document.getElementById('todos').addEventListener('click', () => {



    let checkboxes = document.querySelectorAll('.checkbox input[type="checkbox"]');



    let activar = Array.from(checkboxes).some(checkbox => !checkbox.checked); // Verifica si hay al menos uno sin marcar



    checkboxes.forEach(checkbox => {

        
        checkbox.checked = activar; // Activa o desactiva todos


    });
});


//Funcion para obtener meses marcados en las casillas
document.getElementById('filtro').addEventListener('click', () => {

    const checkboxes = document.querySelectorAll('.checkbox input[type="checkbox"]');


    let mesesSeleccionados = [];


    checkboxes.forEach(checkbox => {

        if (checkbox.checked && checkbox.value !== "all") {


            mesesSeleccionados.push(checkbox.value);

        }
    });
    
    if(mesesSeleccionados.length === 0){

        //console.log('No hay meses')
        toastr.warning(`No hay meses seleccionados`, 'Filtro', {
            "closeButton": true,
        });
        return;

    }

    var year1 = document.getElementById('year1').value;
    var year2 = document.getElementById('year2').value;

    if(year1 == "" || year2 == ""){

        toastr.warning(`No hay años seleccionados`, 'Filtro', {
            "closeButton": true,
        });
        return;
    }

    cargarMetricas1(mesesSeleccionados);

    cargarMetricas2(mesesSeleccionados);
    

});


//Cargas
function cargarMetricas1(meses){
    
    //console.log("Meses seleccionados:", meses);
    
    var year1 = document.getElementById('year1').value;
    
    const params = new URLSearchParams();
    
    // Agregar los meses a los parámetros
    meses.forEach((mes) => params.append("items[]", mes));
    
    // Agregar los años como parámetros
    params.append("year", year1);
    
    // Realizar la solicitud fetch con los parámetros en la URL
    fetch(`http://127.0.0.1:5000/coartmex/resumenes?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(obj => {
            Object.keys(obj).forEach(key => {
              if (obj[key] === null) {
                obj[key] = 0; // Reemplaza null con 0 (puedes usar cualquier otro valor)
            }
            });
        });
          

        const formateador = new Intl.NumberFormat('es-MX');

        function formatearYMostrar(idElemento, valor, prefijo = '') {
          const valorFormateado = formateador.format(valor);
          document.getElementById(idElemento).innerHTML = prefijo + valorFormateado;
        }
        
        if (data && data.length > 0) {
          const datos = data[0];
        
          formatearYMostrar('ingresos1', datos.totalIngresos, '$');
          formatearYMostrar('efectivoUtilizado1', datos.totalEgresos, '$');
          formatearYMostrar('flujoRemanente1', datos.efectivoRestante, '$');
          formatearYMostrar('ventas1', datos.totalVenta, '$');
        
          const crecimiento = datos.porcentajeCrecimiento;
          const valorLimitado = Math.round(crecimiento * 10) / 10;
          document.getElementById('crecimientos1').innerHTML = valorLimitado + "%";
        
          formatearYMostrar('articulos1', datos.existencias);
          formatearYMostrar('compras1', datos.totalComprasMercancia, '$');
          formatearYMostrar('socios1', datos.sociosNegociados);
          formatearYMostrar('articulosVendidos1', datos.articulosVendidos);
          formatearYMostrar('inventarios1', datos.valorInventario, '$');
          formatearYMostrar('cuentasPorCobrar1', datos.totalCxC, '$');
          formatearYMostrar('cuentasPorPagar1', datos.totalCxP, '$');
          formatearYMostrar('gastos1', datos.totalGastos, '$');
        } else {
          console.error("No se encontraron datos en el array 'data'.");
        }

        const fechaISO = data[0].fechaMasRecienteMes; // "2025-01-30"
        const partes = fechaISO.split("-"); // [ "2025", "01", "30" ]
        const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`; // "30/01/2025"
        
        //document.getElementById('fechaReciente1').innerHTML = fechaFormateada;
        

    })
    .catch(error => console.error("Error al cargar los datos:", error));
}

function cargarMetricas2(meses){
    
    //console.log("Meses seleccionados:", meses);

    var year2 = document.getElementById('year2').value;
    
    const params = new URLSearchParams();
    
    // Agregar los meses a los parámetros
    meses.forEach((mes) => params.append("items[]", mes));
    
    // Agregar los años como parámetros
    params.append("year", year2);
    
    // Realizar la solicitud fetch con los parámetros en la URL
    fetch(`http://127.0.0.1:5000/coartmex/resumenes?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(obj => {
            Object.keys(obj).forEach(key => {
              if (obj[key] === null) {
                obj[key] = 0; // Reemplaza null con 0 (puedes usar cualquier otro valor)
            }
            });
        });
          

        const formateador = new Intl.NumberFormat('es-MX');

        function formatearYMostrar(idElemento, valor, prefijo = '') {
          const valorFormateado = formateador.format(valor);
          document.getElementById(idElemento).innerHTML = prefijo + valorFormateado;
        }
        
        if (data && data.length > 0) {
          const datos = data[0];
        
          formatearYMostrar('ingresos2', datos.totalIngresos, '$');
          formatearYMostrar('efectivoUtilizado2', datos.totalEgresos, '$');
          formatearYMostrar('flujoRemanente2', datos.efectivoRestante, '$');
          formatearYMostrar('ventas2', datos.totalVenta, '$');
        
          const crecimiento = datos.porcentajeCrecimiento;
          const valorLimitado = Math.round(crecimiento * 10) / 10;
          document.getElementById('crecimientos2').innerHTML = valorLimitado + "%";
        
          formatearYMostrar('articulos2', datos.existencias);
          formatearYMostrar('compras2', datos.totalComprasMercancia, '$');
          formatearYMostrar('socios2', datos.sociosNegociados);
          formatearYMostrar('articulosVendidos2', datos.articulosVendidos);
          formatearYMostrar('inventarios2', datos.valorInventario, '$');
          formatearYMostrar('cuentasPorCobrar2', datos.totalCxC, '$');
          formatearYMostrar('cuentasPorPagar2', datos.totalCxP, '$');
          formatearYMostrar('gastos2', datos.totalGastos, '$');
        } else {
          console.error("No se encontraron datos en el array 'data'.");
        }

        const fechaISO = data[0].fechaMasRecienteMes; // "2025-01-30"
        const partes = fechaISO.split("-"); // [ "2025", "01", "30" ]
        const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`; // "30/01/2025"
        
        //document.getElementById('fechaReciente2').innerHTML = fechaFormateada;
        

    })
    .catch(error => console.error("Error al cargar los datos:", error));
}