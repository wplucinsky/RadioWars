<?php
	$data = array();
	$packetsSent = array();
	$packetsReceived = array();

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

	$p = getRandomNode(0,20);
	$data['node_id'] = "node".$p;
	$data['power'] = rand(0,20);

	$packetsSent['node'.getRandomNode(0,20,$p)] = rand(0,10);
	$packetsSent['node'.getRandomNode(0,20,$p)] = rand(0,10);

	$packetsReceived['node'.getRandomNode(0,20,$p)] = rand(0,10);
	// $packetsReceived['node'.getRandomNode(0,20,$p)] = rand(0,10);


	$data['packetsSent'] = $packetsSent;
	$data['packetsReceived'] = $packetsReceived;

	header('Access-Control-Allow-Origin: *');
	echo json_encode($data);
