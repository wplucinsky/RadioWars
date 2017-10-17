var bitsLeft_model = {
	type: 'horizontalBar',
	data: {
		datasets: [{
			data: [
				90
			],
			backgroundColor: [
				colors.green
			],
			label: 'Bits Left'
		},{
			data: [
				10
			],
			backgroundColor: [
				colors.blue
			],
			label: 'Bits Sent'
		}],
		labels: [
			'Tx: 0',
			'Rx: 0'
		]
	},
	options: {
		elements: {
			rectangle: {
				borderWidth: 2,
			}
		},
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: false
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [{
				stacked: true,
				display: false
			}],
			xAxes: [{
				ticks: {
					display: false
				},
				gridLines: {
					display: false
				},
				display: false,
				stacked: true
			}]
		},
		tooltips: {
			enabled: false
		}
	}
};

bitsLeft_default = {
	type: 'chart',
	position: 3,
	size: '100x100'
}