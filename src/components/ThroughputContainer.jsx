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
		$('.line').css('background-color', 'rgb(54, 162, 235)');
	}


	componentWillReceiveProps(nextProps){
		this.props = nextProps;
	}

	handleClick(event){
		var cnt = this.state.cnt;
		let i = cnt[cnt.length - 1];
		cnt.push( (i === undefined) ? 1 : i + 1 );

		this.setState({
			cnt: cnt
		});
	}

	remove(id){
		var cnt = this.state.cnt;
		cnt.splice(cnt.indexOf(id), 1);

		this.setState({
			cnt: cnt
		});
	}
	

	render() { 
		return (
			<div className="row" id="radio_characteristics_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Radio Characteristics</h4>
					<div className="line"></div>
						<div className="row">
							<div className="col-md-12 center">
								<button className="btn btn-primary" onClick={this.handleClick} >Add Graph</button>
							</div>
						</div>
						{this.state.cnt.map((item, i) => {
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