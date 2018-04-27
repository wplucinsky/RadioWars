var keyboard = new Keyboard();

function Keyboard(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;
	this.rects = null;

	// specific
	this.eventListeners = null;
	this.grid = new Grid();
	this.nodes = new Nodes();
	this.currNode = null;
	this.currNodeReal = null;
	this.interference = new Interference();
	this.team = null;
	this.capture = {
		id: 0,
		node: this.currNode,
		fn: new Capture()
	};
	this.control = self.data.controls[1];

	this.setup = function(teams, id){
		this.teams = teams
		this.setElem(id)
		console.log(id)
		this.team = window._id;
		this.currNodeReal = self.data.teams[window._id].radio._id.value;
		this.currNode = this.nodes.getNodeLocation(self.data.teams[window._id].radio._id.value);
		this.grid.setup(teams, id, true);
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
			this.outline();
			this.startEventListeners();
		}
		this.draw(this.currNode, 'black')
	}

	this.stop = function(){
		this.stopEventListeners();
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
	}

	this.startEventListeners = function(){
	/*
		Starts the JS listeners for a variety of keyboard commands.
		
		#helpModal should be updated when additional commands are added.
	*/
		this.eventListeners = document.addEventListener('keydown', function(event){
			var g = self.data.graphs.grid.fn,
				n = self.data.nodes,
				k = self.data.graphs.keyboard.fn,
				m = 0, // move
				s = 0, // select
				i = 0, // interference
				c = 0, // controls
				d = 0, // control direction
				h = 0, // help
				esc = 0,
				nearby = n.getSurroundingNodes(k.currNode),
				j = -1;

			// help modal
			if (event.key == 'h') {
				h=1;
			}
			// move around game board
			if (event.key == 'w') {
				j=0; m=1;
			}
			if (event.key == 'a') {
				j=2; m=1;
			}
			if (event.key == 's') {
				j=4; m=1;
			}
			if (event.key == 'd') {
				j=6; m=1;
			}
			// start interference
			if (event.key == 'i') {
				i=1;
			}
			// select one of the radio controls
			if (event.key == '1') {
				k.control = self.data.controls[1];
				c=1;
			}
			if (event.key == '2') {
				k.control = self.data.controls[2];
				c=1;
			}
			if (event.key == '3') {
				k.control = self.data.controls[3];
				c=1;
			}
			if (event.key == '4') {
				k.control = self.data.controls[4];
				c=1;
			}
			if (event.key == '5') {
				k.control = self.data.controls[5];
				c=1;
			}
			if (event.key == '6') {
				k.control = self.data.controls[6];
				c=1;
			}
			if (event.key == 'ArrowLeft') {
				let index = Object.keys(self.data.controls).filter(function(key) {return self.data.controls[key] === k.control})[0]
				k.control = index == 1 ? self.data.controls[6] : self.data.controls[parseInt(index) - 1];
				c=1;
			}
			if (event.key == 'ArrowRight') {
				let index = Object.keys(self.data.controls).filter(function(key) {return self.data.controls[key] === k.control})[0]
				k.control = index == 6 ? self.data.controls[1] : self.data.controls[parseInt(index) + 1];
				c=1;
			}
			// start node capture
			if (k.capture.id == 0){
				if (event.key == 'c') {
					k.capture.id = 1;
				}
			}
			// controls the radio controls
			if (event.key == 'ArrowUp') {
				c=1; d=1;
			}
			if (event.key == 'ArrowDown') {
				c=1; d=2;
			}
			// select a node
			if (event.key == 'Enter') {
				s=1;
			}
			if (event.key == 'Escape') {
				esc=1;
			}

			if ( h == 1) {
				$('#helpModal').modal();
			}

			if ( esc == 1) {				
				if ( k.capture.id > 0 ){
					k.capture.id = 0;
					$('#gridConfirmChanges').css('display', 'none');
					return k.draw(k.capture.node, 'black');
				} else {
					return k.draw(k.currNode, 'black');
				}
			} else if ( k.capture.id == 1) {
				k.capture.id = 2;
				k.capture.node = k.currNode;
				$('#gridConfirmChanges').css('display', 'block');
				return k.draw(k.currNode, 'green', {dash: 1})
			} else if ( k.capture.id == 3 && s == 1) {
				k.capture.id = 0;
				k.draw(k.capture.node, 'green', {capture: 1, node1: k.capture.node, node2: k.currNode})
				return k.draw(k.capture.node, 'black');
			} else if ( k.capture.id >= 2) {
				if ( j != -1 && nearby[j] != -1 && nearby[j] != k.capture.node) {
					k.capture.id = 3;
					return k.draw(nearby[j], 'black', {redraw: k.capture.node, dash: 1})
				} else {
					k.capture.id = 2;
					return k.draw(k.currNode, 'red', {redraw: k.capture.node, dash: 1})
				}
			}  else if ( m == 1 ) {
				if ( j != -1 && nearby[j] != -1 ) {
					return k.draw(nearby[j], 'black')
				} else {
					return k.draw(k.currNode, 'red')
				}
			} else if ( s == 1) {
				return k.draw(k.currNode, 'green', {select: 1})
			} else if ( i == 1) {
				return k.draw(k.currNode, 'orange', {interference: 1})
			} else if ( c == 1) {
				k.outline()
				if ( d != 0 ){
					k.controls(d);
				}
			}

		})
	}

	this.stopEventListeners = function(){
		this.eventListeners = null;
	}

	this.draw = function(node, color, o){
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
		o = this.processOptions(o);
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
			this.updateTeam()
		} 
		if (o.interference == 1) {
			this.interference.startInterference(this.currNodeReal)
		}
		if (o.capture == 1) {
			this.elem.clearRect(0, 0, this.canvas.width, this.canvas.height);
			$('#gridConfirmChanges').css('display', 'none');
			this.capture.fn.startNodeControl(this.nodes.getNodeLocationReal(o.node1), this.nodes.getNodeLocationReal(o.node2));
		}
		if (o.redraw != -1) {
			return this.draw(o.redraw, 'green', {dash: 1, clear: 0})
		}
	}

	this.outline = function(){
		for ( let i in self.data.controls ){
			if ( self.data.controls[i] == this.control ){
				$('#'+this.control+'_1_knob_text').css({'border-bottom': '4px solid green'});
			} else {
				$('#'+self.data.controls[i]+'_1_knob_text').css({'border-bottom': 'none'});
			}
		}
	}

	this.controls = function(d){
		var step = parseInt($('#'+this.control+'_1_knob').attr('data-step')),
			val  = parseInt($('#'+this.control+'_1_knob').val());
		if ( d == 1) {
			$('#'+this.control+'_1_knob').val(val + step).trigger('change');
		} else if ( d == 2) {
			$('#'+this.control+'_1_knob').val(val - step).trigger('change');
		}
	}

	this.updateTeam = function(){
		this.teams[this.team].team.updateRadio({
			_id: {
				value: this.currNodeReal
			}
		});
	}

	this.processOptions = function(o){
		var base = {select: 0, interference: 0, dash: 0, redraw: -1, clear: 1, capture: 0};
		if ( o == undefined ){
			return base;
		}
		for (let k in base){
			if (! o.hasOwnProperty(k)) {
				o[k] = base[k]
			}
		}
		return o;
	}

	$(".knob").knob({
	    release : function (value) {
	    	// console.log(this.$.attr('id'),':',value);

	    	if (this.$.attr('id').indexOf('interference_') !== -1 ) {
	    		$('#interferenceControlsConfirmChanges').css('display', 'block')
	    	} else {
	    		$('#radioControlsConfirmChanges').css('display', 'block')
	    	}
	    }
	});
}