
document.getElementById('login').addEventListener('submit', function(event) {

  event.preventDefault();

  valida();

});

function valida(){

  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;


  if(!user || !pass){

    toastr.warning('Porfavor completa todos los campos', 'Advertencia', {"closeButton": true,});
    return;

  }

  envio(user,pass);
    
}

async function envio(user,pass){

  try {

    const respuesta = await fetch("api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombreUsuario: user, contrasena: pass }),
    });


    if (!respuesta.ok) {

      //manejo de errores
      if (respuesta.status === 401) {

        swal({   
          title: "Credenciales incorrectas",   
          text: "Intenta de nuevo",   
          type: "warning",      
          confirmButtonColor: "#6942f5",   
          confirmButtonText: "Ok", 
          closeOnConfirm: true,
        })

      } else if (respuesta.status === 400) {

        toastr.error('Petición incorrecta al servidor, comunicarse con el desarrollador', 'Error', {"closeButton": true,});

      } else {

        toastr.error('No se pudo completar la acción por un error inesperado', 'Error inesperado', {"closeButton": true,});
      }
      return;
    }

    const datos = await respuesta.json();

    console.log(datos)

    // Redirige al usuario a la página principal, guarda el token, etc.
    sessionStorage.setItem("usuario", datos.nombreUsuario);
		sessionStorage.setItem("departamento", datos.nombreDepartamento);
    window.location.href = "/web/bienvenida"; 

  } catch (error) {

    //console.error("Error:", error);

    toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});

  }

}

$("#recoverPass").click(function() {

  toastr.info('Comunicate con el administrador', 'Info', {"closeButton": true,});

});
