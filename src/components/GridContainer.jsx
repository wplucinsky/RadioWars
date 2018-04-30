class GridContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			capture: {
				id: 0,
				node: -1,
			},
			currNode: window._node,
			draw: {
				color: 'black',
				id: 0,
				options: null,
			}
		}

		this.nodes = new Nodes();
		this.grid = new Grid();

		this.processKeyboard = this.processKeyboard.bind(this);
	}

	componentDidMount(){
		this.setState({
			draw: { 
				id: this.state.currNode, 
				color: 'black', 
				options: null
			}
		});

		this.grid.setup([], 'grid', undefined)
		this.rectangles = this.grid.getRectangles();
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;

		if(this.props.keyboardUpdate){
			this.processKeyboard();
		}
		if(this.props.clickUpdate){
			this.processClick();
		}
	}

	processKeyboard(){
	/*
		Processes the keyboard controls combing from the Content component
		and sends them to the canvas elements created by this component.
	*/
		var ctrl = this.state,
			nearby = this.nodes.getSurroundingNodes(ctrl.currNode),
			data = {
				draw: null,
				capture: {
					id: 0,
					node: -1,
				},
				currNode: 0,
			};

		// escape capture / do nothing
		if ( this.props.keyboard.esc == 1) {				
			if ( ctrl.capture.id > 0 ){
				ctrl.capture.id = 0;
				data.currNode = ctrl.capture.node;
				$('#gridConfirmChanges').css('display', 'none');
				data.draw = { id: ctrl.capture.node, color: 'black', options: null};
			} else {
				data.draw = { id: ctrl.currNode, color: 'black', options: null};
			}
		} 

		// capture (part 1): start
		else if ( this.props.keyboard.id == 1) {
			data.capture.id = 2;
			data.capture.node = ctrl.currNode;
			data.currNode = ctrl.currNode;
			$('#gridConfirmChanges').css('display', 'block');

			data.draw = { id: ctrl.currNode, color: 'green', options: {dash: 1}};
		} 

		// capture (part 3): finish
		else if ( ctrl.capture.id == 3 && this.props.keyboard.select == 1) {
			$('#gridConfirmChanges').css('display', 'none');
			data.draw = { id: ctrl.capture.node, color: 'black', options: {capture: 1, node1: ctrl.capture.node, node2: ctrl.currNode}};
			
			data.currNode = ctrl.capture.node;
			ctrl.capture.id = 0;
			ctrl.capture.node = -1;
			data.capture.id = 0;
			data.capture.node == -1;
		} 

		// capture (part 2) move
		else if ( ctrl.capture.id >= 2) {
			if ( this.props.keyboard.mdirection != -1 && 
				nearby[this.props.keyboard.mdirection] != -1 && 
				nearby[this.props.keyboard.mdirection] != ctrl.capture.node
			) {
				data.capture.id = 3;
				data.capture.node = ctrl.capture.node;
				data.currNode = nearby[this.props.keyboard.mdirection];

				data.draw = { id: data.currNode, color: 'black', options: {redraw: ctrl.capture.node, dash: 1}};
			} else {
				data.capture.id = 2;
				data.capture.node = ctrl.capture.node
				data.currNode = ctrl.currNode;

				data.draw = { id: ctrl.currNode, color: 'red', options: {redraw: ctrl.capture.node, dash: 1}};
			}
		}  

		// move around
		else if ( this.props.keyboard.move == 1 ) {
			if ( this.props.mdirection != -1 && nearby[this.props.keyboard.mdirection] != -1 ) {
				data.currNode = nearby[this.props.keyboard.mdirection];
				data.draw = { id: data.currNode, color: 'black', options: null};
			} else {
				data.currNode = ctrl.currNode;
				data.draw = { id: ctrl.currNode, color: 'red', options: null};
			}
		} 

		// update radio
		else if ( this.props.keyboard.select == 1) {
			ctrl.capture.id = 0;
			data.currNode = ctrl.currNode;
			data.draw = { id: ctrl.currNode, color: 'green', options: {select: 1}};
		} 

		// start interference
		else if ( this.props.keyboard.interference  == 1) {
			data.currNode = ctrl.currNode;
			data.draw = { id: ctrl.currNode, color: 'orange', options: {interference: 1}};
		}

		// invalid keypress, use previous data
		else {
			// bug when control then go left & right
			data.draw = ctrl.draw;
			data.capture = ctrl.capture;
			data.currNode = ctrl.currNode;
		}

		// update the state
		ctrl.draw = data.draw;
		ctrl.capture = (data.capture.id == 0 && data.capture.node == -1) ? ctrl.capture : data.capture;
		ctrl.currNode = data.currNode;
		this.props.returnKeyboard(data.currNode)
	}

	processClick() {
	/*
		If in capture mode: moves to the node with a dashed line.
		If in move mode: moves to the node.
	*/
		var ctrl = this.state,
			data = {
				draw: null,
				capture: {
					id: 0,
					node: -1,
				},
				currNode: 0,
			};

		var {x, y} = this.props.click;
		var rect = this.rectangles.filter((element, index) => {
			if (y > element.y && y < element.y + element.height && x > element.x && x < element.x + element.width) {
				element.index = index;
				return element;
			} else {
				console.log('no elem')
			}
		})[0];

		if (rect) {
			if ( ctrl.capture.id >= 2) {
				if (rect.index != ctrl.capture.node) {
					data.capture.id = 3;
					data.capture.node = ctrl.capture.node;
					data.currNode = rect.index;

					data.draw = { id: data.currNode, color: 'black', options: {redraw: ctrl.capture.node, dash: 1}};
				} else {
					data.capture.id = 2;
					data.capture.node = ctrl.capture.node
					data.currNode = ctrl.currNode;

					data.draw = { id: ctrl.currNode, color: 'red', options: {redraw: ctrl.capture.node, dash: 1}};
				}
			} else {
				data.currNode = rect.index;
				data.draw = { id: data.currNode, color: 'black', options: null};
			}

			// update the state
			ctrl.draw = data.draw;
			ctrl.capture = (data.capture.id == 0 && data.capture.node == -1) ? ctrl.capture : data.capture;
			ctrl.currNode = data.currNode;
			this.props.returnClick(1)
		}
	}
	
	render() { 
		return (
			<div className="row" id="node_graph_container">
				<div className="col-md-12 grid-holder" id="react_grid">
					<h4 className="text-center">Grid Nodes</h4>
					<span id="gridConfirmation"></span>
					<span id="gridConfirmChanges">use WASD and ENTER keys to capture a node</span>
					<div id="gridLine" className="line"></div>
					<div id="gridViewContainer">
						<div className="canvas chart" id="gridView">
							<GridCanvas currNode={this.state.currNode} draw={this.state.draw} capture={this.state.capture} />
							<AnimationsCanvas currNode={this.state.currNode} draw={this.state.draw} returnData={this.props.returnData} />
							<KeyboardCanvas currNode={this.state.currNode} draw={this.state.draw} />
							<InterferenceCanvas currNode={this.state.currNode} draw={this.state.draw} update={this.props.update} />
							<ClickCanvas />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function processOptions(o){
/*
	Used by all the canvas elements to process the draw options.
*/
	var base = {select: 0, interference: 0, dash: 0, redraw: -1, clear: 1, capture: 0};
	if ( o == undefined ){ return base; }
	for (let k in base){
		if (! o.hasOwnProperty(k)) {
			o[k] = base[k]
		}
	}
	return o;
}