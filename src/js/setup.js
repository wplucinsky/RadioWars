/*
	!TEST_MODE
		- create SocketIO connection
		- call SocketIO connect() fn to start data flow
		- check if user logged in (valid cookie), else redirect to login page
	TEST_MODE
		- assign user a random cookie

	All
		- read `var data` from js file in /src/js/modes/
		- use window._id (cookie) to choose correct team in `var data`
		- call setup of each graphs element in `var data`
		- call start of each graphs element in `var data` with relevant game mode
*/

var api = new API();
var TEST_MODE = (window.location.hostname == "" || window.location.hostname == "localhost") ? true : false;
if (!TEST_MODE){
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		console.log('socket is connected')
	});
}

window._id = api.getCookie('team_id');
if (window._id == undefined){
	if (TEST_MODE) {
		window._id = 3
	} else {
		window.location.href = '/'
	}
} else {
	window._id = parseInt(window._id)
}

function setup() {
	for (let team_id in data.teams) {
		if ( team_id != window._id ) { continue; }
		var set = 1;
		data.nodes = new Nodes();
		data.teams[team_id].team = new Team(team_id);
		data.teams[team_id].team.setInformation(data.teams[team_id].information)
		data.teams[team_id].team.setRadio(data.teams[team_id].radio, true)
	}
	if ( Object.keys(data.teams).indexOf(window._id+'') !== -1) { $('#loading-blocker').css('display', 'none'); } else { throw new Error('Invalid `team_id` cookie. Clear cookies and re-login or update config file to include team `'+window._id+'`.'); }

	for (let graph_name in data.graphs) {
		data.graphs[graph_name].fn = eval(graph_name);
		data.graphs[graph_name].fn.setup(data.teams, graph_name)
	}
	for (let graph_name in data.graphs) {
		data.graphs[graph_name].fn.start('interference')
	}
}

function stop(){
	this.data.graphs.grid.fn.stop()
	this.data.graphs.countdownTimer.fn.stop()
}

setup()