class KeyboardCanvas extends React.Component {
	constructor(props) {
		super(props);
		this.currNode = window._node;

		this.eventListeners = null;
		this.grid = new Grid();
		this.nodes = new Nodes();
		this.api = new API();
		this.currNode = null;
		this.currNodeReal = null;

		this.draw = this.draw.bind(this)
	}

	componentDidMount(){
		// setup
		this.canvas = document.getElementById('keyboard');
		this.elem = this.canvas.getContext('2d');
		this.currNodeReal = window._node;
		this.currNode = this.nodes.getNodeLocation(window._node);
		this.grid.setup([], 'keyboard', false);

		this.rects = this.grid.getRectangles();

		if (this.props.viewer == undefined || this.props.viewer == 0) {
			this.draw(this.props.draw.id, this.props.draw.color, this.props.draw.options)
		}
	}

	componentWillReceiveProps(nextProps){
		this.props = nextProps;

		if (this.props.draw != null && (this.props.keyboardUpdate || this.props.clickUpdate)) {
			this.draw(this.props.draw.id, this.props.draw.color, this.props.draw.options)
		}
	}

	draw(node, color, o){
	/*
		Draws an outline around a node box.
		Options:
			select: control radio
			interference: start interference
			dash: make outline dashed
			redraw: keep old node
			clear: to clear grid or not
			control: start radio control
	*/	
		o = processOptions(o);
		if (o.clear == 1) {
			this.elem.clearRect(this.rects[this.currNode].x-6, this.rects[this.currNode].y-6, this.rects[this.currNode].width+13, this.rects[this.currNode].height+13);
			this.currNode = node; // javascript layout node
			this.currNodeReal = this.nodes.getNodeLocationReal(node); // grid layout node
		}

		this.elem.beginPath();
		this.elem.rect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+6, this.rects[node].height+6);
		this.elem.strokeStyle = color;
		if (o.dash == 1){
			this.elem.setLineDash([5]);
		} else {
			this.elem.setLineDash([]);
		}
		this.elem.lineWidth=5;
		this.elem.stroke();

		if (o.select == 1) {
			$('#radioControlsConfirmChanges').css('display', 'none');
			this.updateRadio(this.nodes.getNodeLocationReal(node));
		}
		if (o.capture >= 1) {
			this.elem.clearRect(0, 0, this.canvas.width, this.canvas.height);
			$('#gridConfirmChanges').css('display', 'none');
			this.startNodeControl(o.capture, this.nodes.getNodeLocationReal(o.node1), this.nodes.getNodeLocationReal(o.node2));
		}
		if (o.redraw != -1) {
			this.draw(o.redraw, 'green', {dash: 1, clear: 0})
		}
		return true;
	}

	startNodeControl(type, node1, node2){
	/*
		Sends a request to the Flask server to start the node capture
		process. Node1 is capturing Node2. 

		Type
			1: node capture
			2: mgen
	*/
		var self = this, time = 10;
		// var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1&c=1"; // used for testing
		var url = "http://dwslgrid.ece.drexel.edu:5000/radioControl";
		this.api.post(url, {
			'_id': 		 'node'+node1,
			'type': 	 (type == 1) ? 'capture' : 'mgen',
			'completed': String(false),
			'date': 	 new Date().toISOString(),
			'time': 	 String(time),
			'direction': String(1),
			'rxGain': 	 $('#rxGain_'+window._id+'_radio_knob').val(),
			'txGain': 	 $('#txGain_'+window._id+'_radio_knob').val(),
			'power': 	 $('#power_'+window._id+'_radio_knob').val(),
			'freq': 	 $('#frequency_'+window._id+'_radio_knob').val(),
			'nodeToCapture': String(node2)
		}, (function(data){
			if (type == 1){
				$('#gridConfirmation').text('Node #'+node1+' capturing Node #'+node2);
			} else {
				$('#gridConfirmation').text('MGEN started from Node #'+node1+' to Node #'+node2);
			}
			$('#gridConfirmation').css('display', 'block');
			setTimeout((function(){$('#gridConfirmation').text(''); $('#gridConfirmation').css('display', 'none');}), 2000);
			
			self.props.draw.options = {};
			self.draw(self.props.draw.id, 'black', {});
			return true;
		}));	
	}

	updateRadio(node){
	/*	
		Send radio information updates to the Flask Server through the API post(), then 
		call transformData() and setRadio() to display the radio information to the user.
	*/
		var self = this
		// var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1";  // used for testing
		var url = "http://dwslgrid.ece.drexel.edu:5000/radio/"+node;
		this.api.post(url, {
			'_id': 		 		{value: node},
			'rxGain': 	 		{value: $('#rxGain_'+window._id+'_radio_knob').val()},
			'txGain': 	 		{value: $('#txGain_'+window._id+'_radio_knob').val()},
			'normalFrequency': 	{value: $('#frequency_'+window._id+'_radio_knob').val()},
			'power': 	 		{value: $('#power_'+window._id+'_radio_knob').val()},
			'sampleRate': 		{value: $('#sampleRate'+window._id+'_radio_knob').val()},
			'frameSize': 		{value: $('#rxGain_'+window._id+'_radio_knob').val()},
		}, (function(data){
			data = self.transformData(data);
			console.log(data)
			// self.setRadio(data)
		}));
	}

	transformData(data){
	/*
		Transforms the incoming Flask server data to {gamemode}.js format.
	*/
		var d = {};
		for ( let i in data ){
			var t = (i == 'radioDirection' ? 'imgSrc' : 'text');
			d[i] = {}
			d[i].value = data[i]
			d[i].type = t
		}
		return d;
	}
	
	render() { 
		return (
			<canvas id="keyboard" width="600" height="550"></canvas>
		);
	}
}