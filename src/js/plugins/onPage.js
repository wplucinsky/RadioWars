// https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active

(function() {
	var hidden = "hidden";

	if (hidden in document)
		document.addEventListener("visibilitychange", onchange);
	else if ((hidden = "mozHidden") in document)
		document.addEventListener("mozvisibilitychange", onchange);
	else if ((hidden = "webkitHidden") in document)
		document.addEventListener("webkitvisibilitychange", onchange);
	else if ((hidden = "msHidden") in document)
		document.addEventListener("msvisibilitychange", onchange);
	else if ("onfocusin" in document)
		document.onfocusin = document.onfocusout = onchange;
	else
		window.onpageshow = window.onpagehide
		= window.onfocus = window.onblur = onchange;

	function onchange (evt) {
		var v = "visible", h = "hidden",
			evtMap = {
				focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
			};

		evt = evt || window.event;
		if (evt.type in evtMap) {
			document.body.className = evtMap[evt.type];
		} else {
			document.body.className = this[hidden] ? "hidden" : "visible";
		}
	}

	if( document[hidden] !== undefined ){
		onchange({type: document[hidden] ? "blur" : "focus"});
	}
})();