var packetsSent_model = {
	type: 'bar',
	data: {
		datasets: [{
			data: [
				0,
				1
			],
			backgroundColor: [
				colors.green,
				colors.blue
			],
			label: 'Packets Sent/Received'
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
		title: {
			display: false
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [{
				ticks: {
					min: 0,
					max: 100,
				},
				display: false
			}],
			xAxes: [{
				ticks: {
					display: false
				},
				gridLines: {
					display: false
				},
				display: false
			}]
		},
		tooltips: {
			enabled: false
		}
	}
};

packetsSent_default = {
	type: 'chart',
	position: 3,
	size: '100x100'
}