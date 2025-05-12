$(document).ready(function () {


    listarEmpleados();
    
});

async function listarEmpleados() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/empleados', {
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
       
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición de colaboradores no se pudo concretar', 'Error', {"closeButton": true,});
    }
}