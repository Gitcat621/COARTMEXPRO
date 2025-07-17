$(document).ready(function () {

    obtenerCursos();

});

async function obtenerCursos() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/coartmex/pueblosCiudades`, {
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
            option.value = opcion.nombrePuebloCiudad;
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

    const valor = document.getElementById('opcion').value;

    const valor2 = document.getElementById('opcion2').value;
    
    
    alert(valor + " y " + valor2);


});