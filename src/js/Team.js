function Team(team_id){
	this.id = team_id;
	this.radio = {};
	this.information = {};
	// this.tree = new Tree(); // wait to implement

	this.setInformation = function(data){
		for ( let i in data ){
			this.information[i] = data[i]
		}
		$('#team_'+this.id+' .line').css('background-color', this.getTeamColorHex());
	}

	this.setRadio = function(data){
		for ( let i in data ){
			this.radio[i] = {}
			this.radio[i].value = data[i].value
			if ( data[i].type !== undefined ){
				this.radio[i].type = data[i].type
			} else {
				this.radio[i].type = 'text';
			}

			if (this.radio[i].type == 'text') {
				$('#'+i+'_'+this.id).text(this.radio[i].value)
			}
			if (this.radio[i].type == 'imgSrc') {
				$('#'+i+'_'+this.id).attr('src', 'src/img/Pattern'+this.radio[i].value+'.png')
			}
		}
	}

	this.getTeamColor = function(){
		if ( this.information.colorName === undefined ) {
			this.information.colorName = 'Grey'
		}

		return this.information.colorName;
	}

	this.getTeamColorHex = function(){
		if ( this.information.colorHex === undefined ) {
			this.information.colorHex = this.getRandomColor();
		}

		return this.information.colorHex;
	}

	this.getRandomColor = function(){
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}