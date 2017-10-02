/*
	This script is used to control adding modules.
*/
var baseCanvas = "<img class='fullscreen' src='Images/fullscreen.png'><div class='canvas chart'></div>"
var chart = [];			// updates everytime new data comes in
var chartStatic = [];	// custom update cycle


function modules(item){
	// removes if active, adds if inactive
	var chartType = $(item).attr('data');
	
	if ($('#'+chartType).is('*')) {
		$($('#'+chartType+'Cont').parent()).addClass('empty');
		$('#'+chartType+'Cont').fadeOut(600, function(){
			$(this).remove();
			$(item).parent().removeClass('active');
		});
		delete chart[chartType];
	} else {
		$(item).parent().addClass('active');
		if( $('.empty')[0] === undefined ){
			$("<div class='row top-pad'><div class='col-md-6 empty'></div><div class='col-md-6 empty'></div></div>").appendTo($('#charts'));
		}
		addModule(chartType)
	}
}

function addModule(chartType){
	// add module to 1st empty div
	var elem = "<div id='"+chartType+"Cont'>";
	chartData[chartType] = getChartData(chartType);

	if ( isChartJSChart(chartType) ) {
		elem += baseCanvas;
		var canvas = "<canvas id='"+chartType+"' width='100' height='100'></canvas>";
	
		$(elem).appendTo($('.empty')[0]);
		$(canvas).appendTo($('.empty .canvas')[0]);
		$($('.empty')[0]).removeClass('empty');

		var chartCTX = document.getElementById(chartType).getContext("2d");
	} else {
		if ( chartType == 'dataViewer' ){
			elem += "<img class='fullscreen' src='Images/fullscreen.png'><p id='"+chartType+"'></p>";
			$(elem).appendTo($('.empty')[0]);
		}
	}
	$($('.empty')[0]).removeClass('empty');

	if ( isChartJSChart(chartType) ) {
		chart[chartType] = new Chart(chartCTX, chartData[chartType]);
	} else {
		if ( chartType == 'dataViewer' ){
			// setupFirebaseData();
		}
	}
}

function getChartData(chartType){
	if (chartType == 'dataViewer'){
		return getFirebaseData();
	} 
	if ( chartType == 'jamming'){
		return chartData['radar']
	}
	if ( chartType == 'packetsSent'){
		return chartData['packetsSent']
	}

	// placeholder until real firebase data is used
	return chartData['line'];
}

function isChartJSChart(chartType){
	if (chartType != 'dataViewer'){
		return true;
	}

	return false;
}