class AnimationsCanvas extends React.Component {
	constructor(props) {
		super(props);

		this.grid = new Grid();
		this.api = new API();
		this.currNode = null;
		this.m = 18;
		this.animCount = 0;
		this.timer = null;
		
		
		this.control = [];
		this.apiCallGet = this.apiCallGet.bind(this);
	}

	componentDidMount(){
		// setup
		this.canvas = document.getElementById('animations');
		this.elem = this.canvas.getContext('2d');
		this.currNode = window._nodes.getNodeLocation(window._node);
		this.grid.setup([], 'grid', undefined);
		this.rects = this.grid.getRectangles();
		this.apiCallGet(true);
	}

	componentWillUnmount(){
		clearTimeout(this.timer);
	}

	componentWillReceiveProps(nextProps){
		this.props = nextProps;
	}

	apiCallGet(start){
	/*
		If in test mode uses the API get(), if in production uses a SocketIO 
		connection. Both call the Flask webserver to retrieve node information from 
		MongoDB then calls processData() to trigger a variety of animation 
		functions to display this data to the user.
	*/
		if ( start ){
			this.grid.clearNodeGraph()
			window.clearInterval(this.timer)
		}
		
		var self = this;

		if (TEST_MODE) {
			var url = "http://www.craigslistadsaver.com/cgi-bin/interference_demo.php?demo=1&m="+this.m; // used for demo
			// var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?test=1&m="+this.m; // used for testing
			// var url = "http://dwslgrid.ece.drexel.edu:5000/dump"

			if (start) {this.startTimer();}
			this.api.get(url, function(data) {
				self.props.returnData(data);
				self.processData(data, start)
			});
		} else {
			var self = this
			socket.on('gridNodes', function (msg) {
				self.props.returnData(JSON.parse(msg.data));
				self.processData(JSON.parse(msg.data))
			});
		}
		this.m++;
	}

	processData(data, start){
	/*
		Takes the MongoDB data and triggers a variety of animation functions to display 
		this data to the user.
		Process
			- check if data changed
			- check if packets were received in the last 2 seconds
				+ if yes, update altered data but don't get animation data
			- get count that can be animated in 1 second
			- start animation
			- update grid and radio information
	*/
		var self = this;
		$('#serverOutputGet').text(JSON.stringify(data));
		if ( data != null && self.getPreviousUntouchedData() != JSON.stringify(data)){
			this.setPreviousUntouchedData(JSON.stringify(data));
			var animationData = [],
				k = 0,
				count = this.getCount();
			for ( let i in data ) {
				animationData[i] = {}
				let old = ((Math.round(new Date()/1000) - data[i].lastPacketRecieved) > 2000 && data[i].lastPacketRecieved != undefined ) ? true : false;
				
				for ( let j in data[i].packetsReceived) {
					var from = data[i]._id.replace('node',''),
						to = j.replace('node','');
					if (this.checkPreviousData(i, j)) {
						data[i].packetsReceived[j+'_altered'] = this.getNodeCount(data[i].packetsReceived[j]);
						var diff = this.getNodeCount(data[i].packetsReceived[j]);
					} else {
						// total received
						data[i].packetsReceived[j+'_altered'] = this.previousData[i].packetsReceived[j+'_altered'];
						data[i].packetsReceived[j+'_altered'] = data[i].packetsReceived[j+'_altered'] + this.getNodeCount(data[i].packetsReceived[j] - this.previousData[i].packetsReceived[j]);
						// difference
						var diff = this.getNodeCount(data[i].packetsReceived[j] - this.previousData[i].packetsReceived[j]);
					}
					if (old || to == 0){
						continue;
					}
					animationData[i][k] = this.getAnimationData(window._nodes.getNodeLocation(from), window._nodes.getNodeLocation(to), diff, i, k, data[i].owner);

					var offset = this.getOffset(i,k); // how many packets have been sent so far
					
					if ( animationData[i][k][offset] != undefined ){
						animationData[i][k][offset].wait = 0;
						count = this.addToCount(diff)

						// console.log(from, '->', to, ' \ttotal '+data[i].packetsReceived[j+'_altered'], ' \tprev '+ offset, ' \tcnt '+ count)
					}
					k++;
				}
				// update team info with radio info
				this.setNodeColor(data)
			}
			if ( this.resetAnimData(animationData) ) {
				this.setPreviousData(data);
				if ( start || !self.sending ){
					this.sendPacket();
				}
			} 
		}
	}

