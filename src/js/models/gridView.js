var gridView_model = {
	rectangles: gridView_initialize(),
	intervals: {}
}

gridView_default = {
	type: 'custom',
	position: 5,
	size: '350x350'
}

function gridView_initialize(){
	var rects = []
	for (let i=0; i<=4; i++){
		for (let j=0; j<=3; j++){
			var rect = {}
			rect.x = (75 * i) + (i * 5) + 5;
			rect.y = (75 * j) + (j * 5) + 5;
			rect.width = 25;
			rect.height = 25;
			rect.borderWidth = 5;
			rects.push(rect);
		}
	}
	return rects
}