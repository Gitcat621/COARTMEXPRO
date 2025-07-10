$(document).ready(function () {

    if (sessionStorage.getItem("departamento") !== 'RECURSOS HUMANOS' && sessionStorage.getItem("departamento") !== 'DIRECCION COMERCIAL') {
        window.location.href = './index.html';
        toastr.warning('Usted no debería estar aquí', 'Atención', { "closeButton": true });
    }
    
});