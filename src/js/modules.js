/*
	This script is used to control adding and removing modules from view.
*/
var baseCanvas = "<img class='fullscreen' src='Images/fullscreen.png'><div class='canvas chart'></div>";


function modules(item){
	var chartType = $(item).attr('data');
	
	if ($('#'+chartType).is('*')) {
		// remove if active
		$($('#'+chartType+'Container').parent()).addClass('empty');
		$('#'+chartType+'Container').fadeOut(600, function(){
			$(this).remove();
			$(item).parent().removeClass('active');
		});

		delete user.modules.active.statistics
	} else {
		// add if inactive
		$(item).parent().addClass('active');
		if( $('.empty')[0] === undefined ){
			$("<div class='row top-pad'><div class='col-md-6 empty'></div><div class='col-md-6 empty'></div></div>").appendTo($('#charts'));
		}

		addModule(chartType)
	}
}

function addModule(chartType){
	// references the modules correspinding model default data and config
	user.modules.active[chartType] = eval(model_lookup[chartType]+'_default')
	user.modules.active[chartType].data = eval(model_lookup[chartType]+'_model')

	// add module to 1st empty div
	var elem = "<div id='"+chartType+"Container'>";

	if ( user.modules.active[chartType].type == 'chart' ) {
		elem += baseCanvas;
		var canvas = "<canvas id='"+chartType+"' width='400' height='400'></canvas>";
	
		$(elem).appendTo($('.empty')[0]);
		$(canvas).appendTo($('.empty .canvas')[0]);
		$($('.empty')[0]).removeClass('empty');

		var elem = document.getElementById(chartType).getContext("2d");
		user.modules.active[chartType].elem
		user.modules.active[chartType].elem = new Chart(elem, user.modules.active[chartType].data);
	} else {
		if ( chartType == 'dataViewer' ){
			elem += "<img class='fullscreen' src='Images/fullscreen.png'><p id='"+chartType+"'></p>";
			$(elem).appendTo($('.empty')[0]);
		}
	}
	$($('.empty')[0]).removeClass('empty');
}