	getAnimationData(from, to, count, i, k, color) {
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
		var animData = this.getData();
		if ( animData == null || animData == undefined || animData[i] == undefined  || animData[i][k] == undefined ) { 
			var offset = 0;
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

	sendPacket() {
	/*
		Called once at the beginning and continues to run on global data while 
		the packets sent count is less than the total packets sent count. The 
		next packet is sent when the preceding packet is a fourth of the way to 
		it's destination.
	*/
		var elem 	= this.elem,
			rects 	= this.rects,
			w 		= this.canvas.width,
			h 		= this.canvas.height,
			stop 	= 0;

		var self = this;
		animate();
		
		
		self.sending = false;
		function animate(){
			var data = self.getData(),
				count = self.getCount();
			self.sending = true;
			elem.clearRect(0, 0, w, h);
			var k1 = Object.keys(data);
			for (let i_k = 0; i_k < k1.length; i_k++) {
				if (document.body.className == 'hidden') { continue; }
				var i = k1[i_k],
					k2 = Object.keys(data[i]);
				for (let j_k = 0; j_k < k2.length; j_k++) {
					var j = k2[j_k],
						k3 = Object.keys(data[i][j]);
					for (let k_k = 0; k_k < k3.length; k_k++) {
						var k = k3[k_k];
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
									// self.grid.nodeCapture(1, data[i][j][k].color, null, data[i][j][k].to, true)
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

			self.setData(data);
			if (stop < count) {
				requestAnimationFrame(animate);
			} else if (stop == count) {
				stop++;
				requestAnimationFrame(animate);
			} else {
				// every packets has finished sending
				self.sending = false;
				self.resetCount();
			}
		}
	}

	getNodeCount(dif){
		return Math.min(dif, 8)
	}

	getDataDifference(from, to, count){
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

	getOffset(i, k) {
	/*
		This gets the spot to edit/insert the new packets in the global 
		data object, can be though of as a difference function.
	*/
		var animData = this.getData();
		if ( animData == null || animData == undefined || animData[i] == undefined || animData[i][k] == undefined ){
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

	setNodeColor(data){
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
			window._nodes.takeNode(nodes[i]._id.replace('node',''), nodes[i].owner);
			this.grid.on(window._nodes.getNodeLocation(nodes[i]._id.replace('node','')), nodes[i].owner, 1);
		}
	}

	startTimer(){
	/*
		Calls the API get() if no call has happened in the last 1500ms. Only
		used when in TEST_MODE.
	*/
		var self = this;
		this.timer = window.setInterval(function(){
			self.apiCallGet();
		}, 1500);
	}

	resetAnimData(animData){
	/*
		Removes entries in animation data that have already animated so the 
		data structure doesn't get too large.
	*/
		var k1 = Object.keys(animData);
		for (let i = 0; i < k1.length; i++) {
			var k2 = Object.keys(animData[k1[i]]);
			for (let j = 0; j < k2.length; j++) {
				var k3 = Object.keys(animData[k1[i]][k2[j]]);
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

	checkPreviousData(i, j){
	/*
		TRUE: previous data is not set
		FALSE: previous data was set
	*/
		return this.previousData == null 
				|| this.previousData[i] == undefined 
				|| this.previousData[i].packetsReceived == undefined 
				|| this.previousData[i].packetsReceived[j+'_altered'] == undefined;
	}

	getData(){
		return this.animData;
	}

	setData(data){
		this.animData = data;
	}

	getCount(){
		return this.animCount;
	}

	resetCount(){
		this.animCount = 0;
	}

	setCount(data){
		this.animCount = data;
	}

	addToCount(amt){
		this.animCount = this.animCount + amt;
		return this.animCount;
	}

	setPreviousData(data){
		this.previousData = data;
	}

	getPreviousData(){
		return this.previousData;
	}

	setPreviousUntouchedData(data){
		this.previousUntouchedData = data;
	}

	getPreviousUntouchedData(){
		return this.previousUntouchedData;
	}
	
	render() { 
		return (
			<canvas id="animations" width="600" height="550"></canvas>
		);
	}
}