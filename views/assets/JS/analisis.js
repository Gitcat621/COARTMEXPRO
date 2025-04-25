$(document).ready(function () {

    //cargarMetricas();

    const year = new Date().getFullYear();

    document.getElementById("currentYear").textContent = year;
    document.getElementById("lastYear").textContent = year - 1;

    if (sessionStorage.getItem("departamento") !== 'Admon. Contable y Fiscal' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    
});

const trigger = document.getElementById('clientes');
const trigger2 = document.getElementById('articulosVendidos');
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

trigger2.addEventListener('click', () => {
    popup.style.display = 'block';

    const rect = trigger2.getBoundingClientRect();

    // Posición en pantalla
    popupCard.style.top = `${rect.bottom + window.scrollY - 15}px`;
    popupCard.style.left = `${rect.left + window.scrollX - 130}px`;
});


closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
    popup.style.display = 'none';
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

        toastr.error('La petición de analisis no se pudo conectar', 'Error', {"closeButton": true,});
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
        mostrarTop4(data.top4);

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de tops no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

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
            <td>${item.nombreSocio}</td>
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
        let montoFormateado = Number(item.monto).toLocaleString("es-MX");

        let filaHTML = `
        <tr>
            <td>${item.nombreArticulo}</td>
            <td>${item.nombreSocio}</td>
            <td>$${montoFormateado}</td>
        </tr>
        `;

        tabla.innerHTML += filaHTML;

        totalMonto += Number(item.monto);
    });

    // Agregar fila con el total al final
    let totalFormateado = totalMonto.toLocaleString("es-MX");
    let filaTotalHTML = `
    <tr>
        <td colspan="2"><strong>Total</strong></td>
        <td><strong>$${totalFormateado}</strong></td>
    </tr>
    `;

    tabla.innerHTML += filaTotalHTML;
}


function mostrarTop4(data) {
    let tabla = document.getElementById('top4');
    tabla.innerHTML = "";

    let totalCantidad = 0;

    // Mapear los datos a la tabla y acumular el total
    data.forEach(function(item) {
        let filaHTML = `
        <tr>
            <td>${item.nombreArticulo}</td>
            <td>${item.totalCantidadVendida}</td>
        </tr>
        `;

        tabla.innerHTML += filaHTML;

        totalCantidad += Number(item.totalCantidadVendida);
    });

    // Agregar fila con el total al final
    let filaTotalHTML = `
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalCantidad}</strong></td>
    </tr>
    `;

    tabla.innerHTML += filaTotalHTML;
}

//Cargar metricas
async function cargarMetricasServicio(meses) {
    const params = new URLSearchParams();
    meses.forEach((mes) => params.append("items[]", mes));

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/servicio?${params.toString()}`, {
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
        let tabla = document.getElementById('servicio');
        tabla.innerHTML = "";

        let totalPorcentaje = 0;
        let cantidadElementos = data.length;

        data.forEach(function(item) {
            let porcentajeFormateado = Number(item.porcentajePromedioServicio).toFixed(2); // Limita a 2 decimales

            let filaHTML = `
                <tr>
                    <td>${item.nombreSocio}</td>
                    <td>${item.numeroOrdenCompra}</td>
                    <td>${porcentajeFormateado}%</td>
                </tr>
            `;

            tabla.innerHTML += filaHTML;
            totalPorcentaje += Number(item.porcentajePromedioServicio);
        });

        // Calcular el promedio de los porcentajes
        let promedioPorcentaje = (totalPorcentaje / cantidadElementos).toFixed(2);

        // Agregar fila con el promedio al final
        let filaTotalHTML = `
        <tr>
            <td colspan="2"><strong>Promedio</strong></td>
            <td><strong>${promedioPorcentaje}%</strong></td>
        </tr>
        `;

        tabla.innerHTML += filaTotalHTML;

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de métricas no se pudo conectar', 'Error', {"closeButton": true});
    }
}

