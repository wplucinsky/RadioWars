var grid = new Grid();

function Grid(){
	// standard
	this.teams = null;
	this.elem = null;

	// specific
	this.rects = []
	this.delta = 0.05;
	this.stopFlag = 0
	this.nodes = new Nodes();
	this.colors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	}

	this.setup = function(teams, id){
		this.teams = teams;
		this.setElem(id)

		this.createNodes();
		this.drawRectangles();
	}

	this.start = function(){
		this.stopFlag = 0;
		for (let i in this.teams) {
			this.fadeIn(parseInt(i)+14, parseInt(i), this.teams[i].team.getTeamColorHex(), null);
		}
		this.contention(5, this.teams[1].team.getTeamColorHex(), this.teams[6].team.getTeamColorHex(), 0.3, 'capture')
		this.contention(10, this.teams[1].team.getTeamColorHex(), this.teams[6].team.getTeamColorHex(), 0.8, 'lose')
	}

	this.stop = function(){
		this.stopFlag = 1;
	}

	this.setElem = function(id){
		var elem = document.getElementById(id);
		this.elem = elem.getContext('2d');
	}

	this.createNodes = function(){
		this.rects = []
		c = 0;
		for (let i=0; i<=2; i++){
			for (let j=0; j<=4; j++){
				var rect = {}
				rect.x = (75 * i) + (i * 5) + 80;
				rect.y = (75 * j) + (j * 5) + 5;
				rect.width = 25;
				rect.height = 25;
				rect.alpha = 0;
				rect.taken = 0;
				this.rects.push(rect);
				c+=1;
			}
		}
		for (let i=0; i<=1; i++){
			for (let j=0; j<=2; j++){
				k = (i == 0) ? 5 : 235;
				var rect = {}
				rect.x = (75 * i) + (i * 5) + k;
				rect.y = (180 * j) + (j * 5) + 5;
				rect.width = 25;
				rect.height = 25;
				rect.alpha = 0;
				rect.taken = 0;
				this.rects.push(rect);
				c+=1;
			}
		}
	}

	this.drawRectangles = function() {
		for (let i in this.rects){
			this.elem.beginPath();
			this.elem.rect(this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height);
			this.elem.fillStyle = this.colors.grey;
			this.elem.fill();
		}
	}

	this.on = function(node){
		if ( this.stopFlag === 1) {
			return;
		}

		// clear the spot
		this.elem.clearRect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+8, this.rects[node].height+8);

		// right over it
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x, this.rects[node].y, this.rects[node].width, this.rects[node].height);
		this.elem.fillStyle = colors.green;
		this.elem.fill();
		this.elem.lineWidth = this.rects[node].borderWidth;
		this.elem.strokeStyle = colors.grey;
		this.elem.stroke();
	}

	this.off = function(node){
		if ( this.stopFlag === 1) {
			return;
		}

		// clear the spot
		this.elem.clearRect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+8, this.rects[node].height+8);

		// right over it
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x, this.rects[node].y, this.rects[node].width, this.rects[node].height);
		this.elem.fillStyle = colors.grey;
		this.elem.fill();
		this.elem.lineWidth = this.rects[node].borderWidth;
		this.elem.strokeStyle = colors.grey;
		this.elem.stroke();
	}
	
	this.draw = function(node, color){
		// clear the spot
		this.elem.clearRect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+8, this.rects[node].height+8);

		// right over it
		this.elem.globalAlpha = this.rects[node].alpha;
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x, this.rects[node].y, this.rects[node].width, this.rects[node].height);
		this.elem.fillStyle = color;
		this.elem.fill();

		this.elem.globalAlpha = 1;
		this.elem.lineWidth = this.rects[node].borderWidth;
		this.elem.strokeStyle = this.colors.grey;
		this.elem.stroke();

		$('#node_'+node).css('background-color', color);
		$('#node_'+node).css('width', 100*this.rects[node].alpha.toFixed(2));
	}

	this.fadeIn = function(node, team, color, last_node){
		if ( this.stopFlag === 1) {
			return;
		}

		if ( this.rects[node].taken == 0 ) {
			this.rects[node].taken = color
			if (team % 2 == 0) {
				$('#node_'+node).css('float', 'right');
			}
		} else if(this.rects[node].taken !== color ){
			console.log('ALREADY TAKEN!', node, color, this.rects)
			this.teams[team].team.setRadio({radioDirection: {value: "Omni", type: "imgSrc"}});
			return
		}

		this.draw(node, color)				// draw rectangle w/ correct opacity
		this.line(node, color, last_node)	// draw line from previous to current

		if ( this.rects[node].alpha < 1.0) {
			// fade from 0 to 1 opacity
			this.rects[node].alpha = this.rects[node].alpha + this.delta
			window.setTimeout(function(){
				this.data.graphs.grid.fn.fadeIn(node, team, color, last_node)
			}, (Math.random()*200));
		} else {
			// go to new random node
			new_node = this.nodes.getUntakenNode(node);
			if ( new_node == null && last_node != null) {
				new_node = this.nodes.getUntakenNode(last_node);
				if ( new_node != null ) {
					this.nodes.takeNode(new_node)
					this.teams[team].team.setRadio({radioDirection: {value: this.nodes.getNodeDirection(new_node, last_node), type: "imgSrc"}});
					this.fadeIn(new_node, team, color, last_node);
				} else {
					this.teams[team].team.setRadio({radioDirection: {value: "Omni", type: "imgSrc"}});
				}
			} else {
				this.nodes.takeNode(new_node);
				this.teams[team].team.setRadio({radioDirection: {value: this.nodes.getNodeDirection(new_node, node), type: "imgSrc"}});
				this.fadeIn(new_node, team, color, node);
			}
		}
	}

	this.fadeOut = function(node, team, color, last_node){
		if ( this.stopFlag === 1) {
			return;
		}

		if ( this.rects[node].taken == 0 ) {
			this.rects[node].taken = color
		} else if(this.rects[node].taken !== color ){
			console.log('ALREADY TAKEN!', node, color, this.rects)
			this.teams[team].team.setRadio({radioDirection: {value: "Omni", type: "imgSrc"}});
			return
		}

		this.draw(node, color)				// draw rectangle w/ correct opacity
		this.line(node, color, last_node)	// draw line from previous to current

		if ( this.rects[node].alpha >= 0.05) {
			this.rects[node].alpha = this.rects[node].alpha - this.delta
			window.setTimeout(function(){
				this.fadeOut(node, team, color, last_node)
			}, (Math.random()*100));
		} else if ( this.rects[node].alpha != 0.0 ) { // to deal with js fractions
			this.rects[node].alpha = 0.0;
			window.setTimeout(function(){
				this.fadeOut(node, team, color, last_node)
			}, (Math.random()*100));
		} else {
			/* Process 
				- remove node from queue
				- update queue & queue head
				- remove lines pointing to/from that node
				- draw line from previous node to next node
			*/
		}
	}

	this.contention = function(node, color1, color2, alpha, dir){
	/*
		This takes a node, two colors, an opacity and a direction to show node contention.
			color1 	- left color
			color2 	- right color
			alpha 	- opacity
			dir 	- 	capture: color1 capturing, color2 losing
						lose: color2 capturing, color1 losing
	*/
		if ( this.stopFlag === 1) {
			return;
		}

		var color = '#'+colorAverage(color1, color2, alpha)
		if ( this.rects[node].taken == 0 ) {
			this.rects[node].taken = color
		}

		// clear the spot
		this.elem.clearRect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+8, this.rects[node].height+8);

		// right over it
		this.elem.globalAlpha = 1;
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x, this.rects[node].y, this.rects[node].width, this.rects[node].height);
		this.elem.fillStyle = color;
		this.elem.fill();

		// node capture "bar graph"
		$('#node_'+node).empty()
		$('#node_'+node).append('<div id="contention1_'+node+'""></div><div id="contention2_'+node+'""></div>')
		$('#contention1_'+node).css({'width': 100*alpha.toFixed(2), 'background-color': color1, 'float': 'left'});
		$('#contention2_'+node).css({'width': 100*(1-alpha.toFixed(2)), 'background-color': color2, 'float': 'right'});

		if ( alpha < 1.0 && alpha > 0.0) {
			if (dir == 'capture') {
				alpha += this.delta;
			} else {
				alpha -= this.delta;
			}

			window.setTimeout(function(){
				this.data.graphs.grid.fn.contention(node, color1, color2, alpha, dir)
			}, (Math.random()*700));
		}
	}

	function colorAverage(color1, color2, ratio) {
		var hex = function(x) {
			x = x.toString(16);
			return (x.length == 1) ? '0' + x : x;
		};

		var r = Math.ceil(parseInt(color1.substring(1,3), 16) * ratio + parseInt(color2.substring(1,3), 16) * (1-ratio));
		var g = Math.ceil(parseInt(color1.substring(3,5), 16) * ratio + parseInt(color2.substring(3,5), 16) * (1-ratio));
		var b = Math.ceil(parseInt(color1.substring(5,7), 16) * ratio + parseInt(color2.substring(5,7), 16) * (1-ratio));

		return hex(r) + hex(g) + hex(b);
	}

	this.line = function(node, color, last_node){
		if ( last_node !== null ){
			this.elem.beginPath();
			this.elem.setLineDash([5, 15]);
			this.elem.moveTo(this.rects[last_node].x, this.rects[last_node].y);
			this.elem.lineTo(this.rects[node].x, this.rects[node].y);
			this.elem.stroke();
		}
	}
}