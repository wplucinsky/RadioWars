var TEST_MODE = (window.location.hostname == "" || window.location.hostname == "localhost") ? true : false;
if (!TEST_MODE){
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		console.log('socket is connected')
	});
}
window._node = 11; // js layout
window._id = 1;


function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date) {
	return date.toLocaleDateString();
}

// change to read from game mode
const comment = {
	name: 'radio',
	date: new Date(),
	text: 'I hope you enjoy learning React!',
	radio_controls: [
		{
			name: 'power',
			value: "900",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'rxGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'txGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frequency',
			value: "900e6",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'sampleRate',
			value: "250e3",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frameSize',
			value: "1024",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
	],
	interference_controls: [
		{
			name: 'power',
			value: "900",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'rxGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'txGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frequency',
			value: "900e6",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'sampleRate',
			value: "250e3",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frameSize',
			value: "1024",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
	],
	modules: [
		{
			name: 'Radio Controls',
			team: 1,
			active: 1,
		},{
			name: 'Antenna Controls',
			team: 2,
			active: 1,
		},{
			name: 'Interference Controls',
			team: 2,
			active: 1,
		},{
			name: 'Server Output',
			team: 3,
			active: 1,
		},{
			name: 'Node Graph',
			team: 4,
			active: 1,
		},{
			name: 'Score Graph',
			team: 5,
			active: 1,
		}
	],
};

ReactDOM.render(
	<App 
		data={comment} 
	/>,
	document.getElementById('root')
);
$('#loading-blocker').toggleClass('hidden');
$('.line').css('background-color', 'rgb(54, 162, 235)');

// collapsing sidebar
$('#sidebarCollapse').on('click', function () {
	$('#sidebar').toggleClass('active');
	$(this).toggleClass('active');
});

// showing / hiding modules
$('#sidebar ul li a').on('click', function () {
	nm = this.text.replace(' ', '_').toLowerCase() + '_container';
	$('#'+nm).toggleClass('hidden');
	$(this).toggleClass('active');
});

// bind knob to all knob classes
$(".knob").knob({
	release : function (value) {
		if (this.$.attr('id').indexOf('interference_') !== -1 ) {
			$('#interferenceControlsConfirmChanges').css('display', 'block')
		} else {
			$('#radioControlsConfirmChanges').css('display', 'block')
		}
	}
});

function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   }
}

// warning for small displays on resize
$(window).resize(
	debouncer(function(e){	
    if ($(window).width() < 768) {
		$('#sizeWarning').toggleClass('hidden');
		setTimeout(function(){
			$('#sizeWarning').toggleClass('hidden');
		}, 2000);
	}
}));

// warning for small displays on load
if ($(window).width() < 768) {
	$('#sizeWarning').toggleClass('hidden');
	setTimeout(function(){
		$('#sizeWarning').toggleClass('hidden');
	}, 2000)
}
