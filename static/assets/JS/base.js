$(document).ready(function () {
    
    //document.getElementById("elemento1").addEventListener("click", miFuncion);

    if(sessionStorage.getItem("usuario") === null ){
        //window.location.href='./login.html';
    }else{
        //obtenerUsuario()
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
    swal({   
        title: "¿Cerrar sesión?",   
        text: "Saldras de la plataforma",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#6942f5",   
        confirmButtonText: "Terminar la sesión", 
        cancelButtonText: "Seguir en sesión", 
        closeOnConfirm: true,
        closeOnCancel: true,
    }, function(isConfirm){   
        if (isConfirm) {     
            sessionStorage.clear();
            window.location.href = "./login.html"; 
        } else {    
        } 
    });
    return false;
});