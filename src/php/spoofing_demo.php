<?php
	header('Access-Control-Allow-Origin: *');

	function getParent(){
		return array(10, 3);
	}
	function getParentColors(){
		return array('#3498db', '#f1c40f');
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
		Packets go from 10 to 3
	*/
		$ret = array();
		$c = getParentColors();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			if ($par == 10){
				foreach (getParent() as $key2 => $par2) {
					$packetsReceived['node'.$par2] = $t*$t;
				}
				$data['packetsReceived'] = $packetsReceived;
			}

			array_push($ret, $data);
		}

		return $ret;
	}

	function round3($m, $t = 0){
	/*
		Packets go from spoofed 15 ( actually 10 ) to 3
	*/
		$ret = array();
		$c = getParentColors();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			array_push($ret, $data);
		}

		$par = 15;
		$data = array();
		$packetsReceived = array();
		$data['_id'] = "node".$par;
		$packetsReceived['node3'] = $t*$t;
		$data['packetsReceived'] = $packetsReceived;

		array_push($ret, $data);

		return $ret;
	}

	if ( isset($_GET['demo']) && $_GET['m'] <= 1 ) {
		$data = round1();
	} elseif ( isset($_GET['demo']) && $_GET['m'] <= 6 ) {
		$data = round2(5, $_GET['m']-1);
	} elseif ( isset($_GET['demo']) && $_GET['m'] >= 9 && $_GET['m'] <= 14 ) {
		$data = round3(5, $_GET['m']-9);
	} else {
		$data = round1();
	}

	echo json_encode($data);