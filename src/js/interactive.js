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
			// active and available
			var s = "<li style='display: none' class='nav-item nodes";
			if ( $.inArray(user.nodes.available[i], user.nodes.active) !== -1 ){
				s += " active";
			}
			s += "'><a class='nav-link' data='"+user.nodes.available[i]
			s += "' onclick='nodes(this)'>Node "+user.nodes.available[i]+"</a></li>";
			$(s).appendTo($('#nodes'));

			// dropdown
			var n = "<option value='"+user.nodes.available[i]+"'>"+user.nodes.available[i]+"</option>";
			$(n).appendTo($('.node-select'));
		}
	}

	function team(item){
		// mark current team active
		$(".dropdown-item.active").removeClass("active"); 
		$(item).parent().addClass('active');

		// update team panel
		var id = $(item).attr('data');
		$('#team_id').text(id);
		dir = 'Forward';
		$('#direction_val').attr('src','src/img/Pattern'+dir+'.png');


		/* Update
			frequency_val
			power_val
			channel_val
			color_val
			direction_val
		*/
	}