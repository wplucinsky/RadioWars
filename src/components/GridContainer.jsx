class GridContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			capture: {
				id: 0,
				node: -1,
				m_id: 0,
				m_node: -1,
			},
			currNode: window._node,
			draw: {
				color: 'black',
				id: window._node,
				options: null,
			}
		}

		this.grid = new Grid();

		this.processKeyboard = this.processKeyboard.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
		if (this.props.viewer == 0){
			this.setState({
				draw: { 
					id: this.state.currNode, 
					color: 'black',
					options: null
				}
			});
		}

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
			nearby = window._nodes.getSurroundingNodes(ctrl.currNode),
			control = {c_start: -1, m_start: -1},
			data = {
				draw: null,
				capture: {
					id: 0,
					m_id: 0,
					node: -1,
					m_node: -1,
				},
				currNode: 0,
			};

		// escape capture / do nothing
		if ( this.props.keyboard.esc == 1) {
			control.c_start = 0;
			control.m_start = 0;			
			if ( ctrl.capture.id > 0 ){
				ctrl.capture.id = 0;
				data.currNode = ctrl.capture.node;
				$('#gridConfirmChanges').css('display', 'none');
				data.draw = { id: ctrl.capture.node, color: 'black', options: null};
			} else if ( ctrl.capture.m_id > 0 ){
				ctrl.capture.m_id = 0;
				data.currNode = ctrl.capture.m_node;
				$('#gridConfirmChanges').css('display', 'none');
				data.draw = { id: ctrl.capture.m_node, color: 'black', options: null};
			} else {
				data.currNode = ctrl.currNode;
				data.draw = { id: ctrl.currNode, color: 'black', options: null};
			}
		} 

		// capture (part 1): start
		else if ( this.props.keyboard.id == 1 && this.props.keyboard.c_start == 0 && this.props.keyboard.m_start == 0) {
			if (!this.isOwnedNode(window._nodes.getNodeLocationReal(ctrl.currNode))) { return; }

			control.c_start = 1;
			data.capture.id = 2;
			data.capture.node = ctrl.currNode;
			data.currNode = ctrl.currNode;
			$('#gridConfirmChanges').text('use WASD and ENTER keys to capture a node');
			$('#gridConfirmChanges').css('display', 'block');

			data.draw = { id: ctrl.currNode, color: 'green', options: {dash: 1}};
		} 

		// mgen (part 1): start
		else if ( this.props.keyboard.m_id == 1 && this.props.keyboard.c_start == 0 && this.props.keyboard.m_start == 0) {
			control.m_start = 1;
			if (!this.isOwnedNode(window._nodes.getNodeLocationReal(ctrl.currNode))) { return; }
			data.capture.m_id = 2;
			data.capture.m_node = ctrl.currNode;
			data.currNode = ctrl.currNode;
			$('#gridConfirmChanges').text('use WASD and ENTER keys to start mgen between node');
			$('#gridConfirmChanges').css('display', 'block');

			data.draw = { id: ctrl.currNode, color: 'green', options: {dash: 1}};
		} 

		// capture (part 3): finish
		else if ( ctrl.capture.id == 3 && this.props.keyboard.select == 1) {
			control.c_start = 0;
			$('#gridConfirmChanges').css('display', 'none');
			data.draw = { id: ctrl.capture.node, color: 'black', options: {capture: 1, node1: ctrl.capture.node, node2: ctrl.currNode}};
			data.currNode = ctrl.capture.node;
			ctrl.capture.id = 0;
			ctrl.capture.node = -1;
			data.capture.id = 0;
			data.capture.node == -1;
		} 

		// megen (part 3): finish
		else if ( ctrl.capture.m_id == 3 && this.props.keyboard.select == 1) {
			control.m_start = 0;
			$('#gridConfirmChanges').css('display', 'none');
			data.draw = { id: ctrl.capture.m_node, color: 'black', options: {capture: 2, node1: ctrl.capture.m_node, node2: ctrl.currNode}};
			data.currNode = ctrl.capture.m_node;
			ctrl.capture.m_id = 0;
			ctrl.capture.m_node = -1;
			data.capture.m_id = 0;
			data.capture.m_node == -1;
		} 

		// capture (part 2) move
		else if ( ctrl.capture.id >= 2) {
			control.c_start = 1;
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

		// mgen (part 2) move
		else if ( ctrl.capture.m_id >= 2) {
			control.m_start = 1;
			if ( this.props.keyboard.mdirection != -1 && 
				nearby[this.props.keyboard.mdirection] != -1 && 
				nearby[this.props.keyboard.mdirection] != ctrl.capture.m_node
			) {
				data.capture.m_id = 3;
				data.capture.m_node = ctrl.capture.m_node;
				data.currNode = nearby[this.props.keyboard.mdirection];

				data.draw = { id: data.currNode, color: 'black', options: {redraw: ctrl.capture.m_node, dash: 1}};
			} else {
				data.capture.m_id = 2;
				data.capture.m_node = ctrl.capture.m_node
				data.currNode = ctrl.currNode;

				data.draw = { id: ctrl.currNode, color: 'red', options: {redraw: ctrl.capture.m_node, dash: 1}};
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
			if (!this.isOwnedNode(window._nodes.getNodeLocationReal(ctrl.currNode))) { return; }
			ctrl.capture.id = 0;
			data.currNode = ctrl.currNode;
			data.draw = { id: ctrl.currNode, color: 'green', options: {select: 1}};
		} 

		// start interference
		else if ( this.props.keyboard.interference  == 1 ) {
			if (!this.isOwnedNode(window._nodes.getNodeLocationReal(ctrl.currNode))) { return; }
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
		ctrl.capture = (data.capture.id == 0 && data.capture.node == -1) && (data.capture.m_id == 0 && data.capture.m_node == -1) ? ctrl.capture : data.capture;
		ctrl.currNode = data.currNode;
		this.props.returnKeyboard(data.currNode, control)
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
			} else if ( ctrl.capture.m_id >= 2) {
				if (rect.index != ctrl.capture.m_node) {
					data.capture.m_id = 3;
					data.capture.m_node = ctrl.capture.m_node;
					data.currNode = rect.index;

					data.draw = { id: data.currNode, color: 'black', options: {redraw: ctrl.capture.m_node, dash: 1}};
				} else {
					data.capture.m_id = 2;
					data.capture.m_node = ctrl.capture.m_node
					data.currNode = ctrl.currNode;

					data.draw = { id: ctrl.currNode, color: 'red', options: {redraw: ctrl.capture.m_node, dash: 1}};
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

	isOwnedNode(node){
	/*
		Returns a boolean and displays an error message to the user if no 
		one owns the node, or if someone else owns the node.
	*/
		if (!PERMISSIONS){
			return true;
		}

		var ownedNodes = window._nodes.getTakenNodes();
		if ( ownedNodes[node] == null || ownedNodes[node] != window._teamColor ){
			$('#gridConfirmChanges').text('you don\'t own this node');
			$('#gridConfirmChanges').css('display', 'block');
			setTimeout((function(){$('#gridConfirmChanges').text(''); $('#gridConfirmChanges').css('display', 'none');}), 2000);
			
			return false;
		}

		$('#gridConfirmChanges').text('');
		$('#gridConfirmChanges').css('display', 'none');
		return true;
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
							<KeyboardCanvas currNode={this.state.currNode} draw={this.state.draw} keyboardUpdate={this.props.keyboardUpdate} clickUpdate={this.props.clickUpdate} viewer={this.props.viewer}/>
							<InterferenceCanvas currNode={this.state.currNode} draw={this.state.draw} keyboardUpdate={this.props.keyboardUpdate} />
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