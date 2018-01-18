var grid = new Grid();

function Grid(){
	// standard
	this.teams = null;
	this.canvas = null;
	this.elem = null;

	// specific
	this.rects = []
	this.delta = 0.05;
	this.stopFlag = 0
	this.nodes = new Nodes();
	this.autoplay = true;
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
	}

	this.start = function(mode){
		this.drawRectangles();
		this.stopFlag = 0;
		if (mode != 'demo' && mode != 'interference') {
			for (let i in this.teams) {
				this.fadeIn(parseInt(i)+14, parseInt(i), this.teams[i].team.getTeamColorHex(), null);
			}
		}

		if ( mode == 'demo' ) {
			this.autoplay = false;
			// demo 1
			window.setTimeout(function(){
				this.data.graphs.grid.fn.on(2, this.data.teams[1].team.getTeamColorHex(), 1.0)
				this.data.graphs.grid.fn.on(12, this.data.teams[6].team.getTeamColorHex(), 1.0)
				this.data.teams[1].radio.captured.value = 1;
				this.data.teams[1].team.setRadio(data.teams[1].radio);
				this.data.teams[6].radio.captured.value = 1;
				this.data.teams[6].team.setRadio(data.teams[6].radio);
				// demo 2
				window.setTimeout(function(){
					this.data.graphs.grid.fn.on(6, this.data.teams[1].team.getTeamColorHex(), 0.5)
					this.data.graphs.grid.fn.on(8, this.data.teams[6].team.getTeamColorHex(), 0.5)
					this.data.teams[1].radio.captured.value = 2;
					this.data.teams[1].team.setRadio(data.teams[1].radio);
					this.data.teams[6].radio.captured.value = 2;
					this.data.teams[6].team.setRadio(data.teams[6].radio);
					// demo 3
					window.setTimeout(function(){
						this.data.graphs.grid.fn.off(8)
						this.data.graphs.grid.fn.on(6, this.data.teams[1].team.getTeamColorHex(), 1.0)
						this.data.graphs.grid.fn.on(7, this.data.teams[1].team.getTeamColorHex(), 0.7)
						this.data.graphs.grid.fn.contention(8, this.data.teams[1].team.getTeamColorHex(), this.data.teams[6].team.getTeamColorHex(), 0.3, 'lose')
						this.data.teams[1].radio.captured.value = 4;
						this.data.teams[1].team.setRadio(data.teams[1].radio);
						this.data.teams[6].radio.captured.value = 2;
						this.data.teams[6].team.setRadio(data.teams[6].radio);
						// demo 4
						window.setTimeout(function(){
							this.data.graphs.grid.fn.contention(8, this.data.teams[1].team.getTeamColorHex(), this.data.teams[6].team.getTeamColorHex(), 0.0, 'lose')
							this.data.graphs.grid.fn.on(6, this.data.teams[1].team.getTeamColorHex(), 1.0)
							this.data.graphs.grid.fn.on(7, this.data.teams[1].team.getTeamColorHex(), 1.0)
							this.data.graphs.grid.fn.on(8, this.data.teams[6].team.getTeamColorHex(), 1.0)
							this.data.teams[1].radio.captured.value = 3;
							this.data.teams[1].team.setRadio(data.teams[1].radio);
							this.data.teams[6].radio.captured.value = 2;
							this.data.teams[6].team.setRadio(data.teams[6].radio);
						}, 2000);
					}, 2000);
				}, 2000);
			}, 2000);
		}
	}

	this.stop = function(){
		this.stopFlag = 1;
	}

	this.setElem = function(id){
		this.canvas = document.getElementById(id);
		this.elem = this.canvas.getContext('2d');
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

	this.getRectangles = function(){
		return this.rects;
	}

	this.on = function(node, color, alpha){
		if ( this.stopFlag === 1) {
			return;
		}

		// clear the spot
		this.elem.clearRect(this.rects[node].x-3, this.rects[node].y-3, this.rects[node].width+8, this.rects[node].height+8);

		// right over it
		this.elem.globalAlpha = alpha;
		this.elem.beginPath();
		this.elem.rect(this.rects[node].x, this.rects[node].y, this.rects[node].width, this.rects[node].height);
		this.elem.fillStyle = color;
		this.elem.fill();
		this.elem.globalAlpha = 1;

		this.nodeCapture(alpha.toFixed(2), color, '#FFFFFF', node, true);
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
		this.elem.fillStyle = this.colors.grey;
		this.elem.fill();
		this.elem.lineWidth = this.rects[node].borderWidth;
		this.elem.strokeStyle = this.colors.grey;
		this.elem.stroke();

		this.nodeCapture(1.0, '#FFFFFF', '#FFFFFF', node, true)
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

		this.nodeCapture(this.rects[node].alpha.toFixed(2), color, '#FFFFFF', node, true)
		// $('#node_'+node).css('background-color', color);
		// $('#node_'+node).css('width', 300*this.rects[node].alpha.toFixed(2));
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
			if (this.autoplay){
				// to control fall term melee mode demo sliders
				if (team == 1 && $('#normalFrequency_'+team+'_range').length != 0) {
					var val = parseInt($('#normalFrequency_'+team+'_range')[0].value);
					val = (val <= 40) ? 850 : ((val <= 90) ? (Math.random()*800) : 100);
					window.setTimeout(function(){
						this.data.graphs.grid.fn.fadeIn(node, team, color, last_node)
					}, val);
				} else {
					window.setTimeout(function(){
					this.data.graphs.grid.fn.fadeIn(node, team, color, last_node)
				}, (Math.random()*800));
				}
				
			}
		} else {
			// go to new random node
			new_node = this.nodes.getUntakenNode(node);
			if ( new_node == null && last_node != null) {
				new_node = this.nodes.getUntakenNode(last_node);
				if ( new_node != null ) {
					this.nodes.takeNode(new_node)
					this.teams[team].team.setRadio({radioDirection: {value: this.nodes.getNodeDirection(new_node, last_node), type: "imgSrc"}});
					if (this.autoplay){
						this.fadeIn(new_node, team, color, last_node);
					}
				} else {
					this.teams[team].team.setRadio({radioDirection: {value: "Omni", type: "imgSrc"}});
				}
			} else {
				this.nodes.takeNode(new_node);
				this.teams[team].team.setRadio({radioDirection: {value: this.nodes.getNodeDirection(new_node, node), type: "imgSrc"}});
				if (this.autoplay){
					this.fadeIn(new_node, team, color, node);
				}
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
			if (this.autoplay){
				window.setTimeout(function(){
					this.fadeOut(node, team, color, last_node)
				}, (Math.random()*100));
			}
		} else if ( this.rects[node].alpha != 0.0 ) { // to deal with js fractions
			this.rects[node].alpha = 0.0;
			if (this.autoplay){
				window.setTimeout(function(){
					this.fadeOut(node, team, color, last_node)
				}, (Math.random()*100));
			}
		} else {
			/* Process 
				- remove node from queue
				- update queue & queue head
				- remove lines pointing to/from that node
				- draw line from previous node to next node
			*/
		}
	}

	this.startInterference = function(node, team, color, last_node){
		if ( this.stopFlag === 1) {
			return;
		}

		if ( this.rects[node].taken == 0 ) {
			this.rects[node].taken = color
			this.nodes.takeNode(node)

			data.teams[team].radio.captured.value++;				// update captured nodes for team
			data.teams[team].team.setRadio(data.teams[team].radio); // update team radio info
		} else if(this.rects[node].taken !== color || this.rects[node].alpha >= 1.0){
			console.log('ALREADY TAKEN!', node, color, this.rects)
			var new_nodes = this.nodes.getSurroundingNodes(node)
			if (this.autoplay){
				for ( i in new_nodes) {
					if ( new_nodes[i] != -1 && $.inArray(new_nodes[i], this.nodes.getTakenNodes()) == -1 ){
						this.startInterference(new_nodes[i], team, color, node);
					}
				}
			}
		}

		this.draw(node, color)				// draw rectangle w/ correct opacity
		this.line(node, color, last_node)	// draw line from previous to current

		if ( this.rects[node].alpha < 1.0) {
			// fade from 0 to 1 opacity
			this.rects[node].alpha = this.rects[node].alpha + this.delta
			if (this.autoplay){
				window.setTimeout(function(){
					this.data.graphs.grid.fn.startInterference(node, team, color, last_node)
				}, (Math.random()*500));
			}
		} else {
			// go to new random node
			if (this.autoplay){
				var new_nodes = this.nodes.getSurroundingNodes(node)
				for ( i in new_nodes) {
					if ( new_nodes[i] != -1 && $.inArray(new_nodes[i], this.nodes.getTakenNodes()) == -1 ){
						this.startInterference(new_nodes[i], team, color, node);
					}
				}
			}
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
		this.nodeCapture(alpha, color1, color2, node, (dir == 'lose' ? true : false))

		if ( alpha < 1.0 && alpha > 0.0) {
			if (dir == 'capture') {
				alpha += this.delta;
			} else {
				alpha -= this.delta;
			}

			if (this.autoplay){
				window.setTimeout(function(){
					this.data.graphs.grid.fn.contention(node, color1, color2, alpha, dir)
				}, (Math.random()*700));
			}
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

	this.nodeCapture = function(widthPercentage, color1, color2, node, left){
		color1 = (color1 == null) ? '#FFFFFF' : color1;
		color2 = (color2 == null) ? '#FFFFFF' : color2;

		widthPercentage = parseFloat(widthPercentage);
		$('#node_'+node).empty()
		$('#node_'+node).append('<div id="contention1_'+node+'""></div><div id="contention2_'+node+'""></div>')
		if ( left ) {
			$('#contention1_'+node).css({'width': 300*widthPercentage.toFixed(2), 'background-color': color1, 'float': 'left'});
			$('#contention2_'+node).css({'width': 300*(1-widthPercentage.toFixed(2)), 'background-color': color2, 'float': 'right'});
		} else {
			$('#contention1_'+node).css({'width': 300*(1-alpha.toFixed(2)), 'background-color': color2, 'float': 'left'});
			$('#contention2_'+node).css({'width': 300*widthPercentage.toFixed(2), 'background-color': color1, 'float': 'right'});
		}
	}

	this.clearNodeGraph = function(){
		for (var i=0; i<= 20; i++){
			$('#node_'+i).empty()
		}
	}
}