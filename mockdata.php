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

	function getData() {
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

	$data[0] = getData();
	$data[1] = getData();

	header('Access-Control-Allow-Origin: *');
	echo json_encode($data);