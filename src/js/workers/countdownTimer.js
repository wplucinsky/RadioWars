/*
	This script provides the functionality to the countdownTimer module.
	It is called every second.
*/
	function countdownTimer(user){
		data = user.modules.default.countdownTimer.data.data;

		data.datasets[0].data[0]++;
		data.datasets[0].data[1]--;
		if ( data.datasets[0].data[0] == 100 ){
			data.datasets[0].data[0] = 0;
			data.datasets[0].data[1] = 100;
		}
		user.modules.default.countdownTimer.elem.update();
	}