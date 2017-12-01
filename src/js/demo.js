var data = {
	teams: {
		1: {
			information:{
				colorName: "Yellow",
				colorHex: "#f1c40f",
				queue: []
			},
			radio:{
				rxGain: {
					value: "35.0",
					type: "text"
				},
				txGain: {
					value: "35.0",
					type: "text"
				},
				normalFrequency: {
					value: "900e6",
					type: "text"
				},
				sampleRate: {
					value: "250e3",
					type: "text"
				},
				frameSize: {
					value: "1024",
					type: "text"
				},
				nodeId: {
					value: "15",
					type: "text"
				},
				usrpAddress: {
					value: "192.168.11.15",
					type: "text"
				},
				nodeAddress: {
					value: "10.10.10.15",
					type: "text"
				},
				radioDirection: {
					value: "Omni",
					type: "imgSrc"
				},
				captured: {
					value: 0,
					type: "text"
				}
			}
		},
		6: {
			information:{
				colorName: "Black",
				colorHex: "#34495e",
				queue: []
			},
			radio:{
				rxGain: {
					value: "35.0",
					type: "text"
				},
				txGain: {
					value: "35.0",
					type: "text"
				},
				normalFrequency: {
					value: "900e6",
					type: "text"
				},
				sampleRate: {
					value: "250e3",
					type: "text"
				},
				frameSize: {
					value: "1024",
					type: "text"
				},
				nodeId: {
					value: "20",
					type: "text"
				},
				usrpAddress: {
					value: "192.168.11.20",
					type: "text"
				},
				nodeAddress: {
					value: "10.10.10.20",
					type: "text"
				},
				radioDirection: {
					value: "Omni",
					type: "imgSrc"
				},
				captured: {
					value: 0,
					type: "text"
				}
			}
		}
	},
	grid: {
		rectangles: null,
		context: null,
		canvas: null
	},
	graphs: {
		countdownTimer: {
			fn: null
		},
		grid: {
			fn: null
		}
	}
}