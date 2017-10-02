/*
	This script is to be used to control the non-module elemnts
	on the page.

	References:
		http://api.jquery.com/toggle/
*/
	function collapse(item){
		$('.'+$(item).attr('id')).toggle('slow');
	}