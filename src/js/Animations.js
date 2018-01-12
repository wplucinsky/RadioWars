var animations = new Animations();

function Animations(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;

	// specific
	this.rects = [];
	this.previousData = null;
	this.grid = new Grid();
	this.colors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)',
		black: 'rgb(52, 73, 94)'
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
	/*
		Calls the Flask webserver to retrieve node information from MongoDB then
		calls a variety of animation functions to display this data to the user.
	*/
		this.grid.clearNodeGraph()
		console.clear()
		$.ajax({
			type:"GET",
			url:"http://www.craigslistadsaver.com/cgi-bin/mockdata.php?build=1&c=4",
			// url:"http://dwslgrid.ece.drexel.edu:5000/",
			success: function(data) {
				$('#serverOutput').text(JSON.stringify(data));
				var animationData = [],
					k = 0,
					count = 0;

				for ( let i in data ) {
					animationData[i] = {}
					for ( let j in data[i].packetsReceived) {
						animationData[i][k] = self.data.graphs.animations.fn.getAnimationData(data[i]._id.replace('node',''), j.replace('node',''), data[i].packetsReceived[j]);
						if ( animationData[i][k][0] != undefined ){
							animationData[i][k][0].wait = 0;
							count = count + animationData[i][k][0].count;
							console.log(data[i]._id.replace('node',''), '->', j.replace('node',''), ' \t#'+data[i].packetsReceived[j], ' \t'+animationData[i][k][0].count)
						}
						k++;
					}
					k = 0;
				}
				self.data.graphs.animations.fn.setPreviousData(data);
				self.data.graphs.animations.fn.sendPacket(animationData, count);
			},
			error: function(error) {
				console.log(error)
			},
			dataType: 'json',
		});
	}

	this.getAnimationData = function(from, to, count) {
	/*
		Includes x number of copies of node[from] to node[to] where
		x in the count of new packets received. In the form
		{
			0:{},
			1:{},
			.:{},
			.:{},
			.:{},
			x:{}
		}
		with each object containing the animation data necessary to make
		sendPacket() work.
	*/
		count = this.getDataDifference(from, to, count)
		var animData = {},
			data = {
				xDif:  this.rects[to].x - this.rects[from].x,
				yDif:  this.rects[to].y - this.rects[from].y,
				x: 	   this.rects[from].x + 13,
				y: 	   this.rects[from].y + 13,
				step:  this.getStepSize(from, to),
				cStep: 0,
				from:  from,
				to:    to,
				stop:  0,
				wait:  1,
				color: this.getNodeColor(from),
				count: count
			};
		for (let i = 0; i < count; i++) {
			animData[i] = Object.assign({}, data);
		}
		return animData;
	}

	this.sendPacket = function(data, count) {
	/*
		Goes through the inputted data object to simultaneously display
		packets being sent from node[from] to node[to]. The next packet is
		sent when the preceding packet is a third of the way to it's destination.
	*/
		var elem 	= this.elem;
			rects 	= this.rects,
			w 		= this.canvas.width,
			h 		= this.canvas.height,
			stop 	= 0;

		animate();
		function animate(){
			elem.clearRect(0, 0, w, h);
			for (let i in data) {
				for (let j in data[i]) {
					for (let k in data[i][j]) {
						if (data[i][j][k].wait == 0) {
							elem.beginPath();
							elem.arc(data[i][j][k].x, data[i][j][k].y, 10, 0, 2 * Math.PI);
							elem.fillStyle = data[i][j][k].color;
							elem.fill();
							elem.closePath();

							if ( data[i][j][k].stop != 1 ) {
								data[i][j][k].x += data[i][j][k].xDif / data[i][j][k].step;
								data[i][j][k].y += data[i][j][k].yDif / data[i][j][k].step;
							}

							if ( data[i][j][k].cStep < data[i][j][k].step){
								if ( data[i][j][k].cStep == (data[i][j][k].step - 1)) {
									data[i][j][k].x = rects[data[i][j][k].to].x + 13;
									data[i][j][k].y = rects[data[i][j][k].to].y + 13;

									// change from 1 to some fraction for needed nodes to capture
									this.data.graphs.grid.fn.nodeCapture(1, data[i][j][k].color, null, data[i][j][k].to, true)
								}


								// start next node if it exists
								if ( Math.round(data[i][j][k].step/3) == data[i][j][k].cStep ) {
									if ( data[i][j][parseInt(k)+1] != undefined) {
										data[i][j][parseInt(k)+1].wait = 0;
									}
								}
							} else if ( data[i][j][k].stop == 0) {
								data[i][j][k].stop = 1;
								stop++;
							}
							data[i][j][k].cStep++;
						}
					}
				}
			}

			if (stop < count) {
				requestAnimationFrame(animate);
			} else if (stop == count) {
				stop++;
				requestAnimationFrame(animate);
			} else {
				window.setTimeout(function(){
					self.data.graphs.animations.fn.apiCall();
				}, 3000)
			}
		}
	}

	this.getStepSize = function(from, to) {
	/*
		Calculations for the step size, or speed, of the packets sent across
		the board so all packets travel at the same speed.
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

	this.getNodeColor = function(teamNode){
		if(teamNode == 15) {
			return this.colors.yellow
		}
		if(teamNode == 16) {
			return this.colors.red
		}
		if(teamNode == 17) {
			return this.colors.green
		}
		if(teamNode == 18) {
			return this.colors.blue
		}
		if(teamNode == 19) {
			return this.colors.purple
		}
		if(teamNode == 20) {
			return this.colors.black
		}

		return this.colors.orange;
	}

	this.setPreviousData = function(data){
		this.previousData = data;
	}

	this.getDataDifference = function(from, to, count){
	/*
		This gets the packet count difference from the previous server
		data to the new server data.
	*/
		if ( this.previousData == null ){
			return count;
		} else {
			for ( let i in this.previousData ) {
				for ( let j in this.previousData[i].packetsReceived) {
					if ( from == this.previousData[i]._id.replace('node','') ) {
						if ( to == j.replace('node','') ){
							return Math.max(count - this.previousData[i].packetsReceived[j], 0);
						}
					}
				}
			}
			return count;
		}
	}
}