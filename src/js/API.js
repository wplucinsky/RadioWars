var api = new API();

function API(){
	this.get = function(url, callbackFunc) {
		$.ajax({
			type:"GET",
			url:url,
			success: callbackFunc,
			dataType: "json",
		});
	}

	this.post = function(url, data, callbackFunc) {
		$.ajax({
			type:"POST",
			url:url,
			success: callbackFunc,
			data: JSON.stringify(data),
			contentType: "application/json"
		});
	}

	this.postOrig = function(url, data, callbackFunc) {
		$.ajax({
			type:"POST",
			url:url,
			success: callbackFunc,
			data: data,
			dataType: "json"
		});
	}

	this.authenticate = function(){
		var a = this;
		$.ajax({
			type:"POST",
			url:'http://dwslgrid.ece.drexel.edu:5000/auth',
			success: function(data){ 
				console.log(data, a)
				if (!data.success){
					a.setCookie('_id', null, 7)
					a.setCookie('team_id', null, 7)
					window.location.href = 'login.html';
				} else {
					a.setCookie('_id', data.cookie, 7)
					a.setCookie('team_id', data.team_id, 7)
				}
			},
			data: { hash: document.cookie._id },
			dataType: 'json',
		});
	}

	this.setCookie = function(c_name,c_value,exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		document.cookie=encodeURIComponent(c_name) 
			+ "=" + encodeURIComponent(c_value)
			+ (!exdays ? "" : "; expires="+exdate.toUTCString());
		;
	}

	this.getCookie = function(name) {
		match = document.cookie.match(new RegExp(name + '=([^;]+)'));
		if (match) return match[1];
	}

	$( document ).ajaxError(function( event, request, settings ) {
		$('#serverOutput').text("Error requesting page " + settings.url);
	});
}