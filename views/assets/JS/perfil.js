$(document).ready(function () {

    // Recuperar en la nueva vista
    const params = new URLSearchParams(window.location.search);
    const numeroEmpleado = params.get("id");

    obtenerEmpleado(numeroEmpleado);

    obtenerCursosEmpleado(numeroEmpleado);
    obtenerPermisosEmpleado(numeroEmpleado);
    obtenerOportunidadesEmpleado(numeroEmpleado);
    obtenerPrestamosEmpleado(numeroEmpleado);
    obtenerServiciosPacEmpleado(numeroEmpleado);
    obtenerAsistenciaReunionesIntegracionEmpleado(numeroEmpleado);


    listarCursos();
    listarOportunidades();
    listarClinicas();
    listarBeneficios();


    listarPuestos();
    listarNivelesEstudio();
    listarCiudades();
    listarEstados();
    listarPaises();
});

//OBTENER LA INFORMACION DEL EMPLEADO
async function obtenerEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        //console.log('Empleado:');
        //console.log(data);

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        document.getElementById('nombre_empleado').textContent = data[0].nombreEmpleado;

        document.getElementById('numero_empleado').textContent = data[0].numeroEmpleado;

        document.getElementById('nombreUsuario').textContent = data[0].nombreUsuario;

        document.getElementById('rfc_empleado').textContent = data[0].rfc;

        document.getElementById('nombreDepartamento').textContent = data[0].nombreDepartamento;

        document.getElementById('fecha_nacimiento').textContent = toformatearFecha(data[0].fechaNacimiento);
        document.getElementById('fecha_nacimiento').value = data[0].fechaNacimiento;

        document.getElementById('fecha_ingreso').textContent = toformatearFecha(data[0].fechaIngreso);
        document.getElementById('fecha_ingreso').value = data[0].fechaIngreso;

        document.getElementById('numeros').textContent = data[0].numeros;
        document.getElementById('numeros').value = data[0].pkNumeros

        sueldo = (data[0].nomina + data[0].vale);
        document.getElementById('sueldo_empleado').textContent = '$' + sueldo.toLocaleString('es-MX');

        document.getElementById('nombrePuesto').textContent = data[0].nombrePuesto;
        document.getElementById('nombrePuesto').value = data[0].fkPuesto;

        document.getElementById('funciones').textContent = data[0].funciones;

        document.getElementById('uniforme').textContent = data[0].uniforme;
        document.getElementById('uniforme').value = data[0].pkUniformeEmpleado + "-"+ data[0].tallaUniforme + "-"+data[0].pzasUniforme;

        document.getElementById('nomina_empleado').textContent = '$' + data[0].nomina.toLocaleString('es-MX');

        document.getElementById('vale_empleado').textContent = '$' + data[0].vale.toLocaleString('es-MX');;

        document.getElementById('ubicacion').textContent = data[0].ubicacion;
        document.getElementById('ubicacion').value = data[0].fkUbicacion + "-" + data[0].fkPuebloCiudad + "-" +data[0].fkEstado + "-" + data[0].fkPais;

        document.getElementById('nombre_nivel').textContent = data[0].nombreNivel;
        document.getElementById('nombre_nivel').value = data[0].fkNivelEstudio;

        document.getElementById('estado_empleado').textContent = data[0].estado;

        
        function calcularAntiguedadCompleta(fechaInicio) {
            let fechaInicial = new Date(fechaInicio);
            let fechaActual = new Date();

            let años = fechaActual.getFullYear() - fechaInicial.getFullYear();
            let meses = fechaActual.getMonth() - fechaInicial.getMonth();

            if (meses < 0) {
                años--;  
                meses += 12;  
            }

            return `${años} años y ${meses} meses`;
        }

        let antiguedadMeses = calcularAntiguedadCompleta(data[0].fechaIngreso);

        document.getElementById('antiguedad').textContent = antiguedadMeses;


       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerCursosEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/cursos_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        function traducirTiempo(texto) {
            let traducido = texto.includes("day") ? texto.replace("day", "día") : texto;
            return traducido.replace(/(\d+):(\d+):(\d+)/, "$1 hrs, $2 mins");
        }

        let cursos = document.getElementById('cursos');
        cursos.innerHTML = "";

        if (data.length > 0) {

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const nombreCurso = document.createElement('td');
                nombreCurso.textContent = item.nombreCurso;
                
                const nombrePresentador = document.createElement('td');
                nombrePresentador.textContent = item.nombrePresentador;
                
                const duracionCurso = document.createElement('td');
                duracionCurso.textContent = traducirTiempo(item.duracionCurso);
                
                const fechaAsistencia = document.createElement('td');
                fechaAsistencia.textContent = toformatearFecha(item.fechaAsistencia);
                
                const documentoObtenido = document.createElement('td');
                documentoObtenido.textContent = item.documentoObtenido;

                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalCursos(2,item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar ${item.nombreCurso}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarCurso(item.pkAsistenciaCurso);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);
                

                // Agregar todo a la fila
                tr.appendChild(nombreCurso);
                tr.appendChild(nombrePresentador);
                tr.appendChild(duracionCurso);
                tr.appendChild(fechaAsistencia);
                tr.appendChild(documentoObtenido);
                tr.appendChild(accionesTd);

                fragmento.appendChild(tr);
            });

            cursos.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin cursos tomados";
            td.colSpan = 7; // Para ocupar todas las columnas
            tr.appendChild(td);
            cursos.appendChild(tr);
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de cursos del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerPermisosEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/permisos_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {
            // Manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', { "closeButton": true });
            return;
        }

        let permisos = document.getElementById('permisos');
        permisos.innerHTML = "";

        if (data.length > 0) {
            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const descripcionPermiso = document.createElement('td');
                descripcionPermiso.textContent = item.descripcionPermiso;

                const fechaPermiso = document.createElement('td');
                fechaPermiso.textContent = toformatearFecha(item.fechaPermiso);

                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalPermisos(2, item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar permiso ${item.descripcionPermiso}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarPermiso(item.pkPermiso);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);

                // Agregar todo a la fila
                tr.appendChild(descripcionPermiso);
                tr.appendChild(fechaPermiso);
                tr.appendChild(accionesTd);

                fragmento.appendChild(tr);
            });

            permisos.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin permisos pedidos";
            td.colSpan = 3; // Para ocupar todas las columnas
            tr.appendChild(td);
            permisos.appendChild(tr);
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de permisos del empleado no se pudo concretar', 'Error', { "closeButton": true });
    }
}

