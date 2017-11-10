function Nodes(){
/*
	15 	0	5	10	18
		1	6	11
	16	2	7	12 	19
	 	3 	8 	13
	17	4	9	14	20 	
*/
	this.takenNodes = [];
	this.direction = ['Up', 'UpLeft', 'Left', 'DownLeft', 'Down', 'DownRight', 'Right', 'Up'];

	this.takeNode = function(node_id) {
		this.takenNodes.push(node_id);
	}

	this.untakeNode = function(node_id) {
		delete this.takenNodes[this.takenNodes.indexOf(node_id)];
	}

	this.getSurroundingNodes = function(node_id) {
		// in form [ U, UL, L, DL, D, DR, R, UP]
		if (node_id == 15) {	// yellow start
			return [ -1, -1, -1, -1, -1, -1, 0, -1];
		} 
		if ( node_id == 16) {	// red start
			return [ -1, -1, -1, -1, -1, -1, 2, -1];
		}
		if ( node_id == 17) {	// green start
			return [ -1, -1, -1, -1, -1, -1, 4, -1];
		}
		if ( node_id == 18) {	// blue start
			return [ -1, -1, 10, -1, -1, -1, -1, -1];
		}
		if ( node_id == 19) {	// purple start
			return [ -1, -1, 12, -1, -1, -1, -1, -1];
		}
		if ( node_id == 20) {	// black start
			return [ -1, -1, 14, -1, -1, -1, -1, -1];
		}
		if ( node_id == 0 ){
			return [ -1, -1, 15, -1, 1, 6, 5, -1];
		}
		if ( node_id == 1 ){
			return [ 0, -1, -1, -1, 2, 7, 6, 0];
		}
		if ( node_id == 2 ){
			return [ 1, -1, 16, -1, 3, 8, 7, 1];
		} 
		if ( node_id == 3 ){
			return [ 2, -1, -1, -1, 4, 9, 8, 2];
		} 
		if ( node_id == 4 ){
			return [ 3, -1, 17, -1, -1, -1, 9, 3];
		}
		if ( node_id == 5 ){
			return [ -1, -1, 0, 1, 6, 11, 10, -1];
		} 
		if ( node_id == 6 ){
			return [ 5, 0, 1, 2, 7, 12, 11, 5];
		}
		if ( node_id == 7 ){
			return [ 6, 1, 2, 3, 8, 13, 12, 6];
		}
		if ( node_id == 8 ){
			return [ 7, 2, 3, 4, 9, 14, 13, 7];
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
		// gets a node that hasn't been visited yet, based on chosen
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