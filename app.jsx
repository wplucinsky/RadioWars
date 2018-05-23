var TEST_MODE = (window.location.hostname == "" || window.location.hostname == "localhost") ? true : false,
	PERMISSIONS = false,  //(TEST_MODE) ? false : true,
	socket = null;
function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function formatDate(date) { return date.toLocaleDateString(); }
function debouncer( func , timeout ) { var timeoutID , timeout = timeout || 200; return function () { var scope = this , args = arguments; clearTimeout( timeoutID ); timeoutID = setTimeout( function () { func.apply( scope , Array.prototype.slice.call( args ) ); } , timeout ); } }

$(function() {
	var api = new API();

	setup = function() {
		// collapsing sidebar
		$('#sidebarCollapse').on('click', function () {
			$('#sidebar').toggleClass('active');
			$(this).toggleClass('active');
		});

		// showing / hiding modules
		// todo: destroy/create React component 
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
	}

	prod_mode = function() {
		socket = io.connect('http://' + document.domain + ':' + location.port);
		socket.on('connect', function() {
			console.log('socket is connected')
		});

		var mode = (window.location.hash) ? window.location.hash.substring(1) : 'interference';
		api.get('http://'+document.domain+':'+location.port+'/config/'+mode, function(config){
			if(document.getElementById('root') != null){
				ReactDOM.render(
					<App 
						data={config} 
					/>,
					document.getElementById('root')
				);
				$('#loading-blocker').toggleClass('hidden');
				$('.line').css('background-color', window._teamColor);
				setup();
			} else if(document.getElementById('viewer') != null){
				ReactDOM.render(
					<App 
						data={config}
						mode='viewer'
					/>,
					document.getElementById('viewer')
				);
				$('#loading-blocker').toggleClass('hidden');
				$('.line').css('background-color', window._teamColor);
				setup();
			}
		})
	}

	test_mode = function() {
		if(document.getElementById('root') != null){
			ReactDOM.render(
				<App 
					data={config} 
				/>,
				document.getElementById('root')
			);
			$('#loading-blocker').toggleClass('hidden');
			$('.line').css('background-color', window._teamColor);
			setup();
		} else if(document.getElementById('viewer') != null){
			ReactDOM.render(
				<App 
					data={config}
					mode='viewer'
				/>,
				document.getElementById('viewer')
			);
			$('#loading-blocker').toggleClass('hidden');
			$('.line').css('background-color', window._teamColor);
			setup();
		}
	}

	// check if logged in
	window._id = api.getCookie('team_id');
	if (window._id == undefined){
		if (TEST_MODE) {
			window._id = 1
		} else {
			window.location.href = '/login.html';
		}
	} else {
		window._id = parseInt(window._id)
	}
	window._nodes = new Nodes();
	window._node = 11; // js layout
	window._teamColor = '#3498db';



/*
	If TEST_MODE
		- read config file from src/js/API.js
		- start React
		- call setup()

	If not TEST_MODE: 
		- check if logged in, redirect to /login if necessary
		- connect to SocketIO
		- read config file from server
		- start React
		- call setup()
*/
	if (TEST_MODE) {
		test_mode()
	} else {
		prod_mode();
	}
});


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
