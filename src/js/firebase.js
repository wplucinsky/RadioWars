/*
	This script is used to setup and constantly read from firebase.
*/
	var config = {
		apiKey: "AIzaSyA7XkhEaCGCwkGzti8hRkv7kZR7_hoalp4",
		authDomain: "dwslgrid.firebaseapp.com",
		databaseURL: "https://dwslgrid.firebaseio.com",
		projectId: "dwslgrid",
		storageBucket: "dwslgrid.appspot.com",
		messagingSenderId: "222394513574"
	};
	firebase.initializeApp(config)

	var competitionTime = '123456789';
	var node = 'Grid11';
	firebase.database().ref('/Competitions/'+competitionTime+'/nodes/'+node+'/Logs/').on('child_added',function(snapshot){
			s = Object.keys(snapshot.val()).map(function(k){ 
				return k+': '+snapshot.val()[k]
			}).join('<br>');
			$('#dataViewerCont p').html(s).html()

			chartData['packetsSent'].data.datasets[0].data[0] = snapshot.val().PacketsSent;
			chartData['packetsSent'].data.datasets[1].data[0] = snapshot.val().PacketsRecieved;
			chartStatic['packetsSent'].update();
		}
	);

	function getFirebaseData(){ 
		firebase.database().ref('/Competitions/'+competitionTime+'/nodes/Grid11/Logs/').on('value', function(snapshot){
			s = Object.keys(snapshot.val()).map(function(k){ 
				return k+': '+snapshot.val()[k]
			}).join('<br>');
		});
		console.log(s)
		$('#dataViewerCont p').html(s).html()

		return s

	}