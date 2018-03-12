var score = new Score();

function Score(){

	this.setup = function(teams, id){
		this.teams = teams;
	}

	this.start = function(){
		this.subscribeToTeams();
	}

	this.subscribeToTeams = function(){
		var url = "http://dwslgrid.ece.drexel.edu:5000/stream/teams";
		source = new EventSource(url);
		var self = this;

		source.onmessage = function (event) {
			d = JSON.parse(event.data);
			for (let i in d){
				$('#'+d[i].teamname+'_score').text(d[i].score)
			}
		};
	}
}