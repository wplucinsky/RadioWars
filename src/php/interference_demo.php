<?php
	header('Access-Control-Allow-Origin: *');

	function random_color_part() {
		return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
	}

	function random_color() {
		return random_color_part() . random_color_part() . random_color_part();
	}

	function getParent(){
		return array(10, 14, 5, 16, 17, 15);
	}
	function getParentColors(){
		return array('#1abc9c', '#f1c40f', '#d35400', '#e74c3c', '#3498db', '#8e44ad');
	}
	function getChild(){
		return array(18, 13, 9, 11, 50, 12, 8, 6, 7);
	}
	function getChildOwner(){
		return array('', '#1abc9c', '#f1c40f', '#d35400', '', '#e74c3c', '#3498db', '', '#8e44ad');
	}

	function round1($m){
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
		$ret = array();
		$c = getParentColors();
		$chi = getChild();
		$o = getChildOwner();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			foreach (getChildOwner() as $key2 => $chOwn) {
				if ( $chOwn == $c[$key] ) {
					if ($par == 10 && $t <= 5){
						$packetsReceived['node'.$chi[$key2]] = $t*$t;
						$data['packetsReceived'] = $packetsReceived;
					} elseif ( $par != 10 && $t > 4 && $t <= 11){
						$packetsReceived['node'.$chi[$key2]] = $t*$t;
						$data['packetsReceived'] = $packetsReceived;
					} elseif ( $par != 10 && $t > 14 && $t < 18 ) {
						$packetsReceived['node'.$chi[$key2]] = $t*$t;
						$data['packetsReceived'] = $packetsReceived;
					}
				}
			}

			array_push($ret, $data);
		}

		// 13 captures 50
		if ( $t > 5){
			$par = 13;
			$data = array();
			$packetsReceived = array();
			$data['_id'] = "node".$par;
			$data['owner'] = '#1abc9c';
			if ( $t > 6 && $t <= 10){
				$packetsReceived['node50'] = $t*$t;
				$data['packetsReceived'] = $packetsReceived;
			}
			array_push($ret, $data);
		}
		if ( $t >= 10){
			$par = 50;
			$data = array();
			$packetsReceived = array();
			$data['_id'] = "node".$par;
			$data['owner'] = '#1abc9c';
			array_push($ret, $data);
		}

		if ($t > 16){
			foreach (getChild() as $key => $chi) {
				$data = array();
				$packetsReceived = array();

				$data['_id'] = "node".$chi;
				
				if ($o[$key] != '') {
					$data['owner'] = $o[$key];
				}

				array_push($ret, $data);
			}
		}

		return $ret;
	}

	function round3($m){
		$ret = array();
		$c = getParentColors();
		$chi = getChild();
		$o = getChildOwner();
		foreach (getParent() as $key => $par) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$par;
			$data['owner'] = $c[$key];

			foreach (getChildOwner() as $key2 => $chOwn) {
				if ( $chOwn == $c[$key] ) {
					if ($m >= 23){
						$packetsReceived['node'.$chi[$key2]] = 22*22;
						if ( $par == 14 ){
							$packetsReceived['node'.$chi[$key2]] = $m*$m;
						}
					} elseif (!( $m >= 16 && $m <= 19)){
						if (!($m - 10 > 0 && $key > ($m - 10))){
							$packetsReceived['node'.$chi[$key2]] = $m*$m;
						}
					}
				}
			}
			$data['packetsReceived'] = $packetsReceived;

			array_push($ret, $data);
		}

		foreach (getChild() as $key => $chi) {
			$data = array();
			$packetsReceived = array();

			$data['_id'] = "node".$chi;
			
			if ( $m > 20 || $chi == 13) {
				if ($o[$key] != '') {
					$data['owner'] = $o[$key];
				}
			} 

			array_push($ret, $data);
		}
		return $ret;
	}

	if ( isset($_GET['demo']) && $_GET['m'] == 1 ) {
		$data = round1($_GET['m']);
	} elseif ( isset($_GET['demo']) && $_GET['m'] <= 20 ) {
		$data = round2(5, $_GET['m']);
	} 
	// elseif ( isset($_GET['demo']) && $_GET['m'] <= 20 ) {
	// 	$data = round3($_GET['m']);
	// } elseif ( isset($_GET['demo']) && $_GET['m'] >= 20) {
	// 	$data = round3($_GET['m']);
	// }


/*
	1. Can you send a picture of the viewer.html with the grids on the outside (Grid 10,14,5,16,17 and 15)
	as different colors
	
	2. Would be just a picture of say Grid 10 being red and sending packets to a neutral node say grid 13 
	which is gray and then another picture of it now red
	
	3. Would be grid 10 and grid 13 are now red and interference is being generated showing the animation 
	and the bar showing interference generation
	
	4.  Last one would be all originally neutral nodes are a corresponding color from the outside nodes.  
	Then showing some packets being sent across and interference being generated.  Just showing that all 
	grids were captured by different teams and such
*/

	echo json_encode($data);