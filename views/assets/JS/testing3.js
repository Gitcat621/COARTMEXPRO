document.getElementById('obtener').addEventListener('click', function() {
    const select = document.getElementById('select2');
    const valoresSeleccionados = Array.from(select.selectedOptions).map(option => option.value);
    
    console.log(valoresSeleccionados);
    alert('¡Changuitos activados! 🐒 ' + valoresSeleccionados.join(', '));
});
