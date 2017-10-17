/*
	This script is used to set and add all module data. Also used for
	set timing of certain modules.
*/
	window.onload = function() {
		Object.keys(user.modules.active).map(function(m){ 
			if ( user.modules.active[m].type == 'chart' ) {
				var elem = document.getElementById(m).getContext("2d");
				user.modules.active[m].elem = new Chart(elem, user.modules.active[m].data);
			}
			if ( user.modules.active[m].type == 'custom' ) {
				window[m+'_start'](m);
			}
		});

		Object.keys(user.modules.default).map(function(m){ 
			if ( user.modules.default[m].type == 'chart' ) {
				var elem = document.getElementById(m).getContext("2d");
				user.modules.default[m].elem = new Chart(elem, user.modules.default[m].data);
			}
		});
	};

	// 1 Second
	window.setInterval(function(){
		countdownTimer(user)
	}, 1000);

	function gridView_start(m) {
		user.modules.active[m].elem = document.getElementById(m).getContext("2d");
		gridView_drawRectangles(user.modules.active[m].data.rectangles, user.modules.active[m].elem);
	}


	/* 
		Functions below are used for custom intervals.
		Currently in use on the gridView to blink nodes.
	*/
	function interval(m, node, data, context, user) {
		return window.setInterval(function(){
			window[m+'_on'](node, data, context);
			setTimeout(function() {
				window[m+'_off'](node, data, context);
				user.modules.active[m].data.intervals[node].cnt++
				if ( user.modules.active[m].data.intervals[node].cnt == user.modules.active[m].data.intervals[node].reps) {
					stopInterval(user, node, m)
				}
			}, 500);
		}, 1000)
	}

	function startInterval(user, node, m, reps) {
		if ($.inArray(parseInt(node), Object.keys(user.modules.active[m].data.intervals)) === -1) {
			user.modules.active[m].data.intervals[parseInt(node)] = {};
			user.modules.active[m].data.intervals[parseInt(node)].id = interval(m, parseInt(node), user.modules.active[m].data.rectangles, user.modules.active[m].elem, user);
			user.modules.active[m].data.intervals[parseInt(node)].node = parseInt(node);
			user.modules.active[m].data.intervals[parseInt(node)].reps = reps
			user.modules.active[m].data.intervals[parseInt(node)].cnt = 0
		}
	}
	function stopInterval(user, node, m) {
		for (let i in user.modules.active[m].data.intervals ) {
			if ( user.modules.active[m].data.intervals[i].node == parseInt(node) ){
				window.clearInterval(user.modules.active[m].data.intervals[i].id);
				delete user.modules.active[m].data.intervals[i];
			}
		}
	}
	function stopAllIntervals(user, m) {
		for (let i in user.modules.active[m].data.intervals ) {
			window.clearInterval(user.modules.active[m].data.intervals[i].id);
			delete user.modules.active[m].data.intervals[i];
		}
	}

	// 10 Seconds
	// window.setInterval(function(){
	// 	for(let chartType in chart) {
	// 		chartData[chartType].data.datasets.forEach(function(dataset) {
	// 			dataset.data = dataset.data.map(function() {
	// 				return randomScalingFactor();
	// 			});
	// 		});
	// 		chart[chartType].update();
	// 	}
	// }, 10000);