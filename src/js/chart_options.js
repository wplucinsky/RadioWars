/*
	This script is used to control the data of graph modules.
	
	References:
		http://www.chartjs.org/
*/
	var chartData = [];
	var randomScalingFactor = function() {
		return Math.round(Math.random() * 100);
	};

	window.chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

	/*
		This block loads all the models that are needed for the competition.
	*/
	// $.getScript('src/js/models/countdownTimer.js');
	// $.getScript('src/js/models/line.js');
	// $.getScript('src/js/models/packetsSent.js');
	// $.getScript('src/js/models/radar.js');

	chartData['countdownTimer'] = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: [
					0,
					100
				],
				backgroundColor: [
					"#95a5a6",
					"#34495e"
				],
				label: 'Countdown Timer'
			}],
			labels: [
				"Time Elapsed",
				"Time Remaining"
			]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: false,
				text: 'Countdown Timer'
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			tooltips: {
				enabled: false
			}
		}
	};

	chartData['line'] = {
		type: 'line',
		data: {
			labels: ["0", "1", "2", "3", "4", "5", "6"],
			datasets: [{
				fill: false,
				borderColor: window.chartColors.red,
				backgroundColor: window.chartColors.red,
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			}, {
				label: "My Second dataset ",
				fill: false,
				borderColor: window.chartColors.blue,
				backgroundColor: window.chartColors.blue,
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			}]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: false,
				text: 'Example Chart'
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			tooltips: {
				enabled: false
			}
		}
	};
	
	chartData['radar'] = {
		type: 'polarArea',
		data: {
			datasets: [{
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
				],
				backgroundColor: [
					window.chartColors.red,
					window.chartColors.yellow,
					window.chartColors.green,
					window.chartColors.blue,
					window.chartColors.purple,
				],
				label: 'Radar Plot'
			}],
			labels: [
				"0",
				"1",
				"2",
				"3",
				"4"
			]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: false,
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			tooltips: {
				enabled: false
			}
		}
	};

	chartData['packetsSent'] = {
		type: 'horizontalBar',
		data: {
			datasets: [{
				data: [
					0
				],
				backgroundColor: [
					window.chartColors.green
				],
				label: 'Packets Sent'
			},
			{
				data: [
					0
				],
				backgroundColor: [
					window.chartColors.blue
				],
				label: 'Packets Received'
			}],
			labels: [
				'Sent',
				'Received',
			]
		},
		options: {
			elements: {
				rectangle: {
					borderWidth: 2,
				}
			},
			responsive: true,
			title: {
				display: false,
				text: 'Packets Sent vs. Packets Received'
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					ticks: {
						min: 0,
						max: 100
					}
				}]
			}
		}
	};