/*
	This script provides the functionality to the bitsLeft module.
*/
	function bitsLeft(user){
		data = user.modules.default.bitsLeft.data.data;

		data.datasets[0].data[0]++;
		data.datasets[0].data[1]--;
		if ( data.datasets[0].data[0] == 100 ){
			data.datasets[0].data[0] = 0;
			data.datasets[0].data[1] = 100;
		}
		user.modules.default.bitsLeft.elem.update();
	}