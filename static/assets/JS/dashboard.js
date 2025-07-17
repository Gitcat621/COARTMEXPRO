$("#usuario").click(function() {
    const usuario = document.getElementById('usuario').textContent;
    toastr.info(`Eres '${usuario}' actualmente`, 'Sesión actual', {
        "closeButton": true,
    });
});

$("#cerrarSesion").click(function (e) {

    Swal.fire({
        title: "Cerrar sesión",
        text: "¿Estás seguro de salir?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#C1C0C0",
        confirmButtonText: "Salir",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/logout';
        }
    });
});



