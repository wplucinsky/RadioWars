var keyboard = new Keyboard()

function Keyboard(){
	// standard
	this.canvas = null;
	this.elem = null;
	this.teams = null;
	this.rects = null;

	// specific
	this.eventListeners = null;
	this.grid = new Grid();

	this.setup = function(teams, id){
		this.teams = teams
		this.eventListeners = []
		this.grid.setup(teams, 'grid');
	}

	this.start = function(mode){
		this.rects = this.grid.getRectangles();
		if (mode == 'interference') {
			this.startEventListeners();
		}
	}

	this.stop = function(){
		this.stopEventListeners();
	}

	this.startEventListeners = function(){

	}

	this.stopEventListeners = function(){
		
	}
}