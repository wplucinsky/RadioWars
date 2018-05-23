<?php
	header('Access-Control-Allow-Origin: *');

	function getParent(){
		return array(10, 14, 5, 16, 17, 15, 3);
	}
	function getParentColors(){
		return array('#3498db', '#f1c40f', '#d35400', '#e74c3c', '#1abc9c', '#8e44ad', '#2c3e50');
	}

	function round1(){
	/*
		Set colors of nodes.
	*/
		$ret = array();
		$c = getParentColors();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsSent = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];
		
			array_push($ret, $data);
		}
		return $ret;
	}

	function round2($m, $t = 0){
	/*
		Transmit encrypted message from TA to outer nodes
	*/
		$ret = array();
		$c = getParentColors();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			if ($par == 3){
				foreach (getParent() as $key2 => $par2) {
					$packetsReceived['node'.$par2] = $t;
				}
				$data['packetsReceived'] = $packetsReceived;
			}

			array_push($ret, $data);
		}

		return $ret;
	}

	function round3($m, $t = 0){
	/*
		Transmit decrypted message from nodes to TA
	*/
		$ret = array();
		$c = getParentColors();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			$packetsReceived['node3'] = $t;
			$data['packetsReceived'] = $packetsReceived;

			array_push($ret, $data);
		}

		return $ret;
	}

	function appendEncryption(&$data) {
		foreach ($data as $key => &$value) {
			$value['encrypted'] = 'ebiil';
		}
	}

	function appendDecryption(&$data) {
		foreach ($data as $key => &$value) {
			$value['decrypted'] = 'hello';
			$value['method'] = 'substitution';
		}
	}

	if ( isset($_GET['demo']) && $_GET['m'] <= 1 ) {
		$data = round1();
	} elseif ( isset($_GET['demo']) && $_GET['m'] <= 6 ) {
		$data = round2(5, $_GET['m']-1);
		if ($_GET['m'] > 3) {
			appendEncryption($data);
		}
	} elseif ( isset($_GET['demo']) && $_GET['m'] >= 9 && $_GET['m'] <= 14 ) {
		$data = round3(5, $_GET['m']-9);
		appendEncryption($data);
		appendDecryption($data);
	} elseif ( isset($_GET['demo']) && $_GET['m'] >= 19 && $_GET['m'] <= 24 ) {
		$data = round3(5, $_GET['m']-19);
		appendEncryption($data);
		appendDecryption($data);
	} elseif ( isset($_GET['demo']) && $_GET['m'] == 8 || ($_GET['m'] >= 9 && $_GET['m'] <= 19) ) {
		$data = round1();
		appendEncryption($data);
		appendDecryption($data);
	} else {
		$data = round1();
		if ($_GET['m'] >= 3) {
			appendEncryption($data);
		}
	}

	echo json_encode($data);