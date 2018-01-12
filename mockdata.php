<?php
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

	function getBuildingData($i){
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

		$packetsReceived['node'.($p-13)] = rand(1,15);
		$packetsReceived['node'.($p-7)]  = rand(1,15);


		$data['packetsSent'] = $packetsSent;
		$data['packetsReceived'] = $packetsReceived;

		return $data;
	}

	if ( isset($_GET['build']) && $_GET['build'] == 1) {
		// building data
		$c = (isset($_GET['c'])) ? $_GET['c'] : 2;
		for ($i=0; $i < $c; $i++) { 
			$data[$i] = getBuildingData($i);
		}
	} else {
		// random data
		$data[0] = getRandomData();
		$data[1] = getRandomData();
	}

	header('Access-Control-Allow-Origin: *');
	echo json_encode($data);