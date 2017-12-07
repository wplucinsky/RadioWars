var animations = new Animations();

function Animations(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;

	// specific
	this.rects = []
	this.grid = new Grid();
	this.colors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	}

	this.setup = function(teams, id){
		this.teams = teams
		this.setElem(id)
		this.grid.setup(teams,id);
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
			this.apiCall();
		}
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.apiCall = function(){
		$.ajax({
			type:"GET",
			url:"http://www.craigslistadsaver.com/cgi-bin/mockdata.php",
			success: function(data) {
				$('#serverOutput').text(JSON.stringify(data));
				for ( let i in data.packetsReceived) {
					self.data.graphs.animations.fn.sendPacket(data.node_id.replace('node',''),i.replace('node',''));
				}
			},
			error: function(error) {
				console.log(error)
			},
			dataType: 'json',
		});
	}

	this.sendPacket = function(from, to) {
		var elem 	= this.elem;
			rects 	= this.rects,
			xDif 	= rects[to].x - rects[from].x,
			yDif 	= rects[to].y - rects[from].y,
			x 		= rects[from].x + 13,
			y 		= rects[from].y + 13,
			i 		= 0,
			step 	= this.getStepSize(from, to),
			w 		= this.canvas.width,
			h 		= this.canvas.height
			g 		= this.colors.green;

		animate();
		function animate(){
			elem.clearRect(0, 0, w, h);
			elem.beginPath();
			elem.arc(x, y, 10, 0, 2 * Math.PI);
			elem.fillStyle = 'green';
			elem.fill();
			// elem.stroke();
			elem.closePath();

			x += xDif / step;
			y += yDif / step;
			i += 1;

			if ( i < step){
				if ( i == (step - 1)) {
					x = rects[to].x + 13;
					y = rects[to].y + 13;
				}
				requestAnimationFrame(animate);
			} else {
				this.data.graphs.animations.fn.apiCall();
			}
		}
	}

	this.getStepSize = function(from, to) {
	/*
		Controls the step size, or speed, of the packets sent circle.
	*/
		var s 	 = 0,
			xDif = Math.abs(rects[to].x - rects[from].x),
			yDif = Math.abs(rects[to].y - rects[from].y);

		if ( xDif <= 75 ) {
			s = 20;
		} else if ( xDif <= 100 ) {
			s = 25;
		} else if ( xDif <= 200 ){
			s = 35;
		} else {
			s = 45;
		}
		if ( yDif <= 75 ) {
			return Math.max(s, 20);
		} else if ( yDif <= 100 ) {
			return Math.max(s, 25);
		} else if ( yDif <= 200 ){
			return Math.max(s, 35);
		} else {
			return Math.max(s, 45);
		}
	}
}