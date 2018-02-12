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
	this.currNode = 9;
	this.currNodeReal = this.nodes.getNodeLocationReal(this.currNode);
	this.interference = new Interference();
	this.team = 1;
	this.control = self.data.controls[1];

	this.setup = function(teams, id){
		this.teams = teams
		this.setElem(id)
		this.grid.setup(teams, 'grid');
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
				nearby = n.getSurroundingNodes(k.currNode),
				j = -1;

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

			if ( m == 1 ) {
				if ( j != -1 && nearby[j] != -1 ) {
					return k.draw(nearby[j], 'black')
				} else {
					return k.draw(k.currNode, 'red')
				}
			} else if ( s == 1) {
				return k.draw(k.currNode, 'green', s)
			} else if ( i == 1) {
				return k.draw(k.currNode, 'orange', s, i)
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

	this.draw = function(node, color, s, i){		
		this.elem.clearRect(this.rects[this.currNode].x-5, this.rects[this.currNode].y-5, this.rects[this.currNode].width+13, this.rects[this.currNode].height+13);
		
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+6, this.rects[node].height+6);
		this.elem.strokeStyle = color;
		this.elem.stroke();


		this.currNode = node; // javascript layout node
		this.currNodeReal = this.nodes.getNodeLocationReal(node); // grid layout node

		if (s) {
			this.updateTeam()
		} 
		if (i) {
			this.interference.startInterference(this.currNodeReal)
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

	$(".knob").knob({
	    release : function (value) {
	    	$('#confirmChanges').css('display', 'block')
	        // console.log(this.$.attr('id'),':',value);
	    }
	});
}