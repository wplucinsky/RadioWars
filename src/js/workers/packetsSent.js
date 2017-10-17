/*
	This script provides the functionality to the packetsSent module.
	It is called everytime firebase responds with data.
*/
	function packetsSent(user, snapshot, node){
		data = user.modules.active['packetsSent'+node].data.data;

		data.datasets[0].data[0] = snapshot.PacketsSent;
		data.datasets[0].data[1] = snapshot.PacketsRecieved;

		$($('.packetsSent_val').find('small')[0]).text("Transmitted: "+snapshot.PacketsSent);
		$($('.packetsSent_val').find('small')[1]).text("Received: "+snapshot.PacketsRecieved);
		
		user.modules.active['packetsSent'+node].elem.update()
	}