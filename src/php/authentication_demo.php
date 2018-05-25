<?php
/*		
	Actual Formation
		10 	18		12	16
			13	4	8
		14	9	3	6 	17
		 	11 	50 	7
		5				15
*/

	header('Access-Control-Allow-Origin: *');

	$nodes = array(10, 14, 5, 18, 13, 9, 11, 4, 50, 12, 8, 6, 7, 16, 17, 15, 3);
	$validNodes	= array(true, false, false, true, true, false, false, true, false, false, false, false, false, false, false, false, false);

	function colors(){
	/*
		Set colors of nodes.
	*/
		$ret = array();
		$data = array();
		$packetsSent = array();
		$packetsReceived = array();

		$data['_id'] = "node3";
		$data['owner'] = '#f1c40f';
	
		$data['packetsReceived'] = $packetsReceived;
		array_push($ret, $data);
		
		return $ret;
	}

	function tryNode($node, $m){
		$ret = array();
		$data = array();
		$packetsReceived = array();

		$data['_id'] = "node".$node;
		$data['owner'] = '#f1c40f';

		$packetsReceived['node3'] = $m*2;
		$data['packetsReceived'] = $packetsReceived;

		$data['previous'] = $_GET['spoof'];
		array_push($ret, $data);

		return $ret;
	}

	function response($node, $color, $m){
		$ret = array();
		$data = array();
		$packetsReceived = array();

		$data['_id'] = "node3";
		$data['owner'] = $color;

		$packetsReceived['node'.$node] = $m*2;
		$data['packetsReceived'] = $packetsReceived;

		$data['previous'] = '';
		array_push($ret, $data);

		return $ret;
	}


	// start with colors
	if ( isset($_GET['demo']) && $_GET['m'] <= 1 ) {
		$data = colors();
	} elseif ( isset($_GET['demo']) ) {
		/*
			if previous is set, respond from 3 with answer
		*/
		if (isset($_GET['prev']) && $_GET['prev'] != '') {
			if ($validNodes[array_search($_GET['prev'], $nodes)]) {
				$data = response($_GET['prev'], 'green', $_GET['m']);
			} else {
				$data = response($_GET['prev'], 'red', $_GET['m']);
			}
		}
		/*
			if previous is not set, respond from spoof node
		*/
		else {
			$data = tryNode($_GET['spoof'], $_GET['m']);
		}
	}

	echo json_encode($data);