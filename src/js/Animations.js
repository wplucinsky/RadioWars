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
	this.previousUntouchedData = null;
	this.timer = null;
	this.timerVal = null;
	this.sending = false;
	this.gridDirty = false;
	this.grid = new Grid();
	this.api = new API();
	this.nodes = new Nodes();
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
		this.grid.setup(teams,'grid');
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
			this.apiCallGet(true);
		}
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.apiCallGet = function(start){
	/*
		Calls the API get() to call the Flask webserver to retrieve node information 
		from MongoDB then calls a variety of animation functions to display this data 
		to the user.
		Process
			- check if data changed
			- check if packets were received in the last 2 seconds
				+ if yes, update altered data but don't get animation data
			- get count that can be animated in 1 second
			- start animation
			- update grid and radio information
	*/
		if ( start ){
			this.grid.clearNodeGraph()
			this.stopTimer();
			this.startTimer();
		}
		this.timerVal = new Date();
		// console.clear()
		// console.log(this.m)
		var url = "http://www.craigslistadsaver.com/cgi-bin/interference_demo.php?demo=1&m="+this.m; // used for demo
		// var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?test=1&m="+this.m; // used for testing
		var url = "http://dwslgrid.ece.drexel.edu:5000/";
		var a = this;
		this.api.get(url, (function(data) {
				$('#serverOutputGet').text(JSON.stringify(data));
				if ( data.length != 0 && self.data.graphs.animations.fn.getPreviousUntouchedData() != JSON.stringify(data)){
					a.setPreviousUntouchedData(JSON.stringify(data));
					var animationData = [],
						k = 0,
						count = a.getCount();
					for ( let i in data ) {
						animationData[i] = {}
						old = ((Math.round(new Date()/1000) - data[i].lastPacketRecieved) > 2000 && data[i].lastPacketRecieved != undefined ) ? true : false;
						
						for ( let j in data[i].packetsReceived) {
							var from = data[i]._id.replace('node',''),
								to = j.replace('node','');
							if (a.checkPreviousData()) {
								data[i].packetsReceived[j+'_altered'] = a.getNodeCount(data[i].packetsReceived[j]);
								diff = a.getNodeCount(data[i].packetsReceived[j]);
							} else {
								// total received
								data[i].packetsReceived[j+'_altered'] = a.previousData[i].packetsReceived[j+'_altered'];
								data[i].packetsReceived[j+'_altered'] = data[i].packetsReceived[j+'_altered'] + a.getNodeCount(data[i].packetsReceived[j] - a.previousData[i].packetsReceived[j]);
								// difference
								diff = a.getNodeCount(data[i].packetsReceived[j] - a.previousData[i].packetsReceived[j]);
							}
							if (old || to == 0){
								continue;
							}
							animationData[i][k] = a.getAnimationData(a.nodes.getNodeLocation(from), a.nodes.getNodeLocation(to), diff, i, k, data[i].owner);

							offset = a.getOffset(i,k); // how many packets have been sent so far

							if ( animationData[i][k][offset] != undefined ){
								animationData[i][k][offset].wait = 0;
								count = a.addToCount(diff)

								// console.log(from, '->', to, ' \ttotal '+data[i].packetsReceived[j+'_altered'], ' \tprev '+ offset, ' \tcnt '+ count)
							}
							k++;
						}
						// update team info with radio info
						a.setNodeColor(data)
					}
					if ( a.resetAnimData(animationData) ) {
						a.setPreviousData(data);
						if ( start || !self.data.graphs.animations.fn.sending ){
							a.sendPacket();
						}
					} 
				}
			})
		);
		this.m++;
	}

	this.getAnimationData = function(from, to, count, i, k, color) {
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
		if ( animData === null || animData[i] === null  || animData[i][k] === null || animData[i][k] === undefined ) { 
			offset = 0;
			animData = {};
		} else {
			animData = animData[i][k];
			offset = parseInt(Object.keys(animData)[Object.keys(animData).length-1]);
			if ( isNaN(offset) ){
				offset = 0;
			}
		}
		var data = {
				xDif:  this.rects[to].x - this.rects[from].x,
				yDif:  this.rects[to].y - this.rects[from].y,
				x: 	   this.rects[from].x + 18,
				y: 	   this.rects[from].y + 18,
				step:  30,
				cStep: 0,
				from:  from,
				to:    to,
				stop:  0,
				wait:  1,
				color: (color == undefined) ? 'rgb(201, 203, 207)' : color,
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
		next packet is sent when the preceding packet is a fourth of the way to 
		it's destination.
	*/
		var elem 	= this.elem;
			rects 	= this.rects,
			w 		= this.canvas.width,
			h 		= this.canvas.height,
			stop 	= 0;

		animate();
		self.data.graphs.animations.fn.sending = false;
		function animate(){
			var data = self.data.graphs.animations.fn.getData(),
				count = self.data.graphs.animations.fn.getCount();
			self.data.graphs.animations.fn.sending = true;
			elem.clearRect(0, 0, w, h);
			k1 = Object.keys(data);
			for (let i_k = 0; i_k < k1.length; i_k++) {
				i = k1[i_k]
				k2 = Object.keys(data[i]);
				for (let j_k = 0; j_k < k2.length; j_k++) {
					j = k2[j_k]
					k3 = Object.keys(data[i][j]);
					for (let k_k = 0; k_k < k3.length; k_k++) {
						k = k3[k_k];
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
									data[i][j][k].x = rects[data[i][j][k].to].x + 18;
									data[i][j][k].y = rects[data[i][j][k].to].y + 18;

									// change from 1 to some fraction for needed nodes to capture
									this.data.graphs.grid.fn.nodeCapture(1, data[i][j][k].color, null, data[i][j][k].to, true)
								}


								// start next node if it exists
								if ( Math.round(data[i][j][k].step/4) == data[i][j][k].cStep ) {
									if ( data[i][j][parseInt(k)+1] != undefined) {
										data[i][j][parseInt(k)+1].wait = 0;
									} else {
										// no more packets left to send for this from -> to combo
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
				self.data.graphs.animations.fn.sending = false;
				self.data.graphs.animations.fn.resetCount();
			}
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
		if(teamNode == 9) {
			return this.colors.yellow
		}
		if(teamNode == 10) {
			return this.colors.red
		}
		if(teamNode == 11) {
			return this.colors.green
		}
		if(teamNode == 12) {
			return this.colors.blue
		}
		if(teamNode == 13) {
			return this.colors.purple
		}
		if(teamNode == 14) {
			return this.colors.black
		}

		return this.colors.orange;
	}

	this.getNodeCount = function(dif){
		return Math.min(dif, 8)
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
							return Math.max(count - this.previousData[i].packetsReceived[j+'_altered'], 0);
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
		if ( animData === null || animData[i] === null || animData[i][k] == null ){
			return 0;
		} else {
			animData = animData[i][k];
			k = Object.keys(animData);
			for (let j = 0; j < k.length; j++) {
				if (animData[k[j]].stop == 0){
					return k[j]
				}
			}
		}
		return Object.keys(animData).length
	}

	this.setNodeColor = function(data){
	/*
		Filters the incoming data and the previous data to determine 
		whether a node needs to be colored. The grid on() method is called
		if coloring is needed after the grid nodes are redrawn with
		drawRectangles().
	*/
		var nodes = data.filter(function(val){ return val.owner != undefined; });
		if ( this.previousData != null ) {
			var prev = this.previousData.filter(function(val){ return val.owner != undefined; })
		}
		if ( JSON.stringify(nodes) == JSON.stringify(prev) ){
			return;
		}

		if ( nodes.length > 0 ){
			this.grid.drawRectangles();
		}
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].owner = (nodes[i].owner.toLowerCase() == 'neutral') ? 'rgb(201, 203, 207)' : nodes[i].owner.toLowerCase();
			this.grid.on(this.nodes.getNodeLocation(nodes[i]._id.replace('node','')), nodes[i].owner, 1)
		}
	}

	this.startTimer = function(){
	/*
		Calls the API get() if no call has happened in the last 1500ms.
	*/
		this.timer = window.setInterval(function(){
			self.data.graphs.animations.fn.apiCallGet();
		}, 1500);
	}

	this.stopTimer = function(){
	/*
		Stops the API get() timer.
	*/
		window.clearInterval(this.timer)
	}

	this.resetAnimData = function(animData){
	/*
		Removes entries in animation data that have already animated so the 
		data structure doesn't get too large.
	*/
		k1 = Object.keys(animData);
		for (let i = 0; i < k1.length; i++) {
			k2 = Object.keys(animData[k1[i]]);
			for (let j = 0; j < k2.length; j++) {
				k3 = Object.keys(animData[k1[i]][k2[j]]);
				for (let k = 0; k < k3.length; k++) {
					if (animData[k1[i]][k2[j]][k3[k]].stop == 1) {
						delete animData[k1[i]][k2[j]][k3[k]];
					}
				}
			}
		}
		this.setData(animData);
		return true;
	}

	this.checkPreviousData = function(){
	/*
		TRUE: previous data is not set
		FALSE: previous data was set
	*/
		return this.previousData == null 
				|| this.previousData[i] == undefined 
				|| this.previousData[i].packetsReceived == undefined 
				|| this.previousData[i].packetsReceived[j+'_altered'] == undefined;
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

	this.resetCount = function(){
		this.animCount = 0;
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

	this.setPreviousUntouchedData = function(data){
		this.previousUntouchedData = data;
	}

	this.getPreviousUntouchedData = function(){
		return this.previousUntouchedData;
	}
}