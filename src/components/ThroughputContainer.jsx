class ThroughputContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cnt: [1,]
		};

		this.nodes = new Nodes();
		this.availableNodes = this.nodes.getRealLocations();

		this.handleClick = this.handleClick.bind(this);
		this.remove = this.remove.bind(this);
	}

	componentDidMount(){

	}


	componentWillReceiveProps(nextProps){
		this.props = nextProps;
	}

	handleClick(event){
		let i = this.state.cnt[this.state.cnt.length - 1];
		this.state.cnt.push( (i === undefined) ? 1 : i + 1 );
		console.log(this.state.cnt)
	}

	remove(id){
		console.log(this.state)
		this.state.cnt.splice(this.state.cnt.indexOf(id), 1);
	}
	

	render() { 
		return (
			<div className="row" id="throughput_graphs_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Throughput Graphs</h4>
					<div className="line"></div>
						<button className="btn btn-primary" onClick={this.handleClick} >Add Throughput Graph</button>
						{this.state.cnt.map((item, i) => {
							console.log(item, i)
							return <Throughput 
								remove={this.remove} 
								data={this.props.data} 
								startNode={this.props.startNode} 
								startNodeReal={this.nodes.getNodeLocationReal(this.props.startNode)}
								key={i} 
								cnt={item}
								availableNodes={this.availableNodes}/>
						})}
				</div>
			</div>
		);
	}
}