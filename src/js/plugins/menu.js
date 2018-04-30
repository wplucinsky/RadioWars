// collapsing sidebar
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
});

// showing / hiding modules
$('#sidebar ul li a').on('click', function () {
	nm = this.text.replace(' ', '_').toLowerCase() + '_container';
	$('#'+nm).toggleClass('hidden');
	$(this).toggleClass('active');
});





function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   }
}

function setViewerCanvasScale() {
	s = ($(window).height() - 40)/550;
	p = ($(window).height() - 40)/500^2 * 50.0 + 50;
	$('.viewer > #grid').css({'transform': 'scale('+s+','+s+')', 'padding-top': p+'px'});
	$('.viewer > #animations').css({'transform': 'scale('+s+','+s+')', 'padding-top': p+'px'});
	$('.viewer > #keyboard').css({'transform': 'scale('+s+','+s+')', 'padding-top': p+'px'});
	$('.viewer > #interference').css({'transform': 'scale('+s+','+s+')', 'padding-top': p+'px'});
}

// warning for small displays on resize
$(window).resize(
	debouncer(function(e){	
	setViewerCanvasScale()
    if ($(window).width() < 768) {
		$('#sizeWarning').toggleClass('hidden');
		setTimeout(function(){
			$('#sizeWarning').toggleClass('hidden');
		}, 2000);
	}
}));



// warning for small displays on load
if ($(window).width() < 768) {
	$('#sizeWarning').toggleClass('hidden');
	setTimeout(function(){
		$('#sizeWarning').toggleClass('hidden');
	}, 2000)
}

setViewerCanvasScale()