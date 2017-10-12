/*
	This script is used to initalize the user and start the firebase connection.

	4x4 grid with blinking colors and packets moving
*/
	var competitionTime = '123456789';

	var user = {
		name: 'Will Plucinsky',
		group: {
			id: 7,
			name: 'Senior Design'
		},
		nodes: {
			available: ['01', '03', '05', '11', '13'],
			active: ['01', '03', '05', '11', '13'],
			connected: [],
			control: ['11']
		},
		modules: {
			available: ['statistics', 'jamming', 'video', 'dataViewer', 'packetsSent11', 'packetsSent01'],
			active: {
				statistics: {
					type: 'chart',
					node: 11,
					position: 1,
					size: '400x400'
				}, 
				jamming: {
					type: 'chart',
					node: 11,
					position: 2,
					size: '400x400'
				},  
				dataViewer: {
					node: 11,
					position: 3,
					size: '400x400'
				},  
				packetsSent11: {
					type: 'chart',
					node: 11,
					position: 4,
					size: '400x400'
				},
				packetsSent01: {
					type: 'chart',
					node: 1,
					position: 4,
					size: '400x400'
				},
				gridView: {
					type: 'custom',
					position: 5,
					size: '400x400'
				}
			},
			default: {
				countdownTimer: {
					type: 'chart',
					position: 1,
					size: '100x100'
				}
			}
		}
	}
	console.log(user)

	var config = {
		apiKey: "AIzaSyA7XkhEaCGCwkGzti8hRkv7kZR7_hoalp4",
		authDomain: "dwslgrid.firebaseapp.com",
		databaseURL: "https://dwslgrid.firebaseio.com",
		projectId: "dwslgrid",
		storageBucket: "dwslgrid.appspot.com",
		messagingSenderId: "222394513574"
	};
	firebase.initializeApp(config)

	var colors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

	var model_lookup = {
		statistics: 'line',
		jamming: 'radar',
		video: 'line',
		logs: 'radar',
		packetsSent11: 'packetsSent',
		packetsSent01: 'packetsSent',
		gridView: 'gridView'
	}

	var models = []


	var randomScalingFactor = function() {
		return Math.round(Math.random() * 100);
	};