async function obtenerOportunidadesEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/oportunidad_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        

        //console.log(data);

        let oportunidades = document.getElementById('oportunidades');
        oportunidades.innerHTML = ''

        if (data.length > 0) {
            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const oportunidad = document.createElement('td');
                oportunidad.textContent = item.oportunidad;

                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalOportunidades(2, item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar permiso ${item.oportunidad}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarOportunidad(item.fkOportunidad, item.fkEmpleado);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);

                // Agregar todo a la fila
                tr.appendChild(oportunidad);
                tr.appendChild(accionesTd);

                fragmento.appendChild(tr);
            });

            oportunidades.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin oportunidades asignadas";
            td.colSpan = 3; // Para ocupar todas las columnas
            tr.appendChild(td);
            oportunidades.appendChild(tr);
        }
        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de oportunidades del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerPrestamosEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/prestamos_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        

        //console.log(data);

        let prestamos = document.getElementById('prestamos');
        prestamos.innerHTML = ''

        if (data.length > 0) {

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const motivoPrestamo = document.createElement('td');
                motivoPrestamo.textContent = item.motivoPrestamo;
                
                const montoPrestamo = document.createElement('td');
                montoPrestamo.textContent = '$' + item.montoPrestamo.toLocaleString('es-MX');
                
                const formaPago = document.createElement('td');
                formaPago.textContent = item.formaPago;

                const fechaPrestamo = document.createElement('td');
                fechaPrestamo.textContent = toformatearFecha(item.fechaPrestamo);

                const montoApoyo = document.createElement('td');
                montoApoyo.textContent = '$' + item.montoApoyo.toLocaleString('es-MX');
                
                const fechaTerminoPago = document.createElement('td');
                fechaTerminoPago.textContent = toformatearFecha(item.fechaTerminoPago);

                function calcularQuincenas(fechaFutura) {
                    let fechaActual = new Date();
                    let fechaObjetivo = new Date(fechaFutura);

                    let diferenciaDias = Math.floor((fechaObjetivo - fechaActual) / (1000 * 60 * 60 * 24));
                    let quincenas = Math.floor(diferenciaDias / 15);

                    return quincenas > 0 ? `${quincenas} quincenas.` : "No hay quincenas restantes.";
                }   

                let quincenasRestantes = calcularQuincenas(item.fechaTerminoPago);

                const quincenas = document.createElement('td');
                quincenas.textContent = quincenasRestantes;

                


                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalPrestamos(2,item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar ${item.motivoPrestamo}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarPrestamo(item.pkPrestamo);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);


                // Agregar todo a la fila
                tr.appendChild(motivoPrestamo);
                tr.appendChild(montoPrestamo);
                tr.appendChild(formaPago);
                tr.appendChild(fechaPrestamo);
                tr.appendChild(montoApoyo);
                tr.appendChild(fechaTerminoPago);
                tr.appendChild(quincenas);
                tr.appendChild(accionesTd);


                fragmento.appendChild(tr);
            });

            prestamos.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin prestamos realizados";
            td.colSpan = 7; // Para ocupar todas las columnas
            tr.appendChild(td);
            prestamos.appendChild(tr);
        }
        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de prestamos del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerServiciosPacEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/serviciosPac_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }


        //console.log(data);

        let serviciosPac = document.getElementById('serviciosPac');
        serviciosPac.innerHTML = ''

        if (data.length > 0) {

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const nombreBeneficio = document.createElement('td');
                nombreBeneficio.textContent = item.nombreBeneficio;
                
                const numeroSesion = document.createElement('td');
                numeroSesion.textContent = item.numeroSesion;
                
                const costoSesion = document.createElement('td');
                costoSesion.textContent = '$' + item.costoSesion.toLocaleString('es-MX');

                const fechaSesion = document.createElement('td');
                fechaSesion.textContent = toformatearFecha(item.fechaSesion);

                const nombreClinica = document.createElement('td');
                nombreClinica.textContent = item.nombreClinica;

                const montoApoyo = document.createElement('td');
                montoApoyo.textContent = '$' + item.montoApoyo.toLocaleString('es-MX');

                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalServiciosPac(2,item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar la sesion ${item.numeroSesion} de ${item.nombreBeneficio}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarServicioPac(item.pkServicioPac);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);


                // Agregar todo a la fila
                tr.appendChild(nombreBeneficio);
                tr.appendChild(numeroSesion);
                tr.appendChild(costoSesion);
                tr.appendChild(fechaSesion);
                tr.appendChild(nombreClinica);
                tr.appendChild(montoApoyo);
                tr.appendChild(accionesTd);


                fragmento.appendChild(tr);
            });

            serviciosPac.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin beneficios tomados";
            td.colSpan = 7; // Para ocupar todas las columnas
            tr.appendChild(td);
            serviciosPac.appendChild(tr);
        }
        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de beneficios PAC del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerAsistenciaReunionesIntegracionEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/reunionesIntegracion_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }


        //console.log(data);

        let reunionesIntegracion = document.getElementById('reunionesIntegracion');
        reunionesIntegracion.innerHTML = ''

        if (data.length > 0) {

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const tr = document.createElement('tr');

                const fechaAsistencia = document.createElement('td');
                fechaAsistencia.textContent = toformatearFecha(item.fechaAsistencia);

                const accionesTd = document.createElement('td');

                // Botón de editar
                const editarBtn = document.createElement('a');
                editarBtn.className = 'btn btn-warning btn-bordered btn-xsxs';
                editarBtn.textContent = 'Editar';

                editarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    abrirModalReunionIntegracion(2,item);
                });

                // Botón de eliminar
                const eliminarBtn = document.createElement('a');
                eliminarBtn.className = 'btn btn-danger btn-bordered btn-xsxs';
                eliminarBtn.textContent = 'Eliminar';

                eliminarBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: `¿Eliminar la asistencia con fecha ${toformatearFecha(item.fechaAsistencia)}?`,
                        text: "No se puede deshacer esta acción",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#B71C1C",
                        cancelButtonColor: "#C1C0C0",
                        confirmButtonText: "Eliminar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            tr.remove();
                            eliminarReunionIntegracion(item.pkReunionIntegracion);
                        }
                    });
                });

                // Agregar los botones al mismo <td>
                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);


                // Agregar todo a la fila
                tr.appendChild(fechaAsistencia);
                tr.appendChild(accionesTd);


                fragmento.appendChild(tr);
            });

            reunionesIntegracion.appendChild(fragmento);
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = "Sin asistencias a reuniones";
            td.colSpan = 7; // Para ocupar todas las columnas
            tr.appendChild(td);
            reunionesIntegracion.appendChild(tr);
        }
        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de beneficios PAC del empleado no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}



