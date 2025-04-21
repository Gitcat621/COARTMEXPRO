$(document).ready(function () {

    cargarLenguajes();
  
});

async function cargarLenguajes() {
    try {
        const response = await fetch('http://127.0.0.1:5000/coartmex/departamentos', { // Cambia la URL según tu API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error al obtener los datos:", response.status);
            return;
        }

        console.log(data);

        const select = document.getElementById('languages');
        select.innerHTML = ""; // Limpiar contenido previo

        data.forEach(lenguaje => {
            console.log(lenguaje);


            let option = document.createElement('option');
            option.value = lenguaje.pkDepartamento; // Asignar el nombre del lenguaje
            option.textContent = lenguaje.nombreDepartamento;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

// function cargarLenguajes() {
//     const lenguajes = [
//         "PHP", "JavaScript", "Cobol", "C#", "C++", 
//         "Java", "Pascal", "FORTRAN", "Lisp", "Swift"
//     ];

//     const select = document.getElementById('languages');
//     select.innerHTML = ""; // Limpiar contenido previo

//     lenguajes.forEach(lenguaje => {
//         let option = document.createElement('option');
//         option.value = lenguaje;
//         option.textContent = lenguaje; // Mostrar el texto en el select
//         select.appendChild(option);
//     });
// }



