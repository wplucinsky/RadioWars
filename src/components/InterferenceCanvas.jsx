class InterferenceCanvas extends React.Component {
	constructor(props) {
		super(props);

		this.grid = new Grid();
		this.api = new API();
		this.currNode = null;
		
		
		this.control = [];
		this.scroll = this.scroll.bind(this);
		this.startInterference = this.startInterference.bind(this);
		this.processControl = this.processControl.bind(this);
	}

	componentDidMount(){
		// setup
		this.canvas = document.getElementById('keyboard');
		this.elem = this.canvas.getContext('2d');
		this.currNode = window._nodes.getNodeLocation(window._node);
		this.grid.setup([], 'keyboard', false);

		this.rects = this.grid.getRectangles();
		this.scroll();

		if (!TEST_MODE){
			var self = this
			socket.on('control', function (msg) {
				self.processControl(JSON.parse(msg.data))
			});
		}
	}

	componentWillReceiveProps(nextProps){
	/*
		Some props will change, some will stay the same. `props.update` determines
		if an update is actually necessary.
	*/
		this.props = nextProps;

		// yellow node outline is drawn in the KeyboardCanvas component
		if (this.props.keyboardUpdate && this.props.draw != undefined && this.props.draw.options != undefined) {
			var o = processOptions(this.props.draw.options);
			if (o.interference == 1) {
				if (DEMO && window._nodes.getNodeLocationReal(this.props.currNode) != 11){
					$('#gridConfirmChanges').text('interference can only be on node 11');
					if ($('#gridConfirmChanges').css('display') == 'none'){
						$('#gridConfirmChanges').css('display', 'block');
						setTimeout((function(){$('#gridConfirmChanges').text(''); $('#gridConfirmChanges').css('display', 'none');}), 2000);
					}
					return;
				}
				this.startInterference(window._nodes.getNodeLocationReal(this.props.currNode))
			}
		}
	}
	
	startInterference(node){
	/*
		Sends a request to the Flask server to start interference on the specified node,
		if the response is successful then an interference animation is drawn for the 
		time specified. When finished the index in this.control is set to null.
	*/
		var time = 17;
		$('#interferenceControlsConfirmChanges').css('display', 'none')

		if (TEST_MODE) {
			let n = window._nodes.getNodeLocation(node)
			if (this.control[n] == undefined || this.control[n] == null) {
				this.control[n] = {}
				this.control[n].fn = new InterferenceAnimation();
				
				var self = this;
				this.control[n].fn.startInterference(n, time, this.rects).then(function(){
					self.control[n] = null;
				});
			}
		} else {
			var url = 'http://'+document.domain+':'+location.port+'/radioControl';
			this.api.post(url, {
				'_id': 		 'node'+node,
				'type': 	 'jammer',
				'completed': String(false),
				'date': 	 new Date().toISOString(),
				'time': 	 String(time),
				'direction': String(1),
				'rxGain': 	 $('#rxGain_'+window._id+'_interference_knob').val() == undefined ? '35' : $('#rxGain_'+window._id+'_interference_knob').val(),
				'txGain': 	 $('#txGain_'+window._id+'_interference_knob').val() == undefined ? '35' : $('#txGain_'+window._id+'_interference_knob').val(),
				'power': 	 $('#power_'+window._id+'_interference_knob').val() == undefined ? '900' : $('#power_'+window._id+'_interference_knob').val(),
				'freq': 	 $('#frequency_'+window._id+'_interference_knob').val() == undefined ? '900' : $('#frequency_'+window._id+'_interference_knob').val(),
				'nodeToCapture': String(node)
			}, (function(data){
				// subscribe to control processes data
				$('#serverOutputPost').text(JSON.stringify(data));
			}));
		}
	}

	processControl(data){
	/*
		This function takes the MongoDB data, checks if the user is currently 
		viewing the screen and not on another tab/window then calls
		InterferenceAnimation->startInterference() to display the pulsating 
		interference ring.
	*/
		var self = this;
		for (let i in data){
			if (document.body.className == 'hidden') { continue; }
			var t = new Date(); t.setSeconds(t.getSeconds() - data[i].time); // check if interference hasn't elapsed
			var a = new Date(data[i].date); var time = (a-t)/1000; // get time remaining
			if (data[i].date >= t.toISOString()) {
				if (data[i].type.toLowerCase() == 'jammer' ) {
					let n = window._nodes.getNodeLocation(data[i]._id.replace('node', ''))
					
					// display interference
					if (self.control[n] == undefined || self.control[n] == null) {
						self.control[n] = {}
						self.control[n].fn = new InterferenceAnimation();
						self.control[n].fn.startInterference(n, time, self.rects).then(function(){
							self.control[n] = null;
						});
					}
				}
			}
		}
	}

	scroll(){
	/*
		Displays a notification at the top of the screen to notify players
		what node interference is running on. Could be changed to a more
		ticker like scroll aka looping.
	*/
		var t = '', control = this.control;
		for (let i in control){
			if ( control[i] != null ){
				var n = window._nodes.getNodeLocationReal(i);
				t = t + 'Interference on Node #'+n+'! '
			}
		}
		if (t != '') {
			$('#scroll').text(t);
			$('.notifications').css('display', 'block');
		} else {
			$('.notifications').css('display', 'none');
		}

		setTimeout(this.scroll, 500)
	}

	render() { 
		return (
			<canvas id="interference" width="650" height="550"></canvas>
		);
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
		interference. Must be 'below' the clickCanvas. Will use the 
		previously created canvas if interference has already run on 
		that node. Returns a promise that's resolved once the animation
		is complete.
	*/
		this.rects = rects;
		let id = 'interference_'+node;
		if (!$('#'+id).length){
			$('#interference').after('<canvas id="'+id+'" class="interference-canvas" width="650" height="650" style="padding-top: 50px;"></canvas>')
		}
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
		
		this.startTimer(node, time)

		var self = this;
		return new Promise(function(resolve, reject) {
			window.setTimeout(function() {
				self.elem.clearRect(0, 0, self.canvas.width, self.canvas.height);
				window.clearInterval(self.timer);
				resolve('done');
			}, time * 1000, node);
		})
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
		animation. The promise in startInterference() stops the timer.
	*/
		this.setInitialRectParameters(node)

		var self = this;
		this.timer = window.setInterval(function(){
			self.animate(node, time)
		}, 10);
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