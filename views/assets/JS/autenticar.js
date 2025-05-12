$(document).ready(function () {
    
    //document.getElementById("elemento1").addEventListener("click", miFuncion);

    if(sessionStorage.getItem("usuario") === null ){
        
        //window.location.href='./login.html';

        //toastr.warning(`No hay usuario`, 'Atencion', {"closeButton": true,});

    }else{
        obtenerUsuario()
    }

});



function obtenerUsuario(){

    usuario = sessionStorage.getItem("usuario");
    departamento = sessionStorage.getItem("departamento");

    document.getElementById('usuario').innerHTML = usuario;
    document.getElementById('departamento').innerHTML = departamento;

}


$("#user").click(function() {
    toastr.info(`Eres ese usuario actualmente`, 'Sesión actual', {
        "closeButton": true,
    });
});

$("#cerrarSesion").click(function() {
    // alert("¡Botón clickeado!");

    Swal.fire({
        title: "Cerrar sesión",
        text: "¿Estas seguro de salir?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#C1C0C0",
        confirmButtonText: "Salir",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = "./login.html"; 
        }
    });
      
});