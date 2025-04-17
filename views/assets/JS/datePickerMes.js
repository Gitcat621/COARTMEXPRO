$(document).ready(function() {
    $('#datepicker2').datepicker({
        locale: {
            autoclose: false,
			beforeShowDay: $.noop,
			beforeShowMonth: $.noop,
			calendarWeeks: false,
			clearBtn: false,
			toggleActive: false,
			daysOfWeekDisabled: [],
			datesDisabled: [],
			endDate: Infinity,
			forceParse: true,
			keyboardNavigation: true,
			language: 'en',
			multidate: false,
			multidateSeparator: ',',
			orientation: "auto",
			rtl: false,
			startDate: -Infinity,
			startView: 1,		//AQUI SE HIZO LA MODIFICACION
			minViewMode: 1,
			autoclose: true,
			// format: 'mm/dd/yyyy',
			format: 'mm', //HASTA AQUI
			todayBtn: false,
			todayHighlight: false,
			weekStart: 0,
			disableTouchKeyboard: false,
			enableOnReadonly: true,
			container: 'body'
        }
    });
});