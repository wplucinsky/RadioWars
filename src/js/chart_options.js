/*
	This script is used to link module data to their models.
	
	References:
		http://www.chartjs.org/
*/

	// default
	user.modules.default.countdownTimer.data 	= countdownTimer_model;
	user.modules.default.bitsLeft.data 			= bitsLeft_model;

	// user changeable
	user.modules.active.packetsSent11.data 		= packetsSent_model;

	// custom
	user.modules.active.gridView.data			= gridView_model;