//PARA AGREGAR INFORMACION ADICIONAL DEL EMPLEADO
$("#editarUsuario").click(function() {
    armarFormulario();
});

async function listarPuestos() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/puestos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('puesto_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkPuesto;
            option.textContent = niveles.nombrePuesto;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de puestos no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function listarNivelesEstudio() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/niveles_estudio`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('niveles_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkNivelEstudio;
            option.textContent = niveles.nombreNivel;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de niveles de estudio no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function listarCiudades() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/pueblosCiudades`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('ciudad_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkPuebloCiudad;
            option.textContent = niveles.nombrePuebloCiudad;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de ciudades de estudio no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function listarEstados() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/estados`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('estado_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkEstado;
            option.textContent = niveles.nombreEstado;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de estados de estudio no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function listarPaises() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/paises`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        //console.log(data);

        const select = document.getElementById('pais_menu');
        select.innerHTML = "";


        data.forEach(niveles => {

            let option = document.createElement('option');
            option.value = niveles.pkPais;
            option.textContent = niveles.nombrePais;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de estados de estudio no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

function armarFormulario() {
    // Vaciar todos los campos antes de asignar valores
    const limpiarCampo = (id) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = "";
    };

    const camposAVaciar = [
        'nombreEmpleado', 'fechaIngreso', 'nomina', 'vale', 'puesto_menu', 'rfc', 
        'fechaNacimiento', 'talla_menu', 'pzasUniforme', 'niveles_menu', 'estado', 
        'ciudad_menu', 'estado_menu', 'pais_menu'
    ];
    camposAVaciar.forEach(limpiarCampo);

    // Vaciar selects múltiples
    const limpiarSelect = (id) => {
        const select = document.getElementById(id);
        if (select) select.innerHTML = "";
    };

    limpiarSelect('numeroEmergencia_menu');

    // Función para asignar valores según origen
    const asignarValor = (idDestino, idOrigen, esValor = false) => {
        const elementoOrigen = document.getElementById(idOrigen);
        if (elementoOrigen) {
            const valor = esValor ? elementoOrigen.value : elementoOrigen.textContent.trim();
            if (valor) {
                document.getElementById(idDestino).value = valor;
            }
        }
    };

    asignarValor('nombreEmpleado', 'nombre_empleado');
    asignarValor('rfc', 'rfc_empleado');
    asignarValor('puesto_menu', 'nombrePuesto', true); // Ahora obtiene el "value"
    asignarValor('niveles_menu', 'nombre_nivel', true); // Ahora obtiene el "value"

    // Formatear fechas
    const formatearFecha = (idDestino, idOrigen) => {
        const elementoOrigen = document.getElementById(idOrigen);
        if (elementoOrigen && elementoOrigen.value) {
            const fecha = new Date(elementoOrigen.value);
            document.getElementById(idDestino).value = fecha.toISOString().split("T")[0];
        }
    };

    formatearFecha('fechaIngreso', 'fecha_ingreso');
    formatearFecha('fechaNacimiento', 'fecha_nacimiento');

    // Extraer números de cadena con "$"
    const extraerNumero = (idDestino, idOrigen) => {
        const elementoOrigen = document.getElementById(idOrigen);
        if (elementoOrigen && elementoOrigen.textContent.includes("$")) {
            const partes = elementoOrigen.textContent.split("$");
            document.getElementById(idDestino).value = parseFloat(partes[1]);
        }
    };

    extraerNumero('nomina', 'nomina_empleado');
    extraerNumero('vale', 'vale_empleado');

    const numeros = document.getElementById('numeros')?.textContent;
    const pkNumeros = document.getElementById('numeros')?.value;

    if (numeros && pkNumeros) {
        const select = document.getElementById("numeroEmergencia_menu");

        const numerosArray = numeros.split("-");
        const pkNumerosArray = pkNumeros.split("-");

        numerosArray.forEach((numero, index) => {
            if (numero.trim() && pkNumerosArray[index]) {
                const opcion = document.createElement("option");
                opcion.value = pkNumerosArray[index]; // Ahora usa pkNumeros
                opcion.textContent = numero; // Sigue mostrando numeros
                opcion.selected = true;
                select.appendChild(opcion);
            }
        });
    }


    // Procesar uniforme
    const uniforme = document.getElementById('uniforme')?.value;
    if (uniforme) {
        const partes_uniforme = uniforme.split("-");
        const talla = partes_uniforme[1] === 'PEQUEÑA' ? 1 : partes_uniforme[1] === 'MEDIANA' ? 2 : 3;
        document.getElementById('talla_menu').value = talla;
        document.getElementById('pzasUniforme').value = partes_uniforme[2];
    }

    // Procesar ubicación
    const ubicacion = document.getElementById('ubicacion')?.textContent;
    const fkUbicaciones = document.getElementById('ubicacion')?.value;
    const fkUbicacionesPartes = fkUbicaciones.split("-");

    if (ubicacion && fkUbicacionesPartes.length >= 3) {
        const [ciudad, estado, pais] = ubicacion.split(", ");

        const asignarOpcion = (idMenu, valor, indice) => {
            if (valor && fkUbicacionesPartes[indice]) {
                const menu = document.getElementById(idMenu);
                const opcion = document.createElement("option");
                opcion.value = fkUbicacionesPartes[indice]; // Ahora toma el valor correcto de fkUbicacionesPartes
                opcion.textContent = valor;
                opcion.selected = true;
                menu.appendChild(opcion);
            }
        };

        asignarOpcion("ciudad_menu", ciudad, 1);  // Índice 0 para ciudad
        asignarOpcion("estado_menu", estado, 2);  // Índice 1 para estado
        asignarOpcion("pais_menu", pais, 3);      // Índice 2 para país
    }


    // Procesar estado del empleado
    const estadoEmpleado = document.getElementById('estado_empleado')?.textContent;
    if (estadoEmpleado) {
        document.getElementById('estado').value = estadoEmpleado === 'Activo' ? 1 : 2;
    }
}


$("#addInfo").click(function() {
    agregarInfoComplementaria();
});

async function agregarInfoComplementaria() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const nombreEmpleado = document.getElementById('nombreEmpleado').value;

        const fechaIngreso = document.getElementById('fechaIngreso').value;

        const nomina = document.getElementById('nomina').value;

        const vale = document.getElementById('vale').value;

        const fkPuesto = document.getElementById('puesto_menu').value;

        const state = document.getElementById('estado').value;
        
        /////////////////////////////////////////////////////////////

        const rfc = document.getElementById('rfc').value;

        const fechaNacimiento = document.getElementById('fechaNacimiento').value;

        const pkNumerosEmergencia = document.getElementById('numeros').value;

        const numeroEmergencia_menu = document.getElementById('numeroEmergencia_menu');
        const numerosSeleccionados = Array.from(numeroEmergencia_menu.selectedOptions).map(option => option.value);

        var pkUniformeEmpleado = document.getElementById('uniforme').value;
        pkUniformeEmpleado = pkUniformeEmpleado.split('-')[0];
        pkUniformeEmpleado = parseInt(pkUniformeEmpleado, 10); // Conversión a número


        const tallaUniforme = document.getElementById('talla_menu').value;

        const pzasUniforme = document.getElementById('pzasUniforme').value;

        const fkNivelEstudio = document.getElementById('niveles_menu').value;

        var fkUbicacion = document.getElementById('ubicacion').value;
        fkUbicacion = fkUbicacion.split('-');
        fkUbicacion = parseInt(fkUbicacion[0]);


        const ciudad_menu = document.getElementById('ciudad_menu');
        const ciudadSeleccionada = Array.from(ciudad_menu.selectedOptions).map(option => option.value);

        const estado_menu = document.getElementById('estado_menu');
        const estadoSeleccionada = Array.from(estado_menu.selectedOptions).map(option => option.value);

        const pais_menu = document.getElementById('pais_menu');
        const paisSeleccionado = Array.from(pais_menu.selectedOptions).map(option => option.value);

        const sonNumericos = numerosSeleccionados.every(numero => /^\d+$/.test(numero));

        if (!sonNumericos) {
            toastr.warning('Se ha escrito texto como numero de emergencia', 'Atención', {"closeButton": true});
            return;
        }

        if (ciudadSeleccionada.length > 1 || estadoSeleccionada.length > 1 || paisSeleccionado.length > 1) {
            let mensaje = ciudadSeleccionada.length > 1 
                ? "Selecciona solo una ciudad o pueblo" 
                : estadoSeleccionada.length > 1 
                ? "Selecciona solo un estado" 
                : "Selecciona solo un país";

            toastr.warning(mensaje, 'Atención', {"closeButton": true});
            return;
        }

        puebloCiudad = ciudadSeleccionada[0];
        estado = estadoSeleccionada[0];
        pais = paisSeleccionado[0];


        if (!nombreEmpleado || !fechaIngreso || !nomina || !vale || !fkPuesto || !state || !numeroEmpleado || !rfc || !fechaNacimiento || !numerosSeleccionados || !tallaUniforme || !pzasUniforme || !fkNivelEstudio || !puebloCiudad || !estado || !pais) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/infoEmpleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreEmpleado, fechaIngreso, nomina, vale, fkPuesto, state, numeroEmpleado, rfc, fechaNacimiento, pkNumerosEmergencia, numerosSeleccionados, pkUniformeEmpleado, pkUniformeEmpleado, tallaUniforme, pzasUniforme, fkNivelEstudio, fkUbicacion, puebloCiudad, estado, pais })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-1').modal('hide');

        obtenerEmpleado(numeroEmpleado);
        //window.location.reload();



    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}

