$(document).ready(function () {

    // Llamar a la función para renderizar la gráfica con los datos
    cargarGrafica(MorrisChart);
    
});

function cargarGrafica(MorrisChart) {

    Morris.Bar({
        element: 'bar-morris-chart', // ID del div donde se renderizará la gráfica
        behaveLikeLine: true, // Se comporta como un área apilada
        data: MorrisChart.bar.data, // Datos dinámicos pasados a la gráfica
        barColors: [
            '#fcb03b',
            '#ea65a2',
            '#566FC9'
        ],
        xkey: 'x', // Clave para el eje X
        ykeys: ['y', 'z','a'], // Claves para el eje Y
        labels: ['Series A', 'Series B','Series C'], // Etiqueta de la serie de datos
        resize: true // Permite que la gráfica sea responsiva
    });

    new Morris.Bar({
        element: 'stack-morris-chart',
        behaveLikeLine: true,
        data: MorrisChart.stack.data,
        xkey: 'x',
        ykeys: ['y', 'z'],
        labels: ['Series A', 'Series B'],
        stacked: true,
        barColors: [
            '#ea65a2',
            '#566FC9'
        ],
        resize: true // Permite que la gráfica sea responsiva
    });


}




MorrisChart = {
    bar : {
        graph : null,
        data: [
            {x: 'Enero', y: 10, z: 17, a: 9},
            {x: 'Febrero', y: 5, z: 14, a: 13},
            {x: 'Marzo', y: 5, z: 13, a: 12},
            {x: 'Abril', y: 6, z: 12, a: 5},
            {x: 'Mayo', y: 17, z: 8, a: 8},
            {x: 'Junio', y: 10, z: 14, a: 18},
            {x: 'Julio', y: 8, z: 17, a: 14},
            {x: 'Agosto', y: 1, z: 20, a: 21},
            {x: 'Septiembre', y: 2, z: 15, a: 7},
            {x: 'Octubre', y: 12, z: 11, a: 22},
            {x: 'Noviembre', y: 16, z: 2, a: 8},
            {x: 'Diciembre', y: 1, z: 10, a: 22},
        ],
    },
    stack : {
        graph : null,
        data: [
            {x: '2010', y: 10, z: 17},
            {x: '2011', y: 5, z: 14},
            {x: '2012', y: 5, z: 13},
            {x: '2013', y: 6, z: 12},
            {x: '2014', y: 17, z: 8},
            {x: '2015', y: 10, z: 14},
            {x: '2016', y: 8, z: 17}
        ],
        init : function(){
            Morris.Bar({
                element: 'stack-morris-chart',
                behaveLikeLine: true,
                data: MorrisChart.stack.data,
                xkey: 'x',
                ykeys: ['y', 'z'],
                labels: ['Series A', 'Series B'],
                stacked: true,
                barColors: [
                    '#ea65a2',
                    '#566FC9'
                ],
            });
            return false;
        },
        update: function(){
            MorrisChart.stack.graph.setData(MorrisChart.stack.data);
            return false;
        }
    },
}
