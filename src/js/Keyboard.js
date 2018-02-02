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

	this.setup = function(teams, id){
		this.teams = teams
		this.setElem(id)
		this.grid.setup(teams, 'grid');
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
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
				i = 0, // interference,
				c = 0, // controls
				nearby = n.getSurroundingNodes(k.currNode),
				j = -1;

			// [ U, UL, L, DL, D, DR, R, UP]
			if (event.key == 'ArrowUp' || event.key == 'w') {
				j=0; m=1;
			}
			if (event.key == 'ArrowLeft' || event.key == 'a') {
				j=2; m=1;
			}
			if (event.key == 'ArrowDown' || event.key == 's') {
				j=4; m=1;
			}
			if (event.key == 'ArrowRight' || event.key == 'd') {
				j=6; m=1;
			}
			if (event.key == 'i') {
				i=1;
			}
			// select one of the controls
			// if (event.key == 'u') {
			// 	c=1;
			// }
			// if (event.key == 'i') {
			// 	c=1;
			// }
			// if (event.key == 'o') {
			// 	c=1;
			// }
			// if (event.key == 'j') {
			// 	c=1;
			// }
			// if (event.key == 'k') {
			// 	c=1;
			// }
			// if (event.key == 'l') {
			// 	c=1;
			// }
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
	        console.log(this.$.attr('id'),':',value);
	    }
	});
}