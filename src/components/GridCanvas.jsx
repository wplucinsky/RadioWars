class GridCanvas extends React.Component {
	constructor(props) {
		super(props);
		
		this.grid = new Grid(); // src/js/Grid.js
		this.currNode = 0;
	}

	componentDidMount(){
		this.grid.setup([], 'grid', undefined)
		this.grid.start()	
	}

	componentDidUpdate() {

	}
	
	render() { 
		return (
			<canvas id="grid" width="600" height="550"></canvas>
		);
	}
}