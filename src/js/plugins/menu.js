$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
});

$('#sidebar ul li a').on('click', function () {
	nm = this.text.replace(' ', '_').toLowerCase() + '_container';
	console.log(nm)
	$('#'+nm).toggleClass('hidden');
	$(this).toggleClass('active');
});