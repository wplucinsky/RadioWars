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