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

// warning for small displays on resize
$(window).resize(debouncer(function(e){
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