/*
	This script is used to link module data to their models.
	
	References:
		http://www.chartjs.org/
*/

	// default
	user.modules.default.countdownTimer.data 	= countdownTimer_model;

	// user changeable
	user.modules.active.statistics.data 		= line_model;
	user.modules.active.jamming.data 			= radar_model;
	user.modules.active.packetsSent11.data 		= packetsSent_model;
	user.modules.active.packetsSent01.data 		= packetsSent_model;