var score = new Score();

function Score(){

	this.setup = function(teams, id){
		this.teams = teams;
	}

	this.start = function(){
		this.subscribeToTeams();
	}

	this.subscribeToTeams = function(){
		if (!TEST_MODE){
			var self = this
			socket.on('teams', function (msg) {
				console.log('[teams]', msg)
				self.processTeams(JSON.parse(msg.data))
			});
		}
	}

	this.processTeams = function(data){
		for (let i in data){
			$('#'+data[i].teamname+'_score').text(data[i].score)
		}
	}
}