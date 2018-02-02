<?php
	header('Access-Control-Allow-Origin: *');

	$data = array();

	function getRandomNode($min, $max, $parentNode = null){
		if (is_null($parentNode)) {
			return rand(0,20);
		} else {
			do {
				$n = rand(0,20);
			} while ( $n == $parentNode);
			return $n;
		}
	}

	function getRandomData() {
		$data = array();

		$packetsSent = array();
		$packetsReceived = array();

		$p = getRandomNode(0,20);
		$data['_id'] = "node".$p;
		$data['power'] = rand(0,20);

		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);
		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);

		$packetsReceived['node'.getRandomNode(0,20,$p)] = rand(1,10);
		$packetsReceived['node'.getRandomNode(0,20,$p)] = rand(1,10);


		$data['packetsSent'] = $packetsSent;
		$data['packetsReceived'] = $packetsReceived;

		return $data;
	}

	function getBuildingData($i, $m){
		$data = array();

		$packetsSent = array();
		$packetsReceived = array();

		if ( $i == 0 ){
			$data['_id'] = "node15";
			$p = 15;
		} elseif ( $i == 1 ) {
			$data['_id'] = "node20";
			$p = 20;
		} else {
			$data['_id'] = "node".(15+$i);
			$p = 15+$i;
		}
		$data['power'] = rand(0,20);

		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);
		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);

		if ( $m == 1 ){
			$packetsReceived['node'.($p-13)] = ($p-13)*20;
		} else {
			$packetsReceived['node'.($p-13)] = ($p-13)*$m;
		}
		
		$packetsReceived['node'.($p-7)]  = ($p-7)*$m;


		$data['packetsSent'] = $packetsSent;
		$data['packetsReceived'] = $packetsReceived;

		return $data;
	}

	function getRandomParent(){
		$available = array(10, 14, 5, 16, 17, 15);
		$p = rand(0,5);
		return $available[$p];
	}
	function getRandomChild(){
		$available = array(18, 13, 9, 11, 50, 12, 8, 6, 7);
		$p = rand(0,8);
		return $available[$p];
	}

	function getTransformedBuildingData($i, $m){
		/*
			Actual Formation
			10 	18		12	16
				13		8
			14	9		6 	17
			 	11 	50 	7
			5				15
		*/
		$data = array();

		$packetsSent = array();
		$packetsReceived = array();

		if ( $i == 0 ){
			$data['_id'] = "node10";
			$p = 10;
		} elseif ( $i == 1 ) {
			$data['_id'] = "node15";
			$p = 15;
		} else {
			$p = getRandomParent();
			$data['_id'] = "node".($p);
		}
		$data['power'] = rand(0,20);

		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);
		$packetsSent['node'.getRandomNode(0,20,$p)] = rand(1,10);

		if ( $m == 1 ){
			$packetsReceived['node'.getRandomChild()] = ($p-13)*20;
		} else {
			$packetsReceived['node'.getRandomChild()] = ($p-13)*$m;
		}
		
		$packetsReceived['node'.getRandomChild()]  = ($p-7)*$m;


		$data['packetsSent'] = $packetsSent;
		$data['packetsReceived'] = $packetsReceived;

		return $data;
	}

	function postData($data){
		$radio = array(
			'rxGain' => rand(5,20).'.0',
			'txGain' => rand(5,20).'.0',
			'normalFrequency' => rand(1,9).'00e6',
			'power' => rand(1,9).'00',
			'sampleRate' => rand(1,9).'0e3',
			'frameSize' => strval(rand(1,16)*128),
			'nodeId' => '15',
			'usrpAddress' => '192.168.11.'.rand(5,20),
			'nodeAddress' => '10.10.10'.rand(5,20),
			'radioDirection' => rand(1,2) == 1 ? 'Left' : 'Right',
			'captured' => '0',
			'_id' => '15'
		);

		foreach ($data as $key => $prop) {
			if ( array_key_exists($key, $radio)) {
				if ($key == '_id' || $key == 'nodeId') {
					$radio['_id'] = $prop['value'];
					$radio['nodeId'] = $prop['value'];
				} else {
					$radio[$key] = $prop['value'];
				}
			}
		}
		return $radio;
	}

	if ( isset($_GET['build']) && $_GET['build'] == 1) {
		// building data
		$c = (isset($_GET['c'])) ? $_GET['c'] : 2;
		$m = (isset($_GET['m'])) ? $_GET['m'] : 1;
		if ( $m > 10 ){
			$m = 0;
		}

		for ($i=0; $i < $c; $i++) { 
			if (isset($_GET['transform']) && $_GET['transform'] == 1) {
				$data[$i] = getTransformedBuildingData($i, $m);
			} else {
				$data[$i] = getBuildingData($i, $m);
			}
		}
	} elseif ( isset($_GET['post'])) {
		if (isset($_GET['i'])) {
			$data = $_POST;
		} else {
			$data = postData($_POST);
		}
	} elseif ( isset($_GET['login'])) {
		if ($_POST['username'] == 'dwsl'){
			$data = array(
				'success' => true,
				'location' => 'interference',
				'cookie' => 'proud_emu',
				'team_id' => 1
			);
		} else {
			$data = array(
				'success' => false
			);
		}
	} else {
		// random data
		$data[0] = getRandomData();
		$data[1] = getRandomData();
	}

	echo json_encode($data);