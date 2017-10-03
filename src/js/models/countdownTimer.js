var countdownTimer_model = {
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

countdownTimer_default = {
	type: 'chart',
	position: 1,
	size: '100x100'
}