$("#validateInfo").click(function() {
    validarInfo();
});

async function validarInfo() {
    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const nombreEmpleado = document.getElementById('nombreEmpleado').value;

        const fechaIngreso = document.getElementById('fechaIngreso').value;

        const nomina = document.getElementById('nomina').value;

        const vale = document.getElementById('vale').value;

        const fkPuesto = document.getElementById('puesto_menu').value;

        const state = document.getElementById('estado').value;
        
        /////////////////////////////////////////////////////////////

        const rfc = document.getElementById('rfc').value;

        const fechaNacimiento = document.getElementById('fechaNacimiento').value;

        const numeroEmergencia_menu = document.getElementById('numeroEmergencia_menu');
        const numerosSeleccionados = Array.from(numeroEmergencia_menu.selectedOptions).map(option => option.value);

        var pkUniformeEmpleado = document.getElementById('uniforme').value;
        pkUniformeEmpleado = pkUniformeEmpleado.split('-')[0];
        pkUniformeEmpleado = parseInt(pkUniformeEmpleado, 10); // Conversión a número


        const tallaUniforme = document.getElementById('talla_menu').value;

        const pzasUniforme = document.getElementById('pzasUniforme').value;

        const fkNivelEstudio = document.getElementById('niveles_menu').value;

        var fkUbicacion = document.getElementById('ubicacion').value;

        const ciudad_menu = document.getElementById('ciudad_menu');
        const ciudadSeleccionada = Array.from(ciudad_menu.selectedOptions).map(option => option.value);

        const estado_menu = document.getElementById('estado_menu');
        const estadoSeleccionada = Array.from(estado_menu.selectedOptions).map(option => option.value);

        const pais_menu = document.getElementById('pais_menu');
        const paisSeleccionado = Array.from(pais_menu.selectedOptions).map(option => option.value);

        const sonNumericos = numerosSeleccionados.every(numero => /^\d+$/.test(numero));

        alert('Numeros: ' + numerosSeleccionados + ' / Ciudades: '+ciudadSeleccionada +'-'+estadoSeleccionada + '-'+paisSeleccionado);
        return;

        if (!sonNumericos) {
            toastr.warning('Se ha escrito texto como numero de emergencia', 'Atención', {"closeButton": true});
            return;
        }

        if (ciudadSeleccionada.length > 1 || estadoSeleccionada.length > 1 || paisSeleccionado.length > 1) {
            let mensaje = ciudadSeleccionada.length > 1 
                ? "Selecciona solo una ciudad o pueblo" 
                : estadoSeleccionada.length > 1 
                ? "Selecciona solo un estado" 
                : "Selecciona solo un país";

            toastr.warning(mensaje, 'Atención', {"closeButton": true});
            return;
        }

        puebloCiudad = ciudadSeleccionada[0];
        estado = estadoSeleccionada[0];
        pais = paisSeleccionado[0];


  



    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}








