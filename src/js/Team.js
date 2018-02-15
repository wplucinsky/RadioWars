function Team(team_id){
	this.id = team_id;
	this.api = new API();
	this.radio = {};
	this.information = {};
	// this.tree = new Tree(); // wait to implement

	this.setInformation = function(data){
	/*
		Sets the team's color information.
	*/
		for ( let i in data ){
			this.information[i] = data[i]
		}
		$('#team_'+this.id+' .line').css('background-color', this.getTeamColorHex());
	}

	this.updateRadio = function(data){
	/*	
		Send radio information updates to the Flask Server through the API post(), then 
		call transformData() and setRadio() to display the radio information to the user.
	*/
		Object.assign(data, this.getControlData()); // add in controls data

		var url = "http://www.craigslistadsaver.com/cgi-bin/mockdata.php?post=1";  // used for testing
		// var url = "http://dwslgrid.ece.drexel.edu:5000/radio/"+data['_id'].value;
		var s = this;
		this.api.postOrig(url, data, function(data){
			$('#serverOutputPost').text(JSON.stringify(data));
			data = s.transformData(data)
			s.setRadio(data)
		});
	}

	this.setRadio = function(data){
	/*
		Displays radio information to the player
	*/
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
				$('#'+i+'_'+this.id+'_knob').val(this.radio[i].value).trigger('change');
			}
			if (this.radio[i].type == 'imgSrc') {
				$('#'+i+'_'+this.id).attr('src', 'src/img/Pattern'+this.radio[i].value+'.png')
			}
		}
		$('#controlsConfirmChanges').css('display', 'none')
	}

	this.getRadio = function(){
		return this.radio;
	}

	this.getControlData = function(){
	/*
		Gets the updated knob data that will be sent to the Flask server.
	*/
		var d = {};
		for ( let i in this.radio ){
			if ( this.radio[i].type == 'text') {
				if ($('#'+i+'_'+this.id+'_knob').val() !== undefined) {
					d[i] = {}
					d[i].value = $('#'+i+'_'+this.id+'_knob').val();
				}
			}
		}
		return d
	}

	this.transformData = function(data){
	/*
		Transforms the incoming Flask server data to {gamemode}.js format.
	*/
		var d = {};
		for ( let i in data ){
			if ( i == 'radioDirection' ){
				t = 'imgSrc'
			} else {
				t = 'text'
			}
			d[i] = {}
			d[i].value = data[i]
			d[i].type = t
		}
		return d;
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