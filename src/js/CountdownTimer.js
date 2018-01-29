var countdownTimer = new countdownTimer();

function countdownTimer() {
	// standard
	this.teams = null;
	this.elem = null;

	// specific
	this.timer = null;
	this.data = {
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
	}

	this.setup = function(teams, id){
		this.setElem(id);
	}

	this.start = function(){
		this.timer = window.setInterval(function(){
			update();
		}, 1000);
	}

	this.stop = function(){
		window.clearInterval(this.timer);
	}

	this.getData = function(){
		return this.data;
	}

	this.setData = function(data){
		this.data = data;
	}

	this.setElem = function(id){
		var elem = document.getElementById(id).getContext("2d");
		this.elem = new Chart(elem, this.data);
	}

	function update(){
		this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[0]++;
		this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[1]--;
		if ( this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[0] == 100 ){
			this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[0] = 0;
			this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[1] = 100;
		}

		$('#countdownTimerValue').removeClass();
		$('#countdownTimerValue').addClass('digits_'+(((this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[1]).toString()).length))
		$('#countdownTimerValue').html(this.data.graphs.countdownTimer.fn.data.data.datasets[0].data[1])

		this.data.graphs.countdownTimer.fn.elem.update();
	}
};