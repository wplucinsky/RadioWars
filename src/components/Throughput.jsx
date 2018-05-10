class Throughput extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.state = {
			selectedNode: this.props.startNodeReal,
			chart_data: {
				type: 'line',
				data: {
					labels: [],
					datasets: []
				},
				options: {
					legend: {
						display: false
					},
					responsive: true,
					title: {
						display: true,
						text: 'Throughput Plot - Node '+this.props.startNodeReal
					},
					tooltips: {
						mode: 'index',
						intersect: false,
					},
					hover: {
						mode: 'nearest',
						intersect: true
					},
					scales: {
						xAxes: [{
							display: false,
							scaleLabel: {
								display: false,
								labelString: 'Month'
							}
						}],
						yAxes: [{
							display: true,
							stacked: false,
							scaleLabel: {
								display: true,
								labelString: 'Value'
							}
						}]
					}
				}
			}
		};

		this.handleChange = this.handleChange.bind(this);
		this.processData = this.processData.bind(this);
		this.handleRemoveClick = this.handleRemoveClick.bind(this);
	}

	componentDidMount(){
		this.startTimer();
	}


	componentWillReceiveProps(nextProps){
		this.props = nextProps;
	}

	handleChange(event){
	/*
		Set selectedNode in the state to the dropdown selected node. Also update the
		chart title, and remove all data from the chart in the state.
	*/
		let chart_data = this.state.chart_data;
		chart_data.options.title.text = 'Throughput Plot - Node '+event.target.value;
		chart_data.data.labels = [];
		chart_data.data.datasets = [];

		this.setState({
			chart_data: chart_data,
			selectedNode: event.target.value
		});
	}

	processData(data){
		// TODO
		console.log(data);
	}

	startTimer() {	
	/*
		Throughput data only updates every 5 seconds, so data should only be plotted
		every 5 seconds.
	*/
		var self = this;
		this.timer = window.setInterval(function(){
			self.processData(self.props.data);
		}, 5000);
	}

	handleRemoveClick(event){
	/*
		Clear the timer started above and call parent fn to remove this component instance.
	*/
		clearInterval(this.timer);
		this.props.remove(this.props.cnt)
	}

	render() { 
		const style = {
			backgroundColor: $('.line').css('background-color')
		};
		return (
			<div className="col-md-6 team_x">
				<h4 className="text-center">Graph {this.props.cnt}</h4>
				<button onClick={this.handleRemoveClick} type="button" id="sidebarCollapse" className="navbar-btn remove-btn">
					<span></span>
					<span></span>
					<span></span>
				</button>
				<div className="line" style={style}></div>
				<div id="throughput">
					<div className="form-group">
						<label htmlFor="node" className="node-sel-l">Node ID: </label>
						<select name="node" className="form-control node-sel-r" value={this.state.selectedNode} onChange={this.handleChange}>	
							{this.props.availableNodes.map((item, key) => {
								return <option key={key} value={item}>{item}</option>;
							})}
						</select>
					</div>
					<ThroughputPlot data={this.state.chart_data} node={this.state.selectedNode} cnt={this.props.cnt}/>
				</div>
			</div>
		);
	}
}