/*
	This script provides the functionality to the countdownTimer module.
	It is called every second.
*/
	function countdownTimer(data){
		d = data.graphs.countdownTimer.data.data;
		d.datasets[0].data[0]++;
		d.datasets[0].data[1]--;
		if ( d.datasets[0].data[0] == 100 ){
			d.datasets[0].data[0] = 0;
			d.datasets[0].data[1] = 100;
		}
		data.graphs.countdownTimer.elem.update();
	}