$(document).ready(function() {
    $('#colaboradores').DataTable();

    $('#colaboradores tbody').on('click', 'tr', function() {
        var url = $(this).attr('data-url');
        if (url) {
            window.location.href = "perfil.html";
        }
    });
});
