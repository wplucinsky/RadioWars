function API(){
	this.get = function(url, callbackFunc) {
		$.ajax({
			type:"GET",
			url:url,
			success: callbackFunc,
			dataType: 'json',
		});
	}

	this.post = function(url, data, callbackFunc) {
		$.ajax({
			type:"POST",
			url:url,
			success: callbackFunc,
			data: data,
			dataType: 'json',
		});
	}

	this.authenticate = function(){
		$.ajax({
			type:"POST",
			url:'http://dwslgrid.ece.drexel.edu:5000/auth',
			success: function(data){ console.log(data) },
			data: { hash: document.cookie._id },
			dataType: 'json',
		});
	}

	$( document ).ajaxError(function( event, request, settings ) {
		$('#serverOutput').text("Error requesting page " + settings.url);
	});
}