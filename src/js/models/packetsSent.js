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