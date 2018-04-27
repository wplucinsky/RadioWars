class Waterfall extends React.Component {
	constructor(props) {
		super(props);
		this.src = '/src/img/waterfall/waterfall_plot.png'
	}

	componentDidMount(){
		
	}

	render() { 
		return (
			<div className="row" id="score_graph_container">
				<div className="col-md-12 team_x">
					<h3 className="text-center">Waterfall</h3>
					<div className="line" style="background-color: rgb(241, 196, 15);"></div>
					<div id="waterfall">
						<img src={this.src}></img>
					</div>
				</div>
			</div>
		);
	}
}