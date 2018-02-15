var control = new Control();

function Control(){
	// standard
	this.teams = null;
	this.elem = null;
	this.rects = null;

	// specific
	this.grid = new Grid();
	this.api = new API();
	this.nodes = new Nodes();

	this.setup = function(teams, id){
		this.teams = teams;
		// this.setElem(id)
		this.grid.setup(teams, id, true);
	}
	
	this.start = function(mode){
		this.rects = this.grid.getRectangles();
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.startNodeControl = function(node1, node2){
	/*
		Sends a request to the Flask server to start the node capture
		process. Node1 is capturing Node2. 

		TO DO: Update team id.
	*/
		return true;
		var i = this, time = 10;
		var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1&i=1"; // used for testing
		var url = "http://dwslgrid.ece.drexel.edu:5000/radioControl";
		for (var t in this.teams) break;
		this.api.post(url, {
			'_id': 		 'node'+node1,
			'type': 	 'control',
			'completed': String(false),
			'date': 	 new Date().toISOString(),
			'time': 	 String(time),
			'direction': String(1),
			'rxGain': 	 $('#rxGain_1_knob').val(),
			'txGain': 	 $('#txGain_1_knob').val(),
			'power': 	 $('#power_interference_knob').val(),
			'freq': 	 $('#frequency_interference_knob').val(),
			'nodeToCapture': 'node'+node2
		}, (function(data){
			// add check for valid data
			$('#serverOutputPost').text(JSON.stringify(data));
			i.scroll(node, time)
			i.startTimer(i.nodes.getNodeLocation(node), time)
		}));
	}
}