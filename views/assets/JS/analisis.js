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

function mostrarTop1(data){

    document.getElementById('top1').innerHTML = "";

    //Mapear en un select
    data.forEach(function(data) {
        
        let montoFormateado = Number(data.totalCantidadVendida).toLocaleString("es-MX");
    
        let HTML = `
        <tr>
            <td>${data.nombreArticulo}</td>
            <td>${montoFormateado}</td>
        </tr>
        `;
    
        //Mapear valor por cada elemento en la consulta 
        document.getElementById('top1').innerHTML += HTML;
    });
}

function mostrarTop2(data){

    document.getElementById('top2').innerHTML = "";

    //Mapear en un select
    data.forEach(function(data) {

        let montoFormateado = Number(data.totalOrdenesCompra).toLocaleString("es-MX");
        
        let HTML = `
        <tr>
            <td>${data.nombreSocio}</td>
            <td>${montoFormateado}</td>
        </tr>
        `;
    
        //Mapear valor por cada elemento en la consulta 
        document.getElementById('top2').innerHTML += HTML;
    });
}

function mostrarTop3(data){

    document.getElementById('top3').innerHTML = "";

    //Mapear en un select
    data.forEach(function(data) {
        
        let montoFormateado = Number(data.monto).toLocaleString("es-MX");

        let HTML = `
        <tr>
            <td>${data.nombreArticulo}</td>
            <td>${data.nombreSocio}</td>
            <td>$${montoFormateado}</td>
        </tr>
        `;
    
        //Mapear valor por cada elemento en la consulta 
        document.getElementById('top3').innerHTML += HTML;
    });
}

function mostrarTop4(data){

    document.getElementById('top4').innerHTML = "";

    //Mapear en un select
    data.forEach(function(data) {
        
    
        let HTML = `
        <tr>
            <td>${data.nombreArticulo}</td>
            <td>${data.totalCantidadVendida}</td>
        </tr>
        `;
    
        //Mapear valor por cada elemento en la consulta 
        document.getElementById('top4').innerHTML += HTML;
    });
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

            toastr.error('El servidor no pudo obtener la informacion', 'Error inesperado', {"closeButton": true,});

            return;
        
        }

        const data = await response.json();

        document.getElementById('servicio').innerHTML = "";

        data.forEach(function(data) {
            let HTML = `
                <tr>
                    <td>${data.nombreSocio}</td>
                    <td>${data.numeroOrdenCompra}</td>
                    <td>${data.porcentajePromedioServicio}</td>
                </tr>
            `;
            document.getElementById('servicio').innerHTML += HTML;
        });

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de metricas no se pudo conectar', 'Error', {"closeButton": true,});
    }
}
