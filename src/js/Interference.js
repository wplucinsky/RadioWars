var interference = new Interference();

function Interference(){
	// standard
	this.teams = null;
	this.elem = null;
	this.rects = null;

	// specific
	this.grid = new Grid();
	this.api = new API();
	this.timer = null;
	this.rect = null;
	this.pos = 1;

	this.setup = function(teams, id){
		this.teams = teams;
		this.setElem(id)
		this.grid.setup(teams,id);
	}
	
	this.start = function(mode){
		this.rects = this.grid.getRectangles();
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.startInterference = function(node){
	/*
		Sends a request to the Flask server to start interference on the specified node,
		if the response is successful then an interference animation is drawn for the 
		time specified.

		TO DO: Update team id.
	*/
		var i = this, time = 10;
		var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1&i=1"; // used for testing
		// var url = "http://dwslgrid.ece.drexel.edu:5000/interference";
		for (var t in this.teams) break;
		this.api.post(url, {
			'type': 	'Interference',
			'_id': 		node,
			'power': 	$('#power_interference_knob').val(),
			'freq': 	$('#frequency_interference_knob').val(),
			'time': 	time
		}, (function(data){
			// add check for valid data
			$('#serverOutputPost').text(JSON.stringify(data));
			i.scroll(node, time)
			i.startTimer(node, time)
		}))
	}	

	this.animate = function(node, time) {
	/*
		Animate the pulsating interference ring, called by startTimer().
	*/
		var i = self.data.graphs.interference.fn;
		i.elem.clearRect(i.rect.x-42, i.rect.y-42, i.rect.width+45, i.rect.height+45);

		// choose growing or shrinking
		if ( i.rect.width > 50 && i.pos == 1 ) {
			i.pos = 0;
		} else if (i.rect.width < 8 && i.pos == 0) {
			i.pos = 1;
		}

		i.rect.width += (i.pos) ? 1 : -1;
		
		i.elem.beginPath();
		i.elem.arc(i.rect.x, i.rect.y, i.rect.width/2, 0, 2 * Math.PI);
		i.elem.strokeStyle = 'orange';
		i.elem.stroke();
		i.elem.closePath();
	}

	this.startTimer = function(node, time) {
	/*
		Starts the timer to update the pulsating ring showing the interference
		animation. 
	*/
		this.setInitialRectParameters(node)
		setTimeout(this.stopTimer, time * 1000)

		var i = this;
		self.data.graphs.interference.fn.timer = window.setInterval(function(){
			i.animate(node, time)
		}, 25);
	}

	this.stopTimer = function(){
	/*
		Stops the timer to mark the end of the interference animation.
	*/
		i = self.data.graphs.interference.fn
		i.elem.clearRect(i.rect.x-42, i.rect.y-42, i.rect.width+45, i.rect.height+45);
		window.clearInterval(i.timer);
	}

	this.scroll = function(node, time){
	/*
		Displays a notification at the top of the screen to notify players
		what node interference is running on.
	*/
		setTimeout(function(){$('.notifications').css('display', 'none');}, time * 1000)
		
		$('#scroll').text('Interference on Node #'+node+'!');
		$('.notifications').css('display', 'block');
	}

	this.setInitialRectParameters = function(node) {
	/*
		Modify the node parametrs so the pulsating ring is centered on the node.
		NOTE: the second addition for the x & y parameters is due to the canvas
		being off center in order to display the full ring.
	*/
		var i = self.data.graphs.interference.fn;
		i.rect = Object.assign({}, i.rects[node]);
		i.rect.x += (12.5) + 48;
		i.rect.y += (12.5) + 40;
	}
}