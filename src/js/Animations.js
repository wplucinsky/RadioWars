var animations = new Animations();

function Animations(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;

	// specific
	this.rects = [];
	this.animData = null;
	this.animCount = 0;
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

	// testing
	this.m = 1;

	this.setup = function(teams, id){
		this.teams = teams
		this.setElem(id)
		this.grid.setup(teams,id);
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
			this.apiCall(true);
		}
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.apiCall = function(start){
	/*
		Calls the Flask webserver to retrieve node information from MongoDB then
		calls a variety of animation functions to display this data to the user.
	*/
		if ( start ){
			this.grid.clearNodeGraph()
		}
		console.clear()
		$.ajax({
			type:"GET",
			url:"http://www.craigslistadsaver.com/cgi-bin/mockdata.php?build=1&c=4&m="+this.m, // used for testing
			// url:"http://dwslgrid.ece.drexel.edu:5000/",
			success: function(data) {
				$('#serverOutput').text(JSON.stringify(data));
				if ( data.length != 0 && JSON.stringify(self.data.graphs.animations.fn.getPreviousData()) != JSON.stringify(data)){
					var animationData = [],
						k = 0,
						count = self.data.graphs.animations.fn.getCount();
					for ( let i in data ) {
						animationData[i] = {}
						for ( let j in data[i].packetsReceived) {
							animationData[i][k] = self.data.graphs.animations.fn.getAnimationData(data[i]._id.replace('node',''), j.replace('node',''), data[i].packetsReceived[j], i, k);
							offset = self.data.graphs.animations.fn.getOffset(i,k);
							
							if ( animationData[i][k][offset] != undefined ){
								animationData[i][k][offset].wait = 0;
								count = self.data.graphs.animations.fn.addToCount(Math.max((data[i].packetsReceived[j] - offset), 0))

								// not positive about these console.log values
								console.log(data[i]._id.replace('node',''), '->', j.replace('node',''), ' \ttotal '+data[i].packetsReceived[j], ' \tprev '+ offset, ' \tcnt '+ count)
							}
							k++;
						}
						k = 0;
					}

					self.data.graphs.animations.fn.setData(animationData);
					self.data.graphs.animations.fn.setPreviousData(data);
					if ( start ){
						this.m = this.m + 1;
						self.data.graphs.animations.fn.sendPacket();
					} 
				} else {
					window.setTimeout(function(){
						self.data.graphs.animations.fn.apiCall();
					}, 2000)
				}
			},
			dataType: 'json',
		});
		this.m++; // just used for mock data testing
	}

	$( document ).ajaxError(function( event, request, settings ) {
		$('#serverOutput').text("Error requesting page " + settings.url);
	});

	this.getAnimationData = function(from, to, count, i, k) {
	/*
		Adds x number of copies of node[from] to node[to] where
		x in the total count of new packets received. In the form
		{
			0:{},
			1:{},
			.:{},
			.:{},
			.:{},
			x:{}
		}
		with each object containing the animation data necessary to make
		sendPacket() work. It appends it to the global getData() and returns.
	*/
		animData = this.getData();
		if ( animData === null ) {
			offset = 0;
			animData = {};
		} else {
			animData = animData[i][k];
			count = Math.max(count - Object.keys(animData).length, 0);
			offset = Object.keys(animData).length;
		}
		var data = {
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
		for (let j = offset; j < (count + offset); j++) {
			animData[j] = Object.assign({}, data);
		}

		return animData;
	}

	this.sendPacket = function() {
	/*
		Called once at the beginning and continues to run on global data while 
		the packets sent count is less than the total packets sent count. The 
		next packet is sent when the preceding packet is a third of the way to 
		it's destination.
	*/
		var elem 	= this.elem;
			rects 	= this.rects,
			w 		= this.canvas.width,
			h 		= this.canvas.height,
			stop 	= 0;

		animate();
		function animate(){
			var data = self.data.graphs.animations.fn.getData(),
				count = self.data.graphs.animations.fn.getCount();
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
									} else {
										// no more packets left to send for this from -> to combo
										self.data.graphs.animations.fn.apiCall();
									}
								}
							} else if ( data[i][j][k].stop == 0) {
								data[i][j][k].stop = 1;
								data[i][j][k].wait = 1;
								stop++;
							}
							data[i][j][k].cStep++;
						}
					}
				}
			}

			self.data.graphs.animations.fn.setData(data);
			if (stop < count) {
				requestAnimationFrame(animate);
			} else if (stop == count) {
				stop++;
				requestAnimationFrame(animate);
			} else {
				// every packets has finished sending
				// self.data.graphs.animations.fn.apiCall(true);
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
		if(teamNode == 6) {
			return this.colors.yellow
		}
		if(teamNode == 7) {
			return this.colors.green
		}
		if(teamNode == 8) {
			return this.colors.red
		}
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

	this.getData = function(){
		return this.animData;
	}

	this.setData = function(data){
		this.animData = data;
	}

	this.getCount = function(){
		return this.animCount;
	}

	this.setCount = function(data){
		this.animCount = data;
	}

	this.addToCount = function(amt){
		this.animCount = this.animCount + amt;
		return this.animCount;
	}

	this.setPreviousData = function(data){
		this.previousData = data;
	}

	this.getPreviousData = function(){
		return this.previousData;
	}

	this.getDataDifference = function(from, to, count){
	/*
		This gets the packet count difference from the previous server
		data to the new server data. 

		NOTE: not really used anymore now that global data is being used
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

	this.getOffset = function(i, k) {
	/*
		This gets the spot to edit/insert the new packets in the global 
		data object, can be though of as a difference function.
	*/
		animData = this.getData();
		if ( animData === null ){
			return 0;
		} else {
			animData = animData[i][k]
			for (let j = 0; j < (Object.keys(animData).length - 1); j++) {
				if (animData[j].stop == 0){
					return j
				}
			}
		}
		return Object.keys(animData).length
	}
}