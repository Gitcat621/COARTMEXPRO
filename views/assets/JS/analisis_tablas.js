$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'Admon. Contable y Fiscal' && sessionStorage.getItem("departamento") !== 'Dirección general') {
        //window.location.href = './index.html';
        //toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    gruposSocios();

});


// Escuchar el cambio de fecha
$('#datepicker').on('changeDate', function (e) {
    const anio = e.format(); // devuelve el año seleccionado
    console.log("Año seleccionado:", anio);

});


async function gruposSocios() {

    try {

        const response = await fetch(`http://127.0.0.1:5000/coartmex/gruposSocio`, {
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

        actualizarLista('gruposIngresos', 'ingresos', data);
        actualizarLista('gruposVentas', 'ventas', data);

    } catch (error) {

        toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});

    }

}

//Asigna los socios a las listas
function actualizarLista(idElemento, tipo, data) {

    const contenedor = document.getElementById(idElemento);


    contenedor.innerHTML = data.map(grupo =>
        `<li><a href="#" onclick="cargarTablas('${tipo}', ${grupo.pkGrupoSocio})">${grupo.nombreGrupoSocio}</a></li>`
    ).join('');

    contenedor.innerHTML += `
        <li role="separator" class="divider"></li>
        <li><a href="#" onclick="cargarTablas('${tipo}', 0)">GENERAL</a></li>
        <li><a href="#" onclick="cargarTablas('${tipo}', 621)">TOTAL POR SOCIOS</a></li>
    `;
}



//Hace las peticiones a las tablas
async function cargarTablas(endpoint, foreingKey, anio) {

    try {

        anio = document.getElementById('datepicker').value;

    } catch {

        anio = undefined;

    }

    if (!anio) {

        anio = new Date().getFullYear();

    }

    console.log(`Se envió la petición: ${endpoint} con llave foránea ${foreingKey} con fecha ${anio}`);

    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/${endpoint}?foreingKey=${foreingKey}&fecha=${anio}`, {
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

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
        $('#dataTable').empty(); // Limpia el contenido de la tabla
    }

    var elemento = document.getElementById('contenedorAnio');
    if (elemento.style.display === 'none') {
        elemento.style.display = 'block'
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
        case 'gastosFiltro':

            document.getElementById('tableTitle').innerHTML = "Gastos";

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

            var elemento = document.getElementById('contenedorMes');
            if (elemento.style.display === 'none') {
                elemento.style.display = 'block'
            }


            document.getElementById('tableTitle').innerHTML = "Inventario";


            // Código si expresion === valor3
            $('#dataTable').DataTable({
                scrollX: true, // Activa el scroll horizontal
                columns: [
                    { title: "Código de articulo" },
                    { title: "Descripción" },
                    { title: "Precio de almacen" },
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
            // Código si ninguno de los valores anteriores coincide
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
