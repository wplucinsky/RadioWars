function Nodes(){
/*
	Javascript Formation
		11 	0		7	14
			1	4	8
		12	2	5	9 	15
		 	3 	6	10
		13				16 	

	Actual Formation
		10 	18		12	16
			13	4	8
		14	9	3	6 	17
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
			[ U, UL, L, DL, D, DR, R]
	*/
		if (node_id == 11) {	// yellow start
			return [ -1, -1, -1, -1, 12, 1, 0];
		} 
		if ( node_id == 12) {	// red start
			return [ 11, 1, -1, -1, 13, -1, 2];
		}
		if ( node_id == 13) {	// green start
			return [ 12, -1, -1, -1, -1, -1, 3];
		}
		if ( node_id == 14) {	// blue start
			return [ -1, -1, 7, 8, 15, -1, -1];
		}
		if ( node_id == 15) {	// purple start
			return [ 14, -1, 9, -1, 16, -1, -1];
		}
		if ( node_id == 16) {	// black start
			return [ 15, -1, 10, -1, -1, -1, -1];
		}
		if ( node_id == 0 ){
			return [ -1, -1, 11, -1, 1, 5, 7];
		}
		if ( node_id == 1 ){
			return [ 0, 11, -1, 12, 2, 5, 4];
		}
		if ( node_id == 2 ){
			return [ 1, -1, 12, -1, 3, 6, 5];
		} 
		if ( node_id == 3 ){
			return [ 2, 12, 13, -1, -1, -1, 6];
		} 
		if ( node_id == 4 ){
			return [ -1, 0, 1, 2, 5, 9, 8];
		}
		if ( node_id == 5 ){
			return [ 4, 1, 2, 3, 6, 10, 9];
		} 
		if ( node_id == 6 ){
			return [ 5, 2, 3, -1, -1, -1, 10];
		}
		if ( node_id == 7 ){
			return [ -1, -1, 0, 4, 8, -1, 14];
		}
		if ( node_id == 8 ){
			return [ 7, -1, 4, 5, 9, 15, -1];
		} 
		if ( node_id == 9 ){
			return [ 8, 4, 5, 6, 10, -1, 15];
		} 
		if ( node_id == 10 ){
			return [ 9, 5, 6, -1, -1, -1, 16];
		}
	}

	this.getNodeLocation = function(node_id){
	/*
		Goes from real grid node layout to Javascript grid layout.
	*/
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
		if ( node_id == 4 ){
			return 4;
		}
		if ( node_id == 3 ){
			return 5;
		}
		if ( node_id == 50 ){
			return 6;
		}
		if ( node_id == 12 ){
			return 7;
		}
		if ( node_id == 8 ){
			return 8;
		}
		if ( node_id == 6 ){
			return 9;
		}
		if ( node_id == 7 ){
			return 10;
		}
		if ( node_id == 10 ){
			return 11;
		}
		if ( node_id == 14 ){
			return 12;
		}
		if ( node_id == 5 ){
			return 13;
		}
		if ( node_id == 16 ){
			return 14;
		}
		if ( node_id == 17 ){
			return 15;
		}
		if ( node_id == 15 ){
			return 16;
		}
	}

	this.getRealLocations = function() {
		return [18, 13, 9, 11, 4, 3, 50, 12, 8, 6, 7, 10, 14, 5, 16, 17, 15];
	}

	this.getNodeLocationReal = function(node_id){
	/*
		Goes from Javascript node layout to real grid node layout.
	*/
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
			return 4;
		}
		if ( node_id == 5 ){
			return 3;
		}
		if ( node_id == 6 ){
			return 50;
		}
		if ( node_id == 7 ){
			return 12;
		}
		if ( node_id == 8 ){
			return 8;
		}
		if ( node_id == 9 ){
			return 6;
		}
		if ( node_id == 10 ){
			return 7;
		}
		if ( node_id == 11 ){
			return 10;
		}
		if ( node_id == 12 ){
			return 14;
		}
		if ( node_id == 13 ){
			return 5;
		}
		if ( node_id == 14 ){
			return 16;
		}
		if ( node_id == 15 ){
			return 17;
		}
		if ( node_id == 16 ){
			return 15;
		}
	}

	this.getNodeColor = function(teamNode){
		if(teamNode == 6) {
			return this.colors.yellow
		}
		if(teamNode == 7) {
			return this.colors.green
		}
		if(teamNode == 8) {
			return this.colors.red
		}
		if(teamNode == 9) {
			return this.colors.yellow
		}
		if(teamNode == 10) {
			return this.colors.red
		}
		if(teamNode == 11) {
			return this.colors.green
		}
		if(teamNode == 12) {
			return this.colors.blue
		}
		if(teamNode == 13) {
			return this.colors.purple
		}
		if(teamNode == 14) {
			return this.colors.black
		}

		return this.colors.orange;
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