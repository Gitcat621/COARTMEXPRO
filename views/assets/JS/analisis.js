$(document).ready(function () {

    const year = new Date().getFullYear();

    document.getElementById("currentYear").textContent = year;
    document.getElementById("lastYear").textContent = year - 1;
    
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
document.getElementById('meses').addEventListener('click', () => {

    const checkboxes = document.querySelectorAll('.checkbox input[type="checkbox"]');


    let mesesSeleccionados = [];


    checkboxes.forEach(checkbox => {

        if (checkbox.checked && checkbox.value !== "all") {


            mesesSeleccionados.push(checkbox.value);

        }

    });
    
    if(mesesSeleccionados.length === 0){

        //console.log('No hay meses')
        toastr.warning(`No hay meses seleccionados`, 'meses', {
            "closeButton": true,
        });
        return;

    }

    cargarMetricas(mesesSeleccionados);
    cargarTops(mesesSeleccionados);
    cargarMetricasServicio(mesesSeleccionados);

});


//Carga de analisis
async function cargarMetricas(meses) {

    try {

        const year = new Date().getFullYear();

        const params = new URLSearchParams();
        meses.forEach(mes => params.append("items[]", mes));

        const response = await fetch(`http://127.0.0.1:5000/coartmex/resumenes?${params.toString()}&year=${year}`);
        const rawData = await response.json();

        if (response.status === 500) {

            toastr.error('El servidor no pudo obtener la informacion', 'Error inesperado', {"closeButton": true,});

            return;
        
        }


        if (rawData && rawData.length > 0) {


            const dataLimpia = limpiarDatos(rawData);


            mostrarDatosEnPantalla(dataLimpia[0]);

        }
        
        

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de analisis no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

function limpiarDatos(data) {
    return data.map(obj => {
        const nuevo = { ...obj };
        Object.keys(nuevo).forEach(key => {
            if (nuevo[key] === null) {
                nuevo[key] = 0;
            }
        });
        return nuevo;
    });
}

function mostrarDatosEnPantalla(datos) {

    const formateador = new Intl.NumberFormat('es-MX');
    
    const formatearYMostrar = (id, valor, prefijo = '') => {

        document.getElementById(id).innerHTML = prefijo + formateador.format(valor);

    };

    formatearYMostrar('ingresos', datos.totalIngresos, '$');

    formatearYMostrar('efectivoUtilizado', datos.totalEgresos, '$');

    formatearYMostrar('flujoRemanente', datos.efectivoRestante, '$');

    formatearYMostrar('ventas', datos.totalVenta, '$');

    document.getElementById('crecimientos').innerHTML = (Math.round(datos.porcentajeCrecimiento * 10) / 10) + "%";

    formatearYMostrar('articulos', datos.existencias);

    formatearYMostrar('compras', datos.totalComprasMercancia, '$');

    formatearYMostrar('socios', datos.sociosNegociados);

    formatearYMostrar('articulosVendidos', datos.articulosVendidos);

    formatearYMostrar('inventarios', datos.valorInventario, '$');

    formatearYMostrar('cuentasPorCobrar', datos.totalCxC, '$');

    formatearYMostrar('cuentasPorPagar', datos.totalCxP, '$');
    
    formatearYMostrar('gastos', datos.totalGastos, '$');

    const [año, mes, dia] = datos.fechaMasRecienteMes.split("-");
    document.getElementById('fechaReciente').innerHTML = `${dia}/${mes}/${año}`;
}

//Carrga de tops
async function cargarTops(meses) {

    const params = new URLSearchParams();
    meses.forEach((mes) => params.append("items[]", mes));

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/tops?${params.toString()}`);
        const data = await response.json();


        if (response.status === 500) {

            toastr.error('El servidor no pudo obtener la informacion', 'Error inesperado', {"closeButton": true,});

            return;
        
        }

        mostrarTop1(data.top1);
        mostrarTop2(data.top2);
        mostrarTop3(data.top3);

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de tops no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

function toggleTabla() {
    let contenedor = document.getElementById('contenedor-tabla');
    if (contenedor.style.display === "block") {
        contenedor.style.display = "none";
    } else {
        contenedor.style.display = "block";
    }

    let btn = document.getElementById('cerrar2');
    if (btn.style.display === "block") {
        btn.style.display = "none";
    } else {
        btn.style.display = "block";
    }
}

// Función para llenar la tabla con los datos
function mostrarTop1(data) {
    let tabla = document.getElementById('top1');
    tabla.innerHTML = "";

    let totalCantidad = 0;

    // Mapear los datos a la tabla y acumular el total
    data.forEach(function(item) {
        let montoFormateado = Number(item.totalCantidadVendida).toLocaleString("es-MX");

        let filaHTML = `
        <tr>
            <td>${item.nombreArticulo}</td>
            <td>${montoFormateado}</td>
        </tr>
        `;

        tabla.innerHTML += filaHTML;
        totalCantidad += Number(item.totalCantidadVendida);
    });

    // Agregar fila con el total al final
    let totalFormateado = totalCantidad.toLocaleString("es-MX");
    let filaTotalHTML = `
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalFormateado}</strong></td>
    </tr>
    `;
    
    tabla.innerHTML += filaTotalHTML;
}


function mostrarTop2(data) {
    let tabla = document.getElementById('top2');
    tabla.innerHTML = "";

    let totalOrdenes = 0;

    // Mapear los datos a la tabla y acumular el total
    data.forEach(function(item) {
        let montoFormateado = Number(item.totalOrdenesCompra).toLocaleString("es-MX");

        let filaHTML = `
        <tr>
            <td>${item.nombreGrupoSocio}</td>
            <td>${montoFormateado}</td>
        </tr>
        `;

        tabla.innerHTML += filaHTML;

        totalOrdenes += Number(item.totalOrdenesCompra);
    });

    // Agregar fila con el total al final
    let totalFormateado = totalOrdenes.toLocaleString("es-MX");
    let filaTotalHTML = `
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalFormateado}</strong></td>
    </tr>
    `;
    
    tabla.innerHTML += filaTotalHTML;
}


function mostrarTop3(data) {
    let tabla = document.getElementById('top3');
    tabla.innerHTML = "";

    let totalMonto = 0;

    // Mapear los datos a la tabla y acumular el total
    data.forEach(function(item) {
        let montoFormateado = Number(item.totalCantidadVendida).toLocaleString("es-MX");

        let filaHTML = `
        <tr>
            <td>${item.nombreGrupoSocio}</td>
            <td>${montoFormateado}</td>
        </tr>
        `;

        tabla.innerHTML += filaHTML;

        totalMonto += Number(item.totalCantidadVendida);
    });

    // Agregar fila con el total al final
    let totalFormateado = totalMonto.toLocaleString("es-MX");
    let filaTotalHTML = `
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalFormateado}</strong></td>
    </tr>
    `;

    tabla.innerHTML += filaTotalHTML;
}


//Cargar metricas
async function cargarMetricasServicio(meses) {

    const year = new Date().getFullYear();

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
        mostrarSociosEnVentas(data.sociosEnVentas);
        

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de métricas no se pudo concretar', 'Error', {"closeButton": true});
    }
}



function mostrarServicio(data) {
    const tabla = document.getElementById('servicio');
    tabla.innerHTML = "";

    // Agrupar por grupo
    const grupos = {};
    let totalOrdenadas = 0;
    let totalVendidas = 0;
    let totalPorcentaje = 0;
    const ordenesUnicas = new Set();

    data.forEach(item => {
        const grupo = item.nombreGrupoSocio;
        if (!grupos[grupo]) grupos[grupo] = { registros: [], ordenesUnicas: new Set() };
        grupos[grupo].registros.push(item);
        grupos[grupo].ordenesUnicas.add(item.numeroOrdenCompra);
        ordenesUnicas.add(`${item.nombreGrupoSocio}::${item.numeroOrdenCompra}`);

    });

    let index = 0;
    let htmlBuffer = "";

    Object.entries(grupos).forEach(([grupoNombre, { registros, ordenesUnicas }]) => {
        const grupoClase = `grupo${index}`;
        let totalGrupoOrdenadas = 0;
        let totalGrupoVendidas = 0;
        let totalGrupoPorcentaje = 0;

        htmlBuffer += `
            <tr data-toggle="collapse" data-target=".${grupoClase}" class="clickable" style="cursor:pointer; background-color: #f0f0f0; font-weight:bold;">
                <td colspan="5">${grupoNombre}</td>
            </tr>
        `;

        registros.forEach(item => {
            const porcentaje = parseFloat(item.porcentajePromedioServicio);
            const ordenadas = parseInt(item.cantidadOrdenada);
            const vendidas = parseInt(item.cantidadVendida);
            const oc = item.numeroOrdenCompra;

            htmlBuffer += `
                <tr class="collapse ${grupoClase}">
                    <td>${item.nombreSocio}<br><small>${item.codigoArticulo} - ${item.nombreArticulo}</small></td>
                    <td class="text-center">${ordenadas}</td>
                    <td class="text-center">${vendidas}</td>
                    <td class="text-center">${oc}</td>
                    <td class="text-center">${porcentaje.toFixed(2)}%</td>
                </tr>
            `;

            totalGrupoOrdenadas += ordenadas;
            totalGrupoVendidas += vendidas;
            totalGrupoPorcentaje += porcentaje;

            totalOrdenadas += ordenadas;
            totalVendidas += vendidas;
            totalPorcentaje += porcentaje;
        });

        const promedioGrupo = (totalGrupoPorcentaje / registros.length).toFixed(2);

        totalGrupoOrdenadas = Number(totalGrupoOrdenadas).toLocaleString("es-MX");
        totalGrupoVendidas = Number(totalGrupoVendidas).toLocaleString("es-MX");

        htmlBuffer += `
            <tr class="collapse ${grupoClase}" style="font-weight: bold;">
                <td>Totales del grupo</td>
                <td class="text-center">${totalGrupoOrdenadas}</td>
                <td class="text-center">${totalGrupoVendidas}</td>
                <td class="text-center">${ordenesUnicas.size}</td>
                <td class="text-center">${promedioGrupo}%</td>
            </tr>
        `;

        index++;
    });

    const promedioTotal = (totalPorcentaje / data.length).toFixed(2);
    totalOrdenadas = Number(totalOrdenadas).toLocaleString("es-MX");
    totalVendidas = Number(totalVendidas).toLocaleString("es-MX");
    

    htmlBuffer += `
        <tr style="background-color: #e0e0e0; font-weight: bold;">
            <td>Total general</td>
            <td class="text-center">${totalOrdenadas}</td>
            <td class="text-center">${totalVendidas}</td>
            <td class="text-center">${ordenesUnicas.size}</td>
            <td class="text-center">${promedioTotal}%</td>
        </tr>
    `;

    tabla.innerHTML = htmlBuffer;
}

// Función para generar ambas tablas
function mostrarSociosEnVentas(data) {
    
      
    // 1. Agrupar por grupo
    const grupos = {};
    let totalGeneral = 0;
    
    data.forEach(item => {
    const grupo = item.nombreGrupoSocio;
    const venta = parseFloat(item.totalVenta);
    if (!grupos[grupo]) grupos[grupo] = [];
    grupos[grupo].push({ socio: item.nombreSocio, venta });
    totalGeneral += venta;
    });
    
    // 2. Renderizar tabla
    const tbody = document.getElementById("sociosEnVentas");
    tbody.innerHTML = "";

    // Convertimos el objeto `grupos` en un array y le sumamos total por grupo
    const gruposOrdenados = Object.entries(grupos).map(([grupoNombre, socios]) => {
        const totalGrupo = socios.reduce((acc, s) => acc + s.venta, 0);
        return { grupoNombre, socios, totalGrupo };
    });
    
    // Ordenamos de mayor a menor por totalGrupo
    gruposOrdenados.sort((a, b) => b.totalGrupo - a.totalGrupo);
  
    
    gruposOrdenados.forEach((grupo, index) => {
        const grupoClase = `grupo${index}`;
        const porcentajeGrupo = ((grupo.totalGrupo / totalGeneral) * 100).toFixed(2);
      
        // Fila principal del grupo
        tbody.innerHTML += `
          <tr data-toggle="collapse" data-target=".${grupoClase}" class="desplegable bg-grey">
            <td class="text-center font-weight-bold">${grupo.grupoNombre}</td>
            <td class="text-center">${grupo.totalGrupo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
            <td class="text-center">${porcentajeGrupo}%</td>
          </tr>
        `;
      
        // Filas hijas (socios)
        grupo.socios.forEach(socio => {
          const porcentajeTiendaGlobal = ((socio.venta / totalGeneral) * 100).toFixed(2);
      
          tbody.innerHTML += `
            <tr class="collapse ${grupoClase}">
              <td class="text-center">${socio.socio}</td>
              <td class="text-center">${socio.venta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
              <td class="text-center">${porcentajeTiendaGlobal}%</td>
            </tr>
          `;
        });
      });
      
      
    // Fila total al final de la tabla
    tbody.innerHTML += `
    <tr style="font-weight: bold;">
    <td class="text-center">Total</td>
    <td class="text-center">${totalGeneral.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    })}</td>
    <td class="text-center">100%</td>
    </tr>
    `;

      
      
      
}

//Funciones para POPUP
const trigger = document.getElementById('clientes');
const popup = document.getElementById('popup');
const popupCard = document.getElementById('popupCard');
const closeBtn = document.getElementById('closePopup');

trigger.addEventListener('click', () => {
    popup.style.display = 'block';

    const rect = trigger.getBoundingClientRect();

    // Posición en pantalla
    popupCard.style.top = `${rect.bottom + window.scrollY - 15}px`;
    popupCard.style.left = `${rect.left + window.scrollX}px`;
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
    popup.style.display = 'none';
    }
});