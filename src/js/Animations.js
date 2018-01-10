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
			// url:"http://dwslgrid.ece.drexel.edu:5000/",
			success: function(data) {
				$('#serverOutput').text(JSON.stringify(data));
				// log previous and get difference , alter received text
				var animationData = [];
				var j = 0;
				for ( let i in data[0].packetsReceived) {
					console.log(data[0]._id.replace('node',''), '->', i.replace('node',''))
					animationData[j] = self.data.graphs.animations.fn.getAnimationData(data[0]._id.replace('node',''),i.replace('node',''));
					j++;
				}
				self.data.graphs.animations.fn.sendPacket(animationData);
				// [{"packetsSent":{"node2":"4","node4":"2"},"_id":"node1","packetsRecieved":{"node2":"2"},"power":"1"},{"packetsSent":{"node2":"4","node4":"2"},"_id":"node6","packetsRecieved":{"node2":"2"},"power":"2.1"}]
			},
			error: function(error) {
				console.log(error)
			},
			dataType: 'json',
		});
	}

	this.getAnimationData = function(from, to) {
		return {
			xDif: this.rects[to].x - this.rects[from].x,
			yDif: this.rects[to].y - this.rects[from].y,
			x: 	  this.rects[from].x + 13,
			y: 	  this.rects[from].y + 13,
			step: this.getStepSize(from, to),
			from: from,
			to:   to,
			stop: 0
		}
	}

	this.sendPacket = function(data) {
		var elem 	= this.elem;
			rects 	= this.rects,
			j 		= 0,
			w 		= this.canvas.width,
			h 		= this.canvas.height,
			g 		= this.colors.green,
			stop 	= 0;

		animate();
		function animate(){
			elem.clearRect(0, 0, w, h);
			for (let i in data) {
				elem.beginPath();
				elem.arc(data[i].x, data[i].y, 10, 0, 2 * Math.PI);
				elem.fillStyle = 'green';
				elem.fill();
				// elem.stroke();
				elem.closePath();

				if ( data[i].stop != 1 ) {
					data[i].x += data[i].xDif / data[i].step;
					data[i].y += data[i].yDif / data[i].step;
				}

				if ( j < data[i].step){
					if ( j == (data[i].step - 1)) {
						data[i].x = rects[data[i].to].x + 13;
						data[i].y = rects[data[i].to].y + 13;
					}
				} else if ( data[i].stop == 0) {
					data[i].stop = 1;
					stop++;
				}
			}
			j += 1;

			if (stop != data.length) {
				requestAnimationFrame(animate);
			} else {
				// this.data.graphs.animations.fn.apiCall();
			}
		}
	}

	this.getStepSize = function(from, to) {
	/*
		Controls the step size, or speed, of the packets sent circle.
	*/
		var s 	 = 0,
			xDif = Math.abs(this.rects[to].x - this.rects[from].x),
			yDif = Math.abs(this.rects[to].y - this.rects[from].y);

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