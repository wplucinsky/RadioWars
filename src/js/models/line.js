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