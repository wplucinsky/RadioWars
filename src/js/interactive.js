/*
	This script is to be used to control the non-module elemnts
	on the page.

	References:
		http://api.jquery.com/toggle/
*/
	function collapse(item){
		$('.'+$(item).attr('data')).toggle('slow');
	}

	function setDisplay(user){
		// nodes
		for (let i in user.nodes.available) {
			var s = "<li style='display: none' class='nav-item nodes";
			if ( $.inArray(user.nodes.available[i], user.nodes.active) !== -1 ){
				s += " active";
			}
			s += "'><a class='nav-link' data='"+user.nodes.available[i]
			s += "' onclick='nodes(this)'>Node "+user.nodes.available[i]+"</a></li>";
			$(s).appendTo($('#nodes'));
		}
	}