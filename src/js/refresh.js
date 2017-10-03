/*
	This script is used to set and add all module data. Also used for
	set timing of certain modules.
*/
	window.onload = function() {
		Object.keys(user.modules.active).map(function(m){ 
			if ( user.modules.active[m].type == 'chart' ) {
				var elem = document.getElementById(m).getContext("2d");
				user.modules.active[m].elem = new Chart(elem, user.modules.active[m].data);
			}
		});

		Object.keys(user.modules.default).map(function(m){ 
			if ( user.modules.default[m].type == 'chart' ) {
				var elem = document.getElementById(m).getContext("2d");
				user.modules.default[m].elem = new Chart(elem, user.modules.default[m].data);
			}
		});
	};

	// 1 Second
	window.setInterval(function(){
		countdownTimer(user)
	}, 1000);

	// 10 Seconds
	// window.setInterval(function(){
	// 	for(let chartType in chart) {
	// 		chartData[chartType].data.datasets.forEach(function(dataset) {
	// 			dataset.data = dataset.data.map(function() {
	// 				return randomScalingFactor();
	// 			});
	// 		});
	// 		chart[chartType].update();
	// 	}
	// }, 10000);