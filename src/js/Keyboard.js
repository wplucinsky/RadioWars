var keyboard = new Keyboard()

function Keyboard(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;
	this.rects = null;

	// specific
	this.currNode = 15;
	this.eventListeners = null;
	this.grid = new Grid();
	this.nodes = new Nodes();
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
		this.eventListeners = document.addEventListener('keydown', function(event){
			var g = self.data.graphs.grid.fn,
				n = self.data.nodes,
				k = self.data.graphs.keyboard.fn,
				m = 0, // move
				s = 0, // select
				nearby = n.getSurroundingNodes(k.currNode),
				i = -1;

			// [ U, UL, L, DL, D, DR, R, UP]
			if (event.key == 'ArrowUp' || event.key == 'w') {
				i=0; m=1;
			}
			if (event.key == 'ArrowLeft' || event.key == 'a') {
				i=2; m=1;
			}
			if (event.key == 'ArrowDown' || event.key == 's') {
				i=4; m=1;
			}
			if (event.key == 'ArrowRight' || event.key == 'd') {
				i=6; m=1;
			}
			if (event.key == 'Enter') {
				s=1;
			}

			if ( m == 1 ) {
				if ( i != -1 && nearby[i] != -1 ) {
					return k.draw(nearby[i], 'black')
				} else {
					return k.draw(k.currNode, 'red')
				}
			} else if ( s == 1) {
				return k.draw(k.currNode, 'green', s)
			}

		})
	}

	this.stopEventListeners = function(){
		this.eventListeners = null;
	}

	this.draw = function(node, color, s){		
		this.elem.clearRect(this.rects[this.currNode].x-5, this.rects[this.currNode].y-5, this.rects[this.currNode].width+13, this.rects[this.currNode].height+13);
		
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+6, this.rects[node].height+6);
		this.elem.strokeStyle = color;
		this.elem.stroke();

		this.currNode = node;

		if (s) {
			this.updateTeam()
		}
	}

	this.updateTeam = function(){
		this.teams[this.team].team.updateRadio({
			_id: {
				value: this.currNode
			}
		});
	}

	$(".knob").knob({
	    release : function (value) {
	        console.log(this.$.attr('id'),':',value);
	    }
	});
}