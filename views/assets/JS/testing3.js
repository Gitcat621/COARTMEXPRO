$(document).ready(function () {

    obtenerCursos();

});

async function obtenerCursos() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/cursos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true});
            return;
        }

        console.log(data);

const datalist = document.getElementById("languages");
            datalist.innerHTML = "";

            data.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.nombreCurso;
                datalist.appendChild(option);
            });

            const $input = $('input.flexdatalist');
            $input.val('');

            $input.flexdatalist({
                minLength: 0
            });

            $input.on('focus', function () {
                $(this).trigger('input');
            });


    } catch (error) {
        console.error("Error al cargar los datos:", error);
        //toastr.error('La petición de cursos no se pudo concretar', 'Error', {"closeButton": true});
    }
}




// async function obtenerCursos() {
//     try {
//         const response = await fetch(`http://127.0.0.1:5000/coartmex/cursos`, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' }
//         });
//         const data = await response.json();

//         if (!response.ok) {

//             //manejo de errores
//             toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
//             return;
//         }

//         console.log(data);

//         const select = document.getElementById('dreamingSelect');
//         select.innerHTML = "";


//         data.forEach(curso => {

//             let option = document.createElement('option');
//             option.value = curso.pkCurso;
//             option.textContent = curso.nombreCurso;
//             select.appendChild(option);
//         });

//         const select2 = document.getElementById('opciones');
//         select.innerHTML = "";


//         // data.forEach(opcion => {

//         //     let item = document.createElement("option");
//         //     item.value = opcion.nombreCurso; // Muestra el nombre
//         //     //option.textContent = curso.nombreCurso;
//         //     select2.appendChild(item);
//         // });
        

//         $(document).ready(function () {
//        // Referencia al datalist
//         const datalist = document.getElementById("languages");

//         // Limpia opciones previas
//         datalist.innerHTML = "";

//         // Agrega nuevas opciones dinámicamente
//         data.forEach(opcion => {
//         const option = document.createElement("option");
//         option.value = nombreCurso;
//         datalist.appendChild(option);
//         });
//         $('input.flexdatalist').flexdatalist();
//         });

        
        

        

       
//     } catch (error) {
//         console.error("Error al cargar los datos:", error);
//         toastr.error('La petición de cursos no se pudo concretar', 'Error', {"closeButton": true,});
//     }
// }

document.getElementById('obtener').addEventListener('click', function() {

    const select = document.getElementById('select2');
    const valoresSeleccionados = Array.from(select.selectedOptions).map(option => option.value);
    
    console.log(valoresSeleccionados);
    alert(valoresSeleccionados.join(', '));

});

document.getElementById('dreaming').addEventListener('click', function() {

    const select = document.getElementById('dreamingSelect');
    const valoresSeleccionados = Array.from(select.selectedOptions).map(option => option.value);
    
    console.log(valoresSeleccionados);
    alert(valoresSeleccionados.join(', '));

});

document.getElementById('compare').addEventListener('click', function() {

    const fecha1 = document.getElementById('fechaIngreso').value;
    const fecha2 = document.getElementById('fi').value;
    
    
    alert(fecha1 +' '+fecha2);


});

document.getElementById('aver').addEventListener('click', function() {

    const valor = document.getElementById('opciones').value;
    
    
    alert(valor);


});