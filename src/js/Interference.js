var interference = new Interference();

function Interference(){
	// standard
	this.teams = null;
	this.elem = null;
	this.rects = null;

	// specific
	this.grid = new Grid();
	this.api = new API();
	this.nodes = new Nodes();
	this.control = [];

	this.setup = function(teams, id){
		this.teams = teams;
		this.setElem(id)
		this.grid.setup(teams, id, true);
	}
	
	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		this.subscribeToControl();
		this.scroll()
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
	*/
		var time = 6;
		var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1&i=1"; // used for testing
		var url = "http://dwslgrid.ece.drexel.edu:5000/radioControl";
		this.api.post(url, {
			'_id': 		 'node'+node,
			'type': 	 'jammer',
			'completed': String(false),
			'date': 	 new Date().toISOString(),
			'time': 	 String(time),
			'direction': String(1),
			'rxGain': 	 $('#rxGain_1_knob').val(),
			'txGain': 	 $('#txGain_1_knob').val(),
			'power': 	 $('#power_interference_knob').val(),
			'freq': 	 $('#frequency_interference_knob').val(),
			'nodeToCapture': String(node)
		}, (function(data){
			// add check for valid data
			$('#serverOutputPost').text(JSON.stringify(data));
			
			// won't be necessary b/c of subscribeToControl()
			var i = self.data.graphs.interference.fn;
			n = i.nodes.getNodeLocation(node)
			if (i.control[n] == undefined || i.control[n] == null) {
				i.control[n] = {}
				i.control[n].fn = new InterferenceAnimation();
				i.control[n].fn.startInterference(n, time, i.rects)
			}
		}));
	}	

	this.subscribeToControl = function(){
	/*
		If not in TEST_MODE a SocketIO connection is started to listen for the 
		control event coming from MongoDB. processControl() is called to animate 
		the data.
	*/
		if (!TEST_MODE){
			var self = this
			socket.on('connect/control', function() {
				socket.on('control', function (msg) {
					self.processControl(JSON.parse(msg.data))
				});
			});
		}
	}

	this.processControl = function(data){
	/*
		This function takes the MongoDB data, checks if the user is currently 
		viewing the screen and not on another tab/window then calls
		startInterference() to display the pulsating interference ring.
	*/
		for (let i in data){
			if (document.body.className == 'hidden') { continue; }
			t = new Date(); t.setSeconds(t.getSeconds() - data[i].time); // check if interference hasn't elapsed
			a = new Date(data[i].date); time = (a-t)/1000; // get time remaining
			if (data[i].date >= t.toISOString()) {
				n = self.nodes.getNodeLocation(data[i]._id.replace('node', ''))
				if (data[i].type.toLowerCase() == 'jammer' ) {
					// display interference
					if (self.control[n] == undefined || self.control[n] == null) {
						self.control[n] = {}
						self.control[n].fn = new InterferenceAnimation();
						self.control[n].fn.startInterference(n, time, self.rects)
					}
				}
			}
		}
	}

	this.scroll = function(){
	/*
		Displays a notification at the top of the screen to notify players
		what node interference is running on. Could be changed to a more
		ticker like scroll.

		Future: https://maze.digital/webticker/
	*/
		var t = '', control = self.data.graphs.interference.fn.control;
		for (let i in control){
			if ( control[i] != null ){
				n = self.data.graphs.interference.fn.nodes.getNodeLocationReal(i)
				t = t + 'Interference on Node #'+n+'! '
			}
		}
		if (t != '') {
			$('#scroll').text(t);
			$('.notifications').css('display', 'block');
		} else {
			$('.notifications').css('display', 'none');
		}

		setTimeout(self.data.graphs.interference.fn.scroll, 500)
	}
}

function InterferenceAnimation() {
	this.timer = null;
	this.rect = null;
	this.rects = null;
	this.pos = 1;
	this.canvas = null;
	this.elem = null;

	this.startInterference = function(node, time, rects){
	/*
		Creates a new canvas element in order to animate each node's 
		interference. Will use the previously created element if interference
		has already run on that node.
	*/
		this.rects = rects;
		id = 'interference_'+node;
		classes = self.data.mode == 'viewer' ? 'interference-canvas viewer' : 'interference-canvas';
		if (!$('#'+id).length){
			$('#gridView').append('<canvas id="'+id+'" class="'+classes+'" width="450" height="450" style="padding-top: 50px;"></canvas>')
		}
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
		
		this.startTimer(node, time)
	}

	this.animate = function(node, time) {
	/*
		Animate the pulsating interference ring, called by startTimer().
	*/
		var dist = 150;
		this.elem.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// choose growing or shrinking
		if ( this.rect.width > dist && this.pos == 1 ) {
			this.pos = 0;
		} else if (this.rect.width < 8 && this.pos == 0) {
			this.pos = 1;
		}

		this.rect.width += (this.pos) ? 1 : -1;
		
		this.elem.beginPath();
		this.elem.arc(this.rect.x, this.rect.y, this.rect.width/2, 0, 2 * Math.PI);
		this.elem.strokeStyle = 'orange';
		this.elem.lineWidth=2;
		this.elem.stroke();
		this.elem.closePath();
	}

	this.startTimer = function(node, time) {
	/*
		Starts the timer to update the pulsating ring showing the interference
		animation. 
	*/
		this.setInitialRectParameters(node)
		setTimeout(this.stopTimer, time * 1000, node)

		var i = this;
		this.timer = window.setInterval(function(){
			i.animate(node, time)
		}, 10);
	}

	this.stopTimer = function(node){
	/*
		Stops the timer to mark the end of the interference animation. This data is
		held in the control array in Interference().
	*/
		i = self.data.graphs.interference.fn.control[node].fn
		i.elem.clearRect(0, 0, i.canvas.width, i.canvas.height);
		window.clearInterval(i.timer);

		self.data.graphs.interference.fn.control[node] = null;
	}

	this.setInitialRectParameters = function(node) {
	/*
		Modify the node parametrs so the pulsating ring is centered on the node.
		NOTE: the second addition for the x & y parameters is due to the canvas
		being off center in order to display the full ring.
	*/
		this.rect = Object.assign({}, this.rects[node]);
		this.rect.x += (12.5) + 53;
		this.rect.y += (12.5) + 44;
	}
}