/*
	This script provides the functionality to the packetsSent module.
	It is called everytime firebase responds with data.
*/
	function packetsSent(user, snapshot){
		data = user.modules.active.packetsSent.data.data;

		data.datasets[0].data[0] = snapshot.PacketsSent;
		data.datasets[1].data[0] = snapshot.PacketsRecieved;
		
		user.modules.active.packetsSent.elem.update()
	}