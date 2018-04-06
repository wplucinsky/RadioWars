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
			socket.on('connect/teams', function() {
				socket.on('teams', function (msg) {
					self.processTeams(JSON.parse(msg.data))
				});
			});
		}
	}

	this.processTeams = function(data){
		for (let i in data){
			$('#'+data[i].teamname+'_score').text(data[i].score)
		}
	}
}