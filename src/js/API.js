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

const config = {
	radio_controls: [
		{
			name: 'power',
			value: "900",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'rxGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'txGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frequency',
			value: "900e6",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'sampleRate',
			value: "250e3",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frameSize',
			value: "1024",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
	],
	interference_controls: [
		{
			name: 'power',
			value: "900",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'rxGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'txGain',
			value: "35.0",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frequency',
			value: "900e6",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'sampleRate',
			value: "250e3",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
		{
			name: 'frameSize',
			value: "1024",
			type: "text",
			team: 1,
			min: 0,
			max: 1000,
			step: 50,
		},
	],
	modules: [
		{
			name: 'Radio Controls',
			active: 1,
		},{
			name: 'Antenna Controls',
			active: 1,
		},{
			name: 'Interference Controls',
			active: 0,
		},{
			name: 'Server Output',
			active: 1,
		},{
			name: 'Node Graph',
			active: 1,
		},{
			name: 'Score Graph',
			active: 0,
		},{
			name: 'Waterfall',
			active: 0,
		},{
			name: 'Radio Characteristics',
			active: 1,
		},
	],
};