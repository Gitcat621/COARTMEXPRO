
$("#agregarObservacion").click(function() {
    
    pkObservacionAsistencia = document.getElementById('observacionAsistencia').value;

    if(pkObservacionAsistencia !== undefined){
        editarObservacion(pkObservacionAsistencia);
    }else{
        guardarObservacion();
    }

});

async function obtenerObservacion() {
    try {

        let year = document.getElementById('datepicker').value;
        let month = document.getElementById('datepicker2').value;
        let fortnight = document.getElementById('quincena_menu').value;

        year = year ? Number(year) : new Date().getFullYear();
        month = month ? Number(month) : new Date().getMonth() + 1;
        fortnight = fortnight ? Number(fortnight) : 1;

        const response = await fetch(`http://127.0.0.1:5000/coartmex/observaciones?year=${year}&month=${month}&fortnight=${fortnight}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        if(data.length > 0){
            document.getElementById('observacion').value = data[0].descripcionObservacion;
            document.getElementById('observacionAsistencia').value = data[0].pkObservacionAsistencia;
        }else{
            document.getElementById('observacion').value = '';
            document.getElementById('observacionAsistencia').value = undefined;
        }
            

        


    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toastr.error('La petición no se pudo conectar', 'Error', {"closeButton": true,});
    }
}

async function guardarObservacion() {

    try {

        const rangoFechaInicio = document.getElementById('fechaInicio').textContent.trim();
        const rangoFechaFinal = document.getElementById('fechaFin').textContent.trim();
        const descripcionObservacion = document.getElementById('observacion').value.trim();

        if (!descripcionObservacion) {
            toastr.warning('Por favor agrega una descripcion para guardar', 'Advertencia', { "closeButton": true });
            return;
        }

        if (!rangoFechaFinal || !rangoFechaInicio) {
            toastr.warning('No hay un reporte para agregar observaciones', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/observaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcionObservacion, rangoFechaInicio, rangoFechaFinal })
        });
        
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });
        obtenerObservacion();

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

async function editarObservacion(pkObservacionAsistencia) {
    try {
        const descripcionObservacion = document.getElementById('observacion').value.trim();
        const rangoFechaInicio = document.getElementById('fechaInicio').textContent.trim();
        const rangoFechaFinal = document.getElementById('fechaFin').textContent.trim();

        if (!pkObservacionAsistencia || !descripcionObservacion || !rangoFechaInicio || !rangoFechaFinal) {
            toastr.warning('Por favor completa todos los campos', 'Advertencia', { "closeButton": true });
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/coartmex/observaciones', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pkObservacionAsistencia, descripcionObservacion, rangoFechaInicio, rangoFechaFinal})
        });
        const data = await response.json();

        if (!response.ok) {

            //manejo de errores
            toastr.error(`${data.mensaje}`, 'Error', {"closeButton": true,});
            return;
        }

        toastr.success(`${data.mensaje}`, 'Realizado', { "closeButton": true });

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Hubo un error al intentar la acción', 'Error', { "closeButton": true });
    }
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.text("Reporte de Asistencia", 10, 15);

    const observacion = document.getElementById("observacion").value;

    doc.autoTable({
        html: '#tablaAsistencia',
        startY: 20,
        margin: { left: 2, right: 2 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [42, 147, 165] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    if (observacion && observacion.trim() !== "") {
        const pageHeight = doc.internal.pageSize.getHeight();
        const espacioRestante = pageHeight - finalY;

        doc.setFontSize(10);
        const texto = doc.splitTextToSize(observacion, 270);
        const altoTexto = texto.length * 5; // Aproximación: 5px por línea

        // Si el texto no cabe, agregamos nueva página
        if (altoTexto > espacioRestante) {
            doc.addPage();
            doc.setFontSize(10);
            doc.text("Observaciones:", 10, 15);
            doc.setFontSize(9);
            doc.text(texto, 10, 22);
        } else {
            doc.text("Observaciones:", 10, finalY);
            doc.setFontSize(9);
            doc.text(texto, 10, finalY + 7);
        }
    }

    doc.save("asistencia.pdf");
}

