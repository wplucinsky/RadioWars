var radar_model = {
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
				colors.red,
				colors.yellow,
				colors.green,
				colors.blue,
				colors.purple,
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

radar_default = {
	type: 'chart',
	position: 2,
	size: '100x100'
}