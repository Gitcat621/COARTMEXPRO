$(document).ready(function () {

    gruposSocios();
    
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

    meses = obtenerMeses();

    if(meses.length === 0){

        //console.log('No hay meses')
        toastr.warning(`No hay meses seleccionados`, 'meses', {
            "closeButton": true,
        });
        return;

    }
    
    grupo = document.getElementById('grupoSocio_menu').value;
    
    cargarGraficas(meses,grupo);

});

async function gruposSocios() {

    try {

        const response = await fetch(`http://127.0.0.1:5000/coartmex/gruposSocio`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if(!response.ok){

            if (response.status === 500) {

                toastr.error('El servidor no pudo obtener la informacion', 'Error inesperado', {"closeButton": true,});
            }

            throw new Error('Hubo un problema al enviar la solicitud');
        }

        toastr.success('Se han obtenido los datos: Grupos socios', 'Api consumida', {"closeButton": true,});

        const select = document.getElementById('grupoSocio_menu');
        select.innerHTML = ""; // Limpiar contenido previo

        option = document.createElement('option');
        option.value = '0';
        option.textContent = 'GENERAL';
        option.selected = true;
        select.appendChild(option);

        data.forEach(grupos => {

            let option = document.createElement('option');
            option.value = grupos.pkGrupoSocio;
            option.textContent = grupos.nombreGrupoSocio;
            select.appendChild(option);

        });

    } catch (error) {

        toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});

    }

}

function obtenerMeses(){

    const checkboxes = document.querySelectorAll('.checkbox input[type="checkbox"]');


    let mesesSeleccionados = [];


    checkboxes.forEach(checkbox => {

        if (checkbox.checked && checkbox.value !== "all") {


            mesesSeleccionados.push(checkbox.value);

        }
    });
    

    return mesesSeleccionados;
}


//Cargar graficas
async function cargarGraficas(meses, grupo) {

    const params = new URLSearchParams();
    meses.forEach((mes) => params.append("items[]", mes));

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/graficas?${params.toString()}&grupo=${grupo}`);
        const data = await response.json();


        if (response.status === 500) {

            toastr.error('El servidor no pudo obtener la informacion', 'Error inesperado', {"closeButton": true,});

            return;
        
        }

        mostrarGrafica1(data.grafica1);
        mostrarGrafica2(data.grafica2);
        mostrarGrafica3(data.grafica3);
        

    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición de tops no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

function mostrarGrafica1(data) {


    if (!data || data.length === 0) {
        $('#bar-morris-chart').html("<p>No hay datos para mostrar.</p>");
        $('#donut-morris-chart').html("<p>No hay datos para mostrar.</p>");
        return;
    }

    $('#bar-morris-chart').empty(); // Elimina el gráfico anterior

    let dataMorris = data.map(item => ({
        y: item.nombreSocio,
        a: parseInt(item.monto) // Convertir monto a número
    }));

    new Morris.Bar({
        element: 'bar-morris-chart',
        data: dataMorris,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Ventas'],
        barColors: ['#3498db'],
        resize: true
    });

    $('#donut-morris-chart').empty(); // Elimina el gráfico anterior

    let datosTransformados = calcularPorcentajes(data);

    new Morris.Donut({
        element: 'donut-morris-chart',
        data: datosTransformados,
        colors: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71'],
        resize: true,
        formatter: y => `${y}%`
    });
}

function mostrarGrafica2(data){

    $('#stack-morris-chart').empty(); // Elimina el gráfico anterior


    let datosTransformados = transformarDatosParaStacked(data);

    new Morris.Bar({
        element: 'stack-morris-chart',
        data: datosTransformados,
        xkey: 'mes',
        ykeys: ['7 ELEVEN', 'GAP', 'HOTELES', 'MORPHO', 'SOLUCIONES SENCILLAS'], // Claves dinámicas
        labels: ['7 ELEVEN', 'GAP', 'HOTELES', 'MORPHO', 'SOLUCIONES SENCILLAS'],
        stacked: true, // Habilitar apilado
        barColors: [
            '#fcb03b',
            '#ea65a2',
            '#566FC9',
            '#5996a8',
            '#70e0a1',
            '#6b203c',
            '#067a40',
        ], // Colores de cada grupo
        resize: true
    });

    $('#donut-morris-chart-month').empty(); // Elimina el gráfico anterior

    let datosGrafica = calcularPorcentajeMeses(datosTransformados);

    new Morris.Donut({
        element: 'donut-morris-chart-month',
        data: datosGrafica,
        colors: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
        formatter: function (y) { return y + "%"; } // Mostrar % en el tooltip
    });

}

function mostrarGrafica3(data){

    $('#area-morris-chart').empty(); // Elimina el gráfico anterior

    // Mapeamos los datos para que puedan ser utilizados en la gráfica de Morris
    const mappedData = data.map(item => ({
        label: item.nombreArticulo,
        value: parseInt(item.totalPiezasVendidas)
    }));

    new Morris.Area({
        element: 'area-morris-chart',
        data: mappedData,
        xkey: 'label', // El eje X son los nombres de los artículos
        ykeys: ['value'], // El eje Y son las piezas vendidas
        labels: ['Piezas Vendidas'], // El nombre de la serie
        lineColors: ['#0b62a4'], // Color de la línea del área
        fillOpacity: 0.6, // Opacidad de la zona del área
        parseTime: false, // No necesitamos formateo de tiempo en este caso
        behaveLikeLine: true, // Para que la gráfica se comporte más como una gráfica de líneas
        hoverCallback: function (index, options, content, row) {
            // Personalizar el contenido del hover
            return "<b>" + row.label + "</b><br>Piezas Vendidas: " + row.value;
        },
        resize: true
        });
}


//Transformar datos
function transformarDatosParaStacked(data) {
    let resultado = {};

    data.forEach(item => {
        let mesNombre = obtenerNombreMes(item.mes); // Convertir número de mes a nombre
        if (!resultado[mesNombre]) {
            resultado[mesNombre] = { mes: mesNombre }; // Inicializar objeto
        }
        resultado[mesNombre][item.nombreGrupoSocio] = parseInt(item.totalMonto, 10);
    });

    return Object.values(resultado); // Convertir objeto en array
}

function obtenerNombreMes(numeroMes) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[numeroMes - 1];
}

function calcularPorcentajes(data) {
    // Convertir montos a números y sumar el total
    let totalMonto = data.reduce((total, item) => total + parseInt(item.monto, 10), 0);

    // Calcular porcentaje y formatear datos para Morris.js
    return data.map(item => ({
        label: item.nombreSocio,
        value: ((parseInt(item.monto, 10) / totalMonto) * 100).toFixed(2) // Porcentaje con 2 decimales
    }));
}

function calcularPorcentajeMeses(data) {
    let totalGlobal = 0;
    let mesesTotales = [];

    // 1️⃣ Sumar el total de todos los meses
    data.forEach(mesData => {
        let totalMes = Object.keys(mesData)
            .filter(key => key !== "mes") // Excluir el nombre del mes
            .reduce((sum, key) => sum + mesData[key], 0); // Sumar valores del mes

        mesesTotales.push({ mes: mesData.mes, totalMes });
        totalGlobal += totalMes;
    });

    // 2️⃣ Calcular el porcentaje de cada mes
    return mesesTotales.map(mes => ({
        label: mes.mes,
        value: ((mes.totalMes / totalGlobal) * 100).toFixed(2) // Convertir a porcentaje
    }));
}

