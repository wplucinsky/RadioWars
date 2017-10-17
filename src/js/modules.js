/*
	This script is used to control adding and removing modules from view.
*/
var baseCanvas = "<img class='fullscreen' src='src/img/fullscreen.png'><div class='canvas chart'></div>";


function modules(item){
	var m = $(item).attr('data'),
		n = $(item).attr('data-node');
	
	if ($('#'+m).is('*')) {
		// remove if active
		$($('#'+m+'Container').parent()).addClass('empty');
		$('#'+m+'Title').fadeOut(600);
		$('#'+m+'Container').fadeOut(600, function(){
			$(this).remove();
			$(item).parent().removeClass('active');
		});

		stopAllIntervals(user, m)
		delete user.modules.active[m]
	} else {
		// add if inactive
		$(item).parent().addClass('active');
		if( $('.empty')[0] === undefined ){
			$("<div class='row top-pad'><div class='col-md-6 empty'></div><div class='col-md-6 empty'></div></div>").appendTo($('#charts'));
		}

		addModule(m, n)
	}
}

function addModule(m, n){
	// references the modules correspinding model default data and config
	user.modules.active[m] = eval(model_lookup[m]+'_default')
	user.modules.active[m].data = eval(model_lookup[m]+'_model')

	// add module to 1st empty div
	var elem = "<div class='title' id='"+m+"Title'>"+getStylizedName(m)+" - Node "+n+"</div><div id='"+m+"Container'>";

	if ( user.modules.active[m].type == 'chart' ) {
		elem += baseCanvas;
		var canvas = "<canvas id='"+m+"' width='400' height='400'></canvas>";
	
		$(elem).appendTo($('.empty')[0]);
		$(canvas).appendTo($('.empty .canvas')[0]);

		var elem = document.getElementById(m).getContext("2d");
		user.modules.active[m].elem
		user.modules.active[m].elem = new Chart(elem, user.modules.active[m].data);
	} else {
		if ( m == 'dataViewer' ){
			elem += "<img class='fullscreen' src='src/img/fullscreen.png'><p id='"+m+"'></p>";
			$(elem).appendTo($('.empty')[0]);
		}
		if ( m == 'gridView' ){
			elem += "<img class='fullscreen' src='src/img/fullscreen.png'><div class='canvas chart'><canvas id='gridView' width='350' height='350'></canvas></div>";
			$(elem).appendTo($('.empty')[0]);
			gridView_start(m)
		}
	}
	$($('.empty')[0]).removeClass('empty');
}

function getStylizedName(m){
	var tmp = m.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
	return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}