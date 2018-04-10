var score = new Score();

function Score(){
	this._teams = []
	this._score = {
		chart: {
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
					text: 'Last 0 Seconds'
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
					}],
					zeroLineColor: '#ffcc33'
				}
			}
		}, chart_total: {
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
	};
	this.setup = function(teams, id){
		this.teams = teams;
		
		this._score.canvas = document.getElementById('scoring').getContext("2d");
		this._score.elem = new Chart(this._score.canvas, this._score.chart);

		this._score.canvas_total = document.getElementById('scoring_total').getContext("2d");
		this._score.elem_total = new Chart(this._score.canvas_total, this._score.chart_total);
	}

	this.start = function(){
		this.subscribeToTeams();
	}

	this.subscribeToTeams = function(){
	/*
		Uses a SocketIO connection to receive the 'teams' message if
		not in TEST_MODE, otherwise calls the startTimer() function. Both
		end up calling processTeams().
	*/
		if (TEST_MODE){
			this.startTimer()
		} else {
			var self = this
			socket.on('teams', function (msg) {
				console.log('[teams]', msg)
				self.processTeams(JSON.parse(msg.data))
			});
		}
	}

	this.processTeams = function(data){
	/*
		Takes the updated score data, append to Chart data object if necessary,
		then updates the Chart data objects.
	*/
		$('#missingscore').css('display','none');
		$('#score').css('display','block');
		$('#colors').css('display','block');

		for (let i in data){
			if ( this._teams.indexOf(data[i].teamname) === -1) {
				nm = data[i].teamname
				this._teams.push(nm)
				this._score.chart.data.datasets.push({
					label: nm.charAt(0).toUpperCase() + nm.slice(1) + ' Team',
					backgroundColor: nm,
					borderColor: nm,
					data: Array.apply(null, Array(this._score.chart.data.labels.length)).map(Number.prototype.valueOf,0),
					fill: false,
				});
				this._score.chart_total.data.datasets.push({
					label: nm.charAt(0).toUpperCase() + nm.slice(1) + ' Team',
					backgroundColor: nm,
					borderColor: nm,
					data: Array.apply(null, Array(this._score.chart_total.data.labels.length)).map(Number.prototype.valueOf,0),
					fill: false,
				});

				$('#colors').css('width', parseInt($('#colors').css('width'), 10) + 58 + 'px')
				$('#colors').append("<div class='color-div'><div style='background-color: "+nm+"'></div><span id='"+nm+"_score'>0</span></div>")
			}
		}



		this._score.chart.data.labels.push(1)
		this._score.chart_total.data.labels.push(1)

		for (let i in data){
			for ( let j in this._score.chart.data.datasets ){
				if (this._score.chart.data.datasets[j].backgroundColor == data[i].teamname) {
					$('#'+data[i].teamname+'_score').text(data[i].score)
					this._score.chart.data.datasets[j].data.push(data[i].score)
					this._score.chart_total.data.datasets[j].data.push(data[i].score)
				}

				if (this._score.chart.data.datasets[j].data.length >= 16) {
					this._score.chart.data.datasets[j].data.shift();
					this._score.chart.data.labels = Array.apply(null, Array(this._score.chart.data.datasets[j].data.length)).map(Number.prototype.valueOf,1)
				}
				this._score.chart.options.title.text = 'Last '+this._score.chart.data.datasets[j].data.length+' Seconds'
			}
		}

		this._score.elem.update()
		this._score.elem_total.update()
	}

	this.startTimer = function(node, time) {
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
		}];
		var self = this;		
		this.timer = window.setInterval(function(){
			for (let i in scores) {
				scores[i].score += Math.floor(Math.random() * 4);
			}
			self.processTeams(scores)
		}, 1000);
	}
}