function Nodes(){
/*
	Old Javascript Formation
		15 	0	5	10	18
			1	6	11
		16	2	7	12 	19
		 	3 	8 	13
		17	4	9	14	20
	Javascript Formation
		9 	0		5	12
			1		6
		10	2	4	7 	13
		 	3 	 	8
		11				14 	

	Actual Formation
		10 	18		12	16
			13		8
		14	9		6 	17
		 	11 	50 	7
		5				15 	
*/
	this.takenNodes = [];
	// this.direction = ['Up', 'UpLeft', 'Left', 'DownLeft', 'Down', 'DownRight', 'Right', 'Up'];
	this.direction = ['Up', 'Left', 'Left', 'Left', 'Down', 'Right', 'Right', 'Up'];

	this.takeNode = function(node_id) {
		this.takenNodes.push(node_id);
	}

	this.untakeNode = function(node_id) {
		delete this.takenNodes[this.takenNodes.indexOf(node_id)];
	}

	this.getTakenNodes = function(){
		return this.takenNodes
	}

	this.getSurroundingNodes = function(node_id) {
	/*
		Gets the nodes around the inputted node in the form
			[ U, UL, L, DL, D, DR, R, UP]
	*/
		if (node_id == 9) {	// yellow start
			return [ -1, -1, -1, -1, 10, -1, 0, -1];
		} 
		if ( node_id == 10) {	// red start
			return [ 9, -1, -1, -1, 11, -1, 2, -1];
		}
		if ( node_id == 11) {	// green start
			return [ 10, -1, -1, -1, -1, -1, 3, -1];
		}
		if ( node_id == 12) {	// blue start
			return [ -1, -1, 5, -1, 13, -1, -1, -1];
		}
		if ( node_id == 13) {	// purple start
			return [ 12, -1, 7, -1, 14, -1, -1, -1];
		}
		if ( node_id == 14) {	// black start
			return [ 13, -1, 8, -1, -1, -1, -1, -1];
		}
		if ( node_id == 0 ){
			return [ -1, -1, 9, -1, 1, 6, 5, -1];
		}
		if ( node_id == 1 ){
			return [ 0, -1, -1, -1, 2, 4, 6, 0];
		}
		if ( node_id == 2 ){
			return [ 1, -1, 10, -1, 3, 8, 4, 1];
		} 
		if ( node_id == 3 ){
			return [ 2, -1, 11, -1, -1, 8, 8, 2];
		} 
		if ( node_id == 4 ){
			return [ -1, 2, 2, 3, -1, 8, 7, -1];
		}
		if ( node_id == 5 ){
			return [ -1, -1, 0, 1, 6, 11, 12, -1];
		} 
		if ( node_id == 6 ){
			return [ 5, 0, 1, 2, 7, 12, -1, 5];
		}
		if ( node_id == 7 ){
			return [ 6, 1, 4, 3, 8, 13, 13, 6];
		}
		if ( node_id == 8 ){
			return [ 7, 2, 3, 4, -1, 14, 14, 7];
		} 
		if ( node_id == 9 ){
			return [ 8, 3, 4, -1, -1, -1, 14, 8];
		} 
		if ( node_id == 10 ){
			return [ -1, -1, 5, 6, 11, -1, 18, -1];
		}
		if ( node_id == 11 ){
			return [ 10, 5, 6, 7, 12, -1, -1, 10];
		}
		if ( node_id == 12 ){
			return [ 11, 6, 7, 8, 13, -1, 19, 11];
		} 
		if ( node_id == 13 ){
			return [ 12, 7, 8, 9, 14, -1, -1, 12];
		} 
		if ( node_id == 14 ){
			return [ 13, 8, 9, -1, -1, -1, 20, 13];
		}
	}

	this.getNodeLocation = function(node_id){
	/*
		Goes from real grid node layout to Javascript grid layout.
	*/
		if ( node_id == 10 ){
			return 9;
		}
		if ( node_id == 14 ){
			return 10;
		}
		if ( node_id == 5 ){
			return 11;
		}
		if ( node_id == 18 ){
			return 0;
		}
		if ( node_id == 13 ){
			return 1;
		}
		if ( node_id == 9 ){
			return 2;
		}
		if ( node_id == 11 ){
			return 3;
		}
		if ( node_id == 50 ){
			return 4;
		}
		if ( node_id == 12 ){
			return 5;
		}
		if ( node_id == 8 ){
			return 6;
		}
		if ( node_id == 6 ){
			return 7;
		}
		if ( node_id == 7 ){
			return 8;
		}
		if ( node_id == 16 ){
			return 12;
		}
		if ( node_id == 17 ){
			return 13;
		}
		if ( node_id == 15 ){
			return 14;
		}
	}

	this.getNodeLocationReal = function(node_id){
	/*
		Goes from Javascript node layout to real grid node layout.
	*/
		if ( node_id == 9 ){
			return 10;
		}
		if ( node_id == 10 ){
			return 14;
		}
		if ( node_id == 11 ){
			return 5;
		}
		if ( node_id == 0 ){
			return 18;
		}
		if ( node_id == 1 ){
			return 13;
		}
		if ( node_id == 2 ){
			return 9;
		}
		if ( node_id == 3 ){
			return 11;
		}
		if ( node_id == 4 ){
			return 50;
		}
		if ( node_id == 5 ){
			return 12;
		}
		if ( node_id == 6 ){
			return 8;
		}
		if ( node_id == 7 ){
			return 6;
		}
		if ( node_id == 8 ){
			return 7;
		}
		if ( node_id == 12 ){
			return 16;
		}
		if ( node_id == 13 ){
			return 17;
		}
		if ( node_id == 14 ){
			return 15;
		}
	}

	this.getNodeDirection = function(new_node, last_node){
		dir = this.getSurroundingNodes(last_node);
		return this.direction[dir.indexOf(new_node)];
	}

	this.getRandomNode = function(node_id){
		possible = this.getSurroundingNodes(node_id).filter(function(data){
			return data != -1;
		});
		return possible[Math.floor(Math.random()*possible.length)];
	}

	this.getPseduoRandomNode = function(node_id, chosen){
		// gets a node that hasn't been visited yet, based on `chosen`
		possible = this.getSurroundingNodes(node_id).filter(function(data){
			return data != -1 && chosen.indexOf(data) == -1;
		});

		if (possible.length == 0) {
			return null;
		}
		return possible[Math.floor(Math.random()*possible.length)];
	}

	this.getUntakenNode = function(node_id){
		let chosen = [];
		do {
			new_node = this.getPseduoRandomNode(node_id, chosen);
			chosen.push(new_node);
		} while (new_node != null && this.takenNodes.indexOf(new_node) != -1) 

		return new_node;
	}
}