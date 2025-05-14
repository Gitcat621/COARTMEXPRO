$(document).ready(function () {


    
});


//Funcion para obtener meses marcados en las casillas
document.getElementById('filtro').addEventListener('click', () => {

    var month1 = document.getElementById('month1').value;
    var month2 = document.getElementById('month2').value;

    if(month1 == "" || month2 == ""){

        toastr.warning(`No hay meses seleccionados`, 'Filtro', {
            "closeButton": true,
        });
        return;
    }

    var year = document.getElementById('datepicker').value;
    if(year == ""){
         toastr.warning(`No hay año seleccionado`, 'Filtro', {
            "closeButton": true,
        });
        return;
    }

    let meses1 = [];
    meses1.push(month1);

    let meses2 = [];
    meses2.push(month2);


    cargarMetricas(meses1, 'year1', '1');
    cargarMetricas(meses2, 'year2', '2');

});

let metricasYear1 = null;
let metricasYear2 = null;


async function cargarMetricas(meses, yearId, prefix) {

    const year = document.getElementById('datepicker').value;
    const params = new URLSearchParams();

    meses.forEach((mes) => params.append("items[]", mes));
    params.append("year", year);
    

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/resumenes?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        console.log(data);

        data.forEach(obj => {
            Object.keys(obj).forEach(key => {
                if (obj[key] === null) {
                    obj[key] = 0;
                }
            });
        });

        const datos = data[0];
        // Guardar en la variable correspondiente
        if (prefix === '1') {
            metricasYear1 = datos;
        } else if (prefix === '2') {
            metricasYear2 = datos;
        }

        // Comparar si ambas están listas
        if (metricasYear1 && metricasYear2) {
            compararMetricas(metricasYear1, metricasYear2);
        }

        const formateador = new Intl.NumberFormat('es-MX');

        function formatearYMostrar(idElemento, valor, prefijo = '') {
            document.getElementById(idElemento).innerHTML = prefijo + formateador.format(valor);
        }

        if (data && data.length > 0) {
            const datos = data[0];

            formatearYMostrar(`ingresos${prefix}`, datos.totalIngresos, '$');
            formatearYMostrar(`efectivoUtilizado${prefix}`, datos.totalEgresos, '$');
            formatearYMostrar(`flujoRemanente${prefix}`, datos.efectivoRestante, '$');
            formatearYMostrar(`ventas${prefix}`, datos.totalVenta, '$');

            const crecimiento = Math.round(datos.porcentajeCrecimiento * 10) / 10;
            document.getElementById(`crecimientos${prefix}`).innerHTML = crecimiento + "%";

            formatearYMostrar(`articulos${prefix}`, datos.existencias);
            formatearYMostrar(`compras${prefix}`, datos.totalComprasMercancia, '$');
            formatearYMostrar(`socios${prefix}`, datos.sociosNegociados);
            formatearYMostrar(`articulosVendidos${prefix}`, datos.articulosVendidos);
            formatearYMostrar(`inventarios${prefix}`, datos.valorInventario, '$');
            formatearYMostrar(`cuentasPorCobrar${prefix}`, datos.totalCxC, '$');
            formatearYMostrar(`cuentasPorPagar${prefix}`, datos.totalCxP, '$');
            formatearYMostrar(`gastos${prefix}`, datos.totalGastos, '$');

            mes = meses[0] - 1;

            // Definir los nombres abreviados de los meses
            const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

            // Convertir el número del mes en su abreviación
            let mesAbreviado = nombresMeses[mes];


            // Obtener todos los elementos con la clase "fecha"
            if (prefix === '1') {
                elementos = document.querySelectorAll(".mes1");
                document.getElementById("lastYear1").textContent = mesAbreviado + " "+ (year - 1)
            } else if (prefix === '2') {
                elementos = document.querySelectorAll(".mes2");
                document.getElementById("lastYear2").textContent = mesAbreviado + " "+ (year - 1)
            }

            
            // Asignar la fecha a cada elemento
            elementos.forEach(elemento => {
                elemento.textContent = mesAbreviado + " "+ year;
            });

           
        } else {
            console.error("No se encontraron datos en el array 'data'.");
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

const campoHtmlId = {
  totalVenta: "Ventas",
  porcentajeCrecimiento: "Crecimientos",
  totalIngresos: "Ingresos",
  totalEgresos: "EfectivoUtilizado",
  efectivoRestante: "FlujoRemanente",

  valorInventario: "Inventarios",
  totalCxC: "CuentasPorCobrar",
  totalCxP: "CuentasPorPagar",
  totalGastos: "Gastos",
  existencias: "Articulos",
  totalComprasMercancia: "Compras",
  sociosNegociados: "Socios",
  articulosVendidos: "ArticulosVendidos"
};


function compararMetricas(año1, año2) {
 
  const formateador = new Intl.NumberFormat('es-MX');

  Object.entries(campoHtmlId).forEach(([campo, idBase]) => {
    const val1 = Number(año1[campo]) || 0;
    const val2 = Number(año2[campo]) || 0;
    const diferencia = val2 - val1;
    const porcentaje = val1 !== 0 ? ((diferencia / val1) * 100) : null;



    // Actualizar HTML
    const absElem = document.getElementById(`diferenciaAbsoluta${idBase}`);
    const pctElem = document.getElementById(`diferenciaPorcentual${idBase}`);

    if (absElem) {
      absElem.innerText = isNaN(diferencia) ? "+/-%" : formateador.format(diferencia);
    }

    if (pctElem) {
      pctElem.innerText = porcentaje === null ? "+/-%" : porcentaje.toFixed(2) + "%";
    }
  });
}
