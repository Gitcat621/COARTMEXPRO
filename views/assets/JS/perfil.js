$(document).ready(function () {

    // Recuperar en la nueva vista
    const params = new URLSearchParams(window.location.search);
    const numeroEmpleado = params.get("id");

    obtenerEmpleado(numeroEmpleado);
    obtenerCursosEmpleado(numeroEmpleado);
    obtenerPermisosEmpleado(numeroEmpleado);
    obtenerOportunidadesEmpleado(numeroEmpleado);

    obtenerCursos();
    obtenerOportunidades();
    obtenerNivelesEstudio();
    
});

async function obtenerEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }


        const campos = [
            'nombreEmpleado', 'numeroEmpleado', 'nombreUsuario', 'rfc',
            'nombreDepartamento', 'fechaNacimiento', 'fechaIngreso', 'nomina',
            'vale', 'nombrePuesto', 'nombreNivel', 'ubicacion',
            'funciones', 'uniforme', 'numeros', 'estado'
        ];

        campos.forEach(campo => {
            let valor = data[0][campo] || '---';
            if (campo === 'fechaNacimiento' || campo === 'fechaIngreso') {
                valor = toformatearFecha(data[0][campo]) || 'Fecha no válida';
            }
            document.getElementById(campo).textContent = valor;
        });

        const formatoMoneda = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });

        document.getElementById('nomina').textContent = formatoMoneda.format(data[0].nomina || 0);
        document.getElementById('vale').textContent = formatoMoneda.format(data[0].vale || 0);
        document.getElementById('sueldo').textContent = formatoMoneda.format((data[0].vale || 0) + (data[0].nomina || 0));

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
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

        

        console.log(data);

        let cursos = document.getElementById('cursos');
        cursos.innerHTML = "";

        if(data.length > 0){

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.nombreCurso} por ${item.nombrePresentador} el día ${toformatearFecha(item.fechaAsistencia)}, acreedor de ${item.documentoObtenido}`;
                fragmento.appendChild(li);
            });

            cursos.appendChild(fragmento);



        }else{

            const fragmento = document.createDocumentFragment();

            const li = document.createElement('li');
            li.textContent = `Sin cursos tomados`;
            fragmento.appendChild(li);

            cursos.appendChild(fragmento);
        }

        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
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

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        

        console.log(data);

        let permisos = document.getElementById('permisos');
        permisos.innerHTML = "";
        

        if(data.length > 0){

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.descripcionPermiso} el dia ${toformatearFecha(item.fechaPermiso)}`;
                fragmento.appendChild(li);
            });

            permisos.appendChild(fragmento);


        }else{

            const fragmento = document.createDocumentFragment();

            const li = document.createElement('li');
            li.textContent = `Sin permisos pedidos`;
            fragmento.appendChild(li);

            permisos.appendChild(fragmento);
        }

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

async function obtenerOportunidadesEmpleado(numeroEmpleado) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/oportunidades_empleado?numeroEmpleado=${numeroEmpleado}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        

        console.log(data);

        let oportunidades = document.getElementById('oportunidades');
        oportunidades.innerHTML = ''

        if(data.length > 0){

            const fragmento = document.createDocumentFragment();

            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.oportunidad}`;
                fragmento.appendChild(li);
            });

            oportunidades.appendChild(fragmento);



        }else{
            
            const fragmento = document.createDocumentFragment();

            const li = document.createElement('li');
            li.textContent = `Sin oportunidades asiganadas`;
            fragmento.appendChild(li);

            oportunidades.appendChild(fragmento);
        }
        

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

function toformatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

async function obtenerCursos() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/cursos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        const select = document.getElementById('curso_menu');
        select.innerHTML = "";


        data.forEach(curso => {

            let option = document.createElement('option');
            option.value = curso.pkCurso;
            option.textContent = curso.nombreCurso;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

$("#newCourse").click(function() {
    agregarCursoEmpleado();
});

async function agregarCursoEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('curso_menu');
        const fkCurso = Menu.value;

        const fechaAsistencia = document.getElementById('fechaAsistencia').value;

        if (!numeroEmpleado || !fkCurso || !fechaAsistencia) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/asistencia_cursos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fkCurso, fechaAsistencia })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-1').modal('hide');


        obtenerCursosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}



$("#newPermission").click(function() {
    agregarPermisoEmpleado();
});

async function agregarPermisoEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const descripcionPermiso = document.getElementById('descripcionPermiso').value;

        const fechaPermiso = document.getElementById('fechaPermiso').value;

        if (!numeroEmpleado || !descripcionPermiso || !fechaPermiso) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/permisos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, descripcionPermiso, fechaPermiso })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-2').modal('hide');


        obtenerPermisosEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}


async function obtenerOportunidades() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/oportunidades`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        console.log(data);

        const select = document.getElementById('oportunidad_menu');
        select.innerHTML = "";


        data.forEach(oport => {

            let option = document.createElement('option');
            option.value = oport.pkOportunidad;
            option.textContent = oport.oportunidad;
            select.appendChild(option);
        });

       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}

$("#newOpportunity").click(function() {
    agregarOportunidadEmpleado();
});

async function agregarOportunidadEmpleado() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const Menu = document.getElementById('oportunidad_menu');
        const fkOportunidad = Menu.value;


        if (!numeroEmpleado || !fkOportunidad) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/oportunidad_empleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, fkOportunidad })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-3').modal('hide');


        obtenerOportunidadesEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}


async function obtenerNivelesEstudio() {
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

        console.log(data);

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

$("#addInfo").click(function() {
    agregarInfoComplementaria();
});

async function agregarInfoComplementaria() {

    try {

        const params = new URLSearchParams(window.location.search);
        const numeroEmpleado = params.get("id");

        const valor = document.getElementById('valor').value;



        if (!numeroEmpleado || !valor || !valor) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', {"closeButton": true});
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/infoEmpleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroEmpleado, valor, valor })
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;

        }

        toastr.success(`${data.mensaje}`, 'Realizado', {"closeButton": true});


        $('#boostrapModal-4').modal('hide');


        obtenerEmpleado(numeroEmpleado);


    } catch (error) {


        console.error('Error:', error);


        toastr.error('Hubo un error al intentar la acción', 'Error', {"closeButton": true});


    }
}