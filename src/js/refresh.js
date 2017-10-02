/*
	This script is used to update all module data.
*/
	window.onload = function() {
		var countdownCTX = document.getElementById("countdownTimer").getContext("2d");
		chartStatic['countdownTimer'] = new Chart(countdownCTX, chartData['countdownTimer']);

		var lineCTX = document.getElementById("statistics").getContext("2d");
		chart['line'] = new Chart(lineCTX, chartData['line']);

		var radarCTX = document.getElementById("jamming").getContext("2d");
		chart['radar'] = new Chart(radarCTX, chartData['radar']);

		var packetsCTX = document.getElementById("packetsSent").getContext("2d");
		chartStatic['packetsSent'] = new Chart(packetsCTX, chartData['packetsSent']);
	};

	// refresh clock every 1 second
	window.setInterval(function(){
		chartData['countdownTimer'].data.datasets[0].data[0]++;
		chartData['countdownTimer'].data.datasets[0].data[1]--;
		if ( chartData['countdownTimer'].data.datasets[0].data[0] == 100 ){
			chartData['countdownTimer'].data.datasets[0].data[0] = 0;
			chartData['countdownTimer'].data.datasets[0].data[1] = 100;
		}
		chartStatic['countdownTimer'].update();
	}, 1000);

	// refresh graphs with random data every 10 seconds
	window.setInterval(function(){
		for(let chartType in chart) {
			chartData[chartType].data.datasets.forEach(function(dataset) {
				dataset.data = dataset.data.map(function() {
					return randomScalingFactor();
				});
			});
			chart[chartType].update();
		}
	}, 10000);