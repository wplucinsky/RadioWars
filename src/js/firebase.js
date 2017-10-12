/*
	This script is used to handle the connection with firebase on each active node
	and call the worker with user and snapshot data.
*/
	
	for ( let n in user.nodes.active ){
		console.log('/Competitions/'+competitionTime+'/nodes/grid'+user.nodes.active[n]+'/Logs/')
		var q = firebase.database().ref('/Competitions/'+competitionTime+'/nodes/grid'+user.nodes.active[n]+'/Logs/')
		user.nodes.connected[user.nodes.active[n]] = q
		q.on('child_added',function(snapshot){
			handleData(user.nodes.active[n], snapshot.val())
		});
	}

	function startConnection(node) {
		if ($.inArray(node.toString(), Object.keys(user.nodes.connected)) !== -1) {
			// node already connected
			return;
		}

		if ($.inArray(node.toString(), Object.keys(user.nodes.active)) === -1) {
			// node not in active
			user.nodes.active.push(node)
		}
		

		var q = firebase.database().ref('/Competitions/'+competitionTime+'/nodes/Grid'+node+'/Logs/')
		user.nodes.connected[node] = q
		q.on('child_added',function(snapshot){
			handleData(user.nodes.active[n], snapshot.val())
		});
	}

	function stopConnection(node){
		if ($.inArray(node.toString(), Object.keys(user.nodes.connected)) === -1) {
			// node already disconnected
			return;
		}

		user.nodes.connected[node].off()
		delete user.nodes.connected[node]
	}

	function handleData(node, data){
		if ($.inArray('packetsSent'+node, Object.keys(user.modules.active)) !== -1) {
			packetsSent(user, data, node)
		}

		if ($.inArray('gridView', Object.keys(user.modules.active)) !== -1) {
			gridView_update(user, data, node)
		}

		// more firebase variable graph functionality will be added here

		// console.log(node, data)

		// dataViewer
		// s = Object.keys(snapshot.val()).map(function(k){ 
		// 	return k+': '+snapshot.val()[k]
		// }).join('<br>');
		// $('#dataViewerCont p').html(s).html()
	}

