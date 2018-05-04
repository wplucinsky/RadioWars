class Score extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: {...zoom_chart},
			lifetime:  {...lifetime_chart},
			display: [],
		}

		this.teams = [];

		this.processData = this.processData.bind(this);
		this.startTimer = this.startTimer.bind(this);
	}

	componentDidMount(){
		if (TEST_MODE){
			this.startTimer()
		} else {
			var self = this
			socket.on('teams', function (msg) {
				self.processData(JSON.parse(msg.data))
			});
		}
	}

	append(state, place, data){
	/*
		Used to append chart data to the state chart data.
	*/
		let chart = this.state[state];
		if (place == 'data') {
			chart.data.push(data)
		} else if ( place == 'datasets') {
			chart.data.datasets.push(data)
		} else if ( place == 'labels') {
			chart.data.labels.push(data)
		} else (
			chart.push(data)
		)

		return chart;
	}

	processData(data){
	/*
		Takes the updated score data, updates the necessary state objects, which ScoreCanvas
		uses to update the Chart canvas objects.
	*/
		$('#missingscore').css('display','none');
		$('#score').css('display','block');
		$('#colors').css('display','block');

		for (let i in data){
			if ( this.teams.indexOf(data[i].teamname) === -1 ) {
				let nm = data[i].teamname;
				this.teams.push(nm);
				
				this.setState({
					zoom: this.append('zoom', 'datasets', {
						label: nm.charAt(0).toUpperCase() + nm.slice(1) + ' Team',
						backgroundColor: nm,
						borderColor: nm,
						data: Array.apply(null, Array(this.state.zoom.data.labels.length)).map(Number.prototype.valueOf,0),
						fill: false,
					}),
					lifetime: this.append('lifetime', 'datasets', {
						label: nm.charAt(0).toUpperCase() + nm.slice(1) + ' Team',
						backgroundColor: nm,
						borderColor: nm,
						data: Array.apply(null, Array(this.state.lifetime.data.labels.length)).map(Number.prototype.valueOf,0),
						fill: false,
					}),
					display: this.append('display', '', {
						name: nm,
						score: 0,
					})
				});
			}
		}

		this.setState({
			zoom: this.append('zoom', 'labels', 1),
			lifetime: this.append('lifetime', 'labels', 1)
		});

		let zoom = this.state.zoom, lifetime = this.state.lifetime, display = this.state.display;
		for (let i in data){
			for ( let j in zoom.data.datasets ){
				if (zoom.data.datasets[j].backgroundColor == data[i].teamname) {
					$('#'+data[i].teamname+'_score').text(data[i].score)
					zoom.data.datasets[j].data.push(data[i].score)
					lifetime.data.datasets[j].data.push(data[i].score)
					display = display.map(o => {
						if ( o.name == data[i].teamname ){
							o.score = data[i].score
						}
					    return o;
					})
				}

				// limit lifetime data as well to prevent lag
				// cut out every other data pt if > 100?

				if (zoom.data.datasets[j].data.length >= 16) {
					zoom.data.datasets[j].data.shift();
					zoom.data.labels = Array.apply(null, Array(zoom.data.datasets[j].data.length)).map(Number.prototype.valueOf,1)
				}
				zoom.options.title.text = 'Last '+zoom.data.datasets[j].data.length+' Seconds'
			}
		}

		this.setState({
			zoom: zoom,
			lifetime: lifetime,
			display: display,
		});
	}

	startTimer() {
	/*
		Used in TEST_MODE to show that the scoring graph is functional.
		The score increments by a random number between 0 and 4, inclusive.
	*/
		var scores = [{
			teamname: 'blue',
			score: 0
		}, {
			teamname: 'red',
			score: 0
		},{
			teamname: 'green',
			score: 0
		}];
		var self = this;		
		this.timer = window.setInterval(function(){
			for (let i in scores) {
				scores[i].score += Math.floor(Math.random() * 4);
			}
			self.processData(scores)
		}, 2000);
	}

	render() { 
		var style = {
			width: (this.state.display.length * 62)+'px',
		}
		return (
			<div className="row" id="score_graph_container">
				<div className="col-md-12 score-info team_x">
					<h4 className="text-center">Score</h4>
					<div className="line"></div>
					<div id="missingscore">
						<h5 className="text-center">Score Currently Unavailable</h5>
					</div>
					<div id="score">
						<ScoreCanvas recent={false} data={this.state.lifetime} />
						<ScoreCanvas recent={true} data={this.state.zoom} />
						<ScorePrint  data={this.state.display} />
						<div id="colors" style={style}>
							{this.state.display.map((item, key) => {
								return (<ScorePrint data={item} key={key} />);
							})}
						</div>
					</div>
					<div id="colors">

					</div>
				</div>
			</div>
		);
	}
}


// could consolidate zoom_chart and lifetime_chart into one object if this.state would create a copy
const zoom_chart = {
	type: 'line',
	data: {
		labels: [],
		datasets: []
	},
	options: {
		legend: {
			display: false
		},
		responsive: true,
		title: {
			display: true,
			text: 'Lifetime Score'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: false,
				scaleLabel: {
					display: false,
					labelString: 'Month'
				}
			}],
			yAxes: [{
				display: true,
				stacked: false,
				scaleLabel: {
					display: true,
					labelString: 'Value'
				}
			}]
		}
	}
}
const lifetime_chart = {
	type: 'line',
	data: {
		labels: [],
		datasets: []
	},
	options: {
		legend: {
			display: false
		},
		responsive: true,
		title: {
			display: true,
			text: 'Lifetime Score'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: false,
				scaleLabel: {
					display: false,
					labelString: 'Month'
				}
			}],
			yAxes: [{
				display: true,
				stacked: false,
				scaleLabel: {
					display: true,
					labelString: 'Value'
				}
			}]
		}
	}
}