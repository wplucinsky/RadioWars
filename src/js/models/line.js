var line_model = {
		type: 'line',
		data: {
			labels: ["0", "1", "2", "3", "4", "5", "6"],
			datasets: [{
				fill: false,
				borderColor: colors.red,
				backgroundColor: colors.red,
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
				borderColor: colors.blue,
				backgroundColor: colors.blue,
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

line_default = {
	type: 'chart',
	position: 1,
	size: '100x100'
}