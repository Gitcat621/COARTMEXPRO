$(document).ready(function () {

    gruposSocios();

});

var seleccionado;

//Añade funcion a los botones por la clase del color (Actualizar si se cambia el color de los botones)
document.querySelectorAll('.btn-violet').forEach(button => {
    button.addEventListener('click', () => {

        cargarTablas(button.textContent);
        seleccionado = button.textContent;
        
    });
});

//Funcion para obtener meses marcados en las casillas
document.getElementById('busqueda').addEventListener('click', () => {

    //console.log("el seleccionado es: " + seleccionado);
    cargarTablas(seleccionado);

});

//Obtiene y mapea los grupos de socios
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

//Hace las peticiones a las tablas
async function cargarTablas(endpoint, grupo, anio, mes) {

    // Obtener valores de los inputs
    anio = document.getElementById('datepicker')?.value || '';
    mes = document.getElementById('datepicker2')?.value || '';

    // Convertir valores a números y validar
    anio = parseInt(anio, 10);
    mes = parseInt(mes, 10);

    // Si no se obtiene un año válido, usar el actual
    if (isNaN(anio)) {
        anio = new Date().getFullYear();
    }

    // Si no se obtiene un mes válido, usar el actual (sumando 1 porque `getMonth()` devuelve valores de 0 a 11)
    if (isNaN(mes) || mes < 1 || mes > 12) {
        mes = new Date().getMonth() + 1;
    }

    //Ajustar el endpoint respecto al boton seleccionado
    if(endpoint == "Ingresos" || endpoint == "Gastos" || endpoint == "Ventas"){
        endpoint = endpoint.charAt(0).toLowerCase() + endpoint.slice(1);
    }
    if(endpoint == "Inventario"){
        endpoint = "articulos"
    }
    if(endpoint == "CxC"){
        endpoint = "cuentasPorCobrar"
    }
    if(endpoint == "CxP"){
        endpoint = "cuentasPorPagar"
    }
    if(endpoint == "Compras de mercancía"){
        endpoint = "comprasMercancia"
    }

    //Validar el select a usar para el grupo
    ofGrupo = document.getElementById('contenedorGrupo');
    ofGasto = document.getElementById('contenedorGasto');

    if (ofGrupo.style.display === 'block') {

        grupo = document.getElementById('grupoSocio_menu').value;

    }else if(ofGasto.style.display === 'block'){

        grupo = document.getElementById('gasto_menu').value;

    }
    
    //console.log(`Endpoint: ${endpoint} / grupo: ${grupo} / mes: ${mes} / año: ${anio}`);

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/${endpoint}?grupo=${grupo}&year=${anio}&month=${mes}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {

            toastr.error('La petición de analisis no se pudo conectar', 'Error', {"closeButton": true,});
            throw new Error(`Error en la petición: ${response.status}`);

        }

        const data = await response.json();

        //console.log(data);

        inicializarTabla(data, endpoint);
        
    } catch (error) {

        console.error("Error al cargar los datos:", error);

        toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

//Arma las tablas
function inicializarTabla(data, endpoint){

    //SI YA EXISTE UNA TABLA, LIMPIARLA PARA ACTUALIZARLA
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
        $('#dataTable').empty(); // Limpia el contenido de la tabla
    }

    try{
        elemento = document.getElementById('contenedorGrupo');
        if (elemento.style.display === 'none') {
            elemento.style.display = 'block'
        }
        var elemento = document.getElementById('contenedorYear');
        if (elemento.style.display === 'none') {
            elemento.style.display = 'block'
        }
        elemento = document.getElementById('contenedorBoton');
        if (elemento.style.display === 'none') {
            elemento.style.display = 'block'
        }
        elemento = document.getElementById('contenedorGasto');
        if (elemento.style.display === 'block') {
            elemento.style.display = 'none'
        }
        var elemento = document.getElementById('contenedorMonth');
        if (elemento.style.display === 'block') {
            elemento.style.display = 'none'
        }
    }catch{
        toastr.error('Sucedio un error al cargar los elementos', 'Error', {"closeButton": true,});
    }

    switch (endpoint) {
        case 'ingresos':
            try{
                if(data[0].grupo !== undefined){
                    // Inicializar la DataTable y asignarla a una variable
                    let tabla = $('#dataTable').DataTable({
                        columns: [
                            { title: "Grupo" },
                            { title: "Monto" }
                        ],
                        "ordering": false,
                        footerCallback: function (row, data, start, end, display) {
                            let api = this.api();
    
                            // Calcular el total de la columna 'Monto'
                            let total = api.column(1).data().reduce((acc, value) => acc + parseFloat(value.replace(/[^0-9.-]+/g, "")), 0);
    
                            // Mostrar el total en el pie de la tabla
                            $(api.column(1).footer()).html(`Total: ${formatoMoneda(total)}`);
                        }
                    });
    
                    // Limpiar la tabla antes de agregar nuevos datos
                    tabla.clear().draw();
    
                    // Agregar los nuevos datos
                    tabla.rows.add(data.map(item => [
                        item.grupo ?? 'SIN SOCIO IDENTIFICADO',
                        formatoMoneda(item.totalFacturado)])).draw();
    
                    // Agregar manualmente la fila de total
                    let totalFacturado = data.reduce((sum, item) => sum + parseFloat(item.totalFacturado), 0);
                    tabla.row.add(["TOTAL GENERAL", formatoMoneda(totalFacturado)]).draw(false);
                    return;
                }
            }
            catch{

            }

            document.getElementById('tableTitle').innerHTML = "Ingresos";

            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Gasto" },
                    { title: "Ene" },
                    { title: "Feb" },
                    { title: "Mar" },
                    { title: "Abr" },
                    { title: "May" },
                    { title: "Jun" },
                    { title: "Jul" },
                    { title: "Ago" },
                    { title: "Sep" },
                    { title: "Oct" },
                    { title: "Nov" },
                    { title: "Dic" },
                    { title: "Total" }
                ],
                "ordering": false  // Desactiva el ordenamiento automático
            });

            //Iniciar la datatable y asignarla a una variable
            var tabla = $('#dataTable').DataTable();

            var totals = Array(12).fill(0); // Array para las sumas de cada mes
            var dataArray = Object.keys(data).map(motivo => {
                let valores = [
                    data[motivo]["Enero"] || 0,
                    data[motivo]["Febrero"] || 0,
                    data[motivo]["Marzo"] || 0,
                    data[motivo]["Abril"] || 0,
                    data[motivo]["Mayo"] || 0,
                    data[motivo]["Junio"] || 0,
                    data[motivo]["Julio"] || 0,
                    data[motivo]["Agosto"] || 0,
                    data[motivo]["Septiembre"] || 0,
                    data[motivo]["Octubre"] || 0,
                    data[motivo]["Noviembre"] || 0,
                    data[motivo]["Diciembre"] || 0
                ];
                

                // Sumar fila (Total por socio)
                let totalFila = valores.reduce((a, b) => a + b, 0);

                // Acumular sumas por mes
                valores.forEach((value, index) => totals[index] += value);

                return [motivo, ...valores.map(formatoMoneda), formatoMoneda(totalFila)];
            });


            // Agregar datos a la tabla
            tabla.rows.add(dataArray).draw();

            // Agregar la fila "Total General" con formato de moneda
            var totalGeneral = formatoMoneda(totals.reduce((a, b) => a + b, 0));
            tabla.row.add(["TOTAL GENERAL", ...totals.map(formatoMoneda), totalGeneral]).draw(false);

                
        break;
        case 'gastos':

            elemento = document.getElementById('contenedorGasto');
            if (elemento.style.display === 'none') {
                elemento.style.display = 'block'
            }
            var elemento = document.getElementById('contenedorGrupo');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }
            var elemento = document.getElementById('contenedorMonth');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }

            document.getElementById('tableTitle').innerHTML = "Gastos";

            console.log(data);

            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Concepto" },
                    { title: "Tipo" },
                    { title: "Ene" },
                    { title: "Feb" },
                    { title: "Mar" },
                    { title: "Abr" },
                    { title: "May" },
                    { title: "Jun" },
                    { title: "Jul" },
                    { title: "Ago" },
                    { title: "Sep" },
                    { title: "Oct" },
                    { title: "Nov" },
                    { title: "Dic" },
                    { title: "Total" }
                ],
                "ordering": false  // Desactiva el ordenamiento automático
            });
            
            var tabla = $('#dataTable').DataTable();
            var totals = Array(12).fill(0); // Array para las sumas de cada mes
            
            var dataArray = Object.keys(data).map(motivo => {
                let tipoGasto = data[motivo]?.tipoGasto || "Desconocido";
                let meses = data[motivo]?.meses || {};
            
                let valores = [
                    meses["Enero"] || 0,
                    meses["Febrero"] || 0,
                    meses["Marzo"] || 0,
                    meses["Abril"] || 0,
                    meses["Mayo"] || 0,
                    meses["Junio"] || 0,
                    meses["Julio"] || 0,
                    meses["Agosto"] || 0,
                    meses["Septiembre"] || 0,
                    meses["Octubre"] || 0,
                    meses["Noviembre"] || 0,
                    meses["Diciembre"] || 0
                ];
            
                let totalFila = valores.reduce((a, b) => a + b, 0);
                valores.forEach((value, index) => totals[index] += value);
            
                return [motivo, tipoGasto, ...valores.map(formatoMoneda), formatoMoneda(totalFila)];
            });
            
            // Agregar datos a la tabla
            tabla.rows.add(dataArray).draw();
            
            // Agregar la fila "TOTAL GENERAL"
            var totalGeneral = formatoMoneda(totals.reduce((a, b) => a + b, 0));
            tabla.row.add(["TOTAL GENERAL", "", ...totals.map(formatoMoneda), totalGeneral]).draw(false);
            


        break;
        case 'ventas':

            try{

                if(data[0].grupo !== undefined){
                    // Inicializar la DataTable y asignarla a una variable
                    let tabla = $('#dataTable').DataTable({
                        columns: [
                            { title: "Grupo" },
                            { title: "Monto" }
                        ],
                        "ordering": false,
                        footerCallback: function (row, data, start, end, display) {
                            let api = this.api();
    
                            // Calcular el total de la columna 'Monto'
                            let total = api.column(1).data().reduce((acc, value) => acc + parseFloat(value.replace(/[^0-9.-]+/g, "")), 0);
    
                            // Mostrar el total en el pie de la tabla
                            $(api.column(1).footer()).html(`Total: ${formatoMoneda(total)}`);
                        }
                    });
    
                    // Limpiar la tabla antes de agregar nuevos datos
                    tabla.clear().draw();
    
                    // Agregar los nuevos datos
                    tabla.rows.add(data.map(item => [item.grupo, formatoMoneda(item.totalVentas)])).draw();
    
                    // Agregar manualmente la fila de total
                    let totalVentas = data.reduce((sum, item) => sum + parseFloat(item.totalVentas), 0);
                    tabla.row.add(["TOTAL GENERAL", formatoMoneda(totalVentas)]).draw(false);
                    return;
                }
            }
            catch
            {
                console.log('No se pudo leer grupo')
            }
            
            document.getElementById('tableTitle').innerHTML = "Ventas";

                //Código si expresion === valor3
                $('#dataTable').DataTable({
                    scrollX: true, // Activa el scroll horizontal
                    columns: [
                        { title: "Socio comercial" },
                        { title: "Ene" },
                        { title: "Feb" },
                        { title: "Mar" },
                        { title: "Abr" },
                        { title: "May" },
                        { title: "Jun" },
                        { title: "Jul" },
                        { title: "Ago" },
                        { title: "Sep" },
                        { title: "Oct" },
                        { title: "Nov" },
                        { title: "Dic" },
                        { title: "Total" }
                    ],
                    "ordering": false  // Desactiva el ordenamiento automático
                });
    
                //Iniciar la datatable y asignarla a una variable
                var tabla = $('#dataTable').DataTable();
    
                var totals = Array(12).fill(0); // Array para las sumas de cada mes
                var dataArray = Object.keys(data).map(socio => {
                    let valores = [
                        data[socio]["Enero"] || 0,
                        data[socio]["Febrero"] || 0,
                        data[socio]["Marzo"] || 0,
                        data[socio]["Abril"] || 0,
                        data[socio]["Mayo"] || 0,
                        data[socio]["Junio"] || 0,
                        data[socio]["Julio"] || 0,
                        data[socio]["Agosto"] || 0,
                        data[socio]["Septiembre"] || 0,
                        data[socio]["Octubre"] || 0,
                        data[socio]["Noviembre"] || 0,
                        data[socio]["Diciembre"] || 0
                    ];
                    
    
                    // Sumar fila (Total por socio)
                    let totalFila = valores.reduce((a, b) => a + b, 0);
    
                    // Acumular sumas por mes
                    valores.forEach((value, index) => totals[index] += value);
    
                    return [socio, ...valores.map(formatoMoneda), formatoMoneda(totalFila)];
                });
    
    
                // Agregar datos a la tabla
                tabla.rows.add(dataArray).draw();
    
                // Agregar la fila "Total General" con formato de moneda
                var totalGeneral = formatoMoneda(totals.reduce((a, b) => a + b, 0));
                tabla.row.add(["TOTAL GENERAL", ...totals.map(formatoMoneda), totalGeneral]).draw(false);



        break;
        case 'articulos':

            
            elemento = document.getElementById('contenedorMonth');
            if (elemento.style.display === 'none') {
                elemento.style.display = 'block'
            }
            var elemento = document.getElementById('contenedorGrupo');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }
            


            document.getElementById('tableTitle').innerHTML = "Inventario";


            // Código si expresion === valor3
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Código de articulo" },
                    { title: "Descripción" },
                    { title: "Costo" },
                    { title: "Proveedor" },
                    { title: "Categoría" },
                ]
            });

            //Iniciar la datatable y asignarla a una variable
            var tabla = $('#dataTable').DataTable();

            // Agregar los nuevos datos
            tabla.rows.add(data.map((articulos) => [
                //    0                              1                      2                               3                                4                   5                               6                           
                articulos.codigoArticulo, articulos.nombreArticulo, '$' + articulos.precioAlmacen, articulos.nombreProveedor, articulos.nombreCategoriaArticulo, 
                articulos.fkProveedor, articulos.fkCategoriaArticulo

            ])).draw();

        break;
        case 'cuentasPorPagar':

            var elemento = document.getElementById('contenedorGrupo');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }

            document.getElementById('tableTitle').innerHTML = "Cuentas por pagar";


            // Código si expresion === valor3
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Proveedor" },
                    { title: "Folio de EL Eventa" },
                    { title: "Fecha" },
                    { title: "Monto" },
                ]
            });

            //Iniciar la datatable y asignarla a una variable
            var tabla = $('#dataTable').DataTable();

            // Agregar los nuevos datos
            tabla.rows.add(data.map((CxP) => [
                CxP.nombreProveedor, 
                CxP.folioELV, 
                formatoFecha(CxP.fechaMercancia), // Formatear la fecha antes de agregarla a la tabla
                formatoMoneda(CxP.pagoPendiente)
            ])).draw();


        break;
        case 'cuentasPorCobrar':

            document.getElementById('tableTitle').innerHTML = "Cuentas por cobrar";


            // Código si expresion === valor3
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Socio comercial" },
                    { title: "Fecha" },
                    { title: "Monto" },
                ]
            });

            //Iniciar la datatable y asignarla a una variable
            var tabla = $('#dataTable').DataTable();

            // Agregar los nuevos datos
            tabla.rows.add(data.map((CxC) => [                    
                CxC.nombreSocio ?? "SOCIO NO IDENTIFICADO",
               formatoFecha(CxC.fechaFactura), 
               formatoMoneda(CxC.totalFactura)

            ])).draw();


        break;
        case 'comprasMercancia':

            var elemento = document.getElementById('contenedorGrupo');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }

            document.getElementById('tableTitle').innerHTML = "Compras de mercancia";

            
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Gasto" },
                    { title: "Ene" },
                    { title: "Feb" },
                    { title: "Mar" },
                    { title: "Abr" },
                    { title: "May" },
                    { title: "Jun" },
                    { title: "Jul" },
                    { title: "Ago" },
                    { title: "Sep" },
                    { title: "Oct" },
                    { title: "Nov" },
                    { title: "Dic" },
                    { title: "Total" }
                ],
                "ordering": false  // Desactiva el ordenamiento automático
            });


            //Iniciar la datatable y asignarla a una variable
            var tabla = $('#dataTable').DataTable();


            var totals = Array(12).fill(0); // Array para las sumas de cada mes
            var dataArray = Object.keys(data).map(compra => {
                let valores = [
                    data[compra]["Enero"] || 0,
                    data[compra]["Febrero"] || 0,
                    data[compra]["Marzo"] || 0,
                    data[compra]["Abril"] || 0,
                    data[compra]["Mayo"] || 0,
                    data[compra]["Junio"] || 0,
                    data[compra]["Julio"] || 0,
                    data[compra]["Agosto"] || 0,
                    data[compra]["Septiembre"] || 0,
                    data[compra]["Octubre"] || 0,
                    data[compra]["Noviembre"] || 0,
                    data[compra]["Diciembre"] || 0
                ];
                

                // Sumar fila (Total por socio)
                let totalFila = valores.reduce((a, b) => a + b, 0);

                // Acumular sumas por mes
                valores.forEach((value, index) => totals[index] += value);

                return [compra, ...valores.map(formatoMoneda), formatoMoneda(totalFila)];
            });


            // Agregar datos a la tabla
            tabla.rows.add(dataArray).draw();

            // Agregar la fila "Total General" con formato de moneda
            var totalGeneral = formatoMoneda(totals.reduce((a, b) => a + b, 0));
            tabla.row.add(["TOTAL GENERAL", ...totals.map(formatoMoneda), totalGeneral]).draw(false);

        break;
        case 'facturas':

            var elemento = document.getElementById('contenedorGrupo');
            if (elemento.style.display === 'block') {
                elemento.style.display = 'none'
            }
        
            document.getElementById('tableTitle').innerHTML = "Facturas";
            // Código si expresion === valor3
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Numero de factura" },
                    { title: "Socio por cobrar" },
                    { title: "Fecha de factura" },
                    { title: "Monto" },
                    { title: "Fecha de pagado" },
                ]
            });

        break;
        default:
            //Si ninguno de los valores anteriores coincide
            toastr.warning('Se ha seleccionado una opción inexistente ¿Como lo hiciste?', 'Atención', {"closeButton": true,}); 
    }

}

//Transforma los datos
function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

function formatoFecha(fecha) {
    let fechaObj = new Date(fecha); // Convertir la cadena a objeto Date
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
