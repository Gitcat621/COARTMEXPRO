$(document).ready(function() {
    var table = $('#example').DataTable();

  $('#example tbody').on('click', 'tr', function () {
    var tr = $(this);
    var row = table.row(tr);

    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
    } else {
      //<td>Juan Pérez</td>
      //row.child('<div style="padding: 10px;">Más información sobre ' + row.data()[0] + '</div>').show();
      row.child(`
        <tr>
          <td>Full name:</td>
        </tr>
        <tr>
          <td>Extension number:</td>
        </tr>
        <tr>
           <td>Extra info:</td>  
        </tr>
      `).show();
      tr.addClass('shown');
      }
    });
  });