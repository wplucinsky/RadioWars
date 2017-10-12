/*
	This script provides the functionality to the gridView module.
*/
	function gridView_drawRectangles(r, context) {
		for (let i in r){
			context.beginPath();
			context.rect(r[i].x, r[i].y, r[i].width, r[i].height);
			context.fillStyle = colors.grey;
			context.fill();
			context.lineWidth = r[i].borderWidth;
			context.strokeStyle = colors.grey;
			context.stroke();
		}
	}

	function gridView_on(node, r, context){
		// clear the spot
		context.clearRect(r[node].x-3, r[node].y-3, r[node].width+8, r[node].height+8);

		// right over it
		context.beginPath();
		context.rect(r[node].x, r[node].y, r[node].width, r[node].height);
		context.fillStyle = colors.green;
		context.fill();
		context.lineWidth = r[node].borderWidth;
		context.strokeStyle = colors.grey;
		context.stroke();
	}

	function gridView_off(node, r, context){
		// clear the spot
		context.clearRect(r[node].x-3, r[node].y-3, r[node].width+8, r[node].height+8);

		// right over it
		context.beginPath();
		context.rect(r[node].x, r[node].y, r[node].width, r[node].height);
		context.fillStyle = colors.grey;
		context.fill();
		context.lineWidth = r[node].borderWidth;
		context.strokeStyle = colors.grey;
		context.stroke();
	}

	function gridView_update(user, data, node) {
		startInterval(user, node-1, 'gridView', data.PacketsRecieved)
	}