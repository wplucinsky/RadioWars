class Throughput extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.state = {
			selectedNode: this.props.startNodeReal,
			type: 'throughput',
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
								labelString: 'Time'
							}
						}],
						yAxes: [{
							display: true,
							stacked: false,
							scaleLabel: {
								display: true,
								labelString: 'bytes/sec'
							}
						}]
					}
				}
			}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.processData = this.processData.bind(this);
		this.handleRemoveClick = this.handleRemoveClick.bind(this);
	}

	componentDidMount(){
		this.startTimer();
	}

	componentWillUnmount(){
		clearTimeout(this.timer);
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
		chart_data.options.title.text = capitalize(this.state.type)+' Plot - Node '+event.target.value;
		chart_data.data.labels = [];
		chart_data.data.datasets = [];

		this.setState({
			chart_data: chart_data,
			selectedNode: event.target.value
		});
	}

	handleTypeChange(event){
		let chart_data = this.state.chart_data;
		chart_data.options.title.text = capitalize(event.target.value)+' Plot - Node '+this.state.selectedNode;
		chart_data.options.scales.yAxes[0].scaleLabel.labelString = (event.target.value == 'throughput') ? 'bytes/sec' : 'dB';
		chart_data.data.labels = [];
		chart_data.data.datasets = [];

		this.setState({
			chart_data: chart_data,
			type: event.target.value
		});
	}

	processData(data){
		if ( data == null || data == undefined || $('#radio_characteristics_container').css('display') == 'none' ){ return; } 
		
		let chart_data = this.state.chart_data;
		for (let i = 0; i < data.length; i++){
			if (data[i]._id == ('node'+this.state.selectedNode) && data[i][this.state.type] != undefined ){
				
				if (chart_data.data.datasets.length == 0) {
					chart_data.data.datasets.push({
						label: 'Node '+ this.state.selectedNode,
						borderColor: 'black',
						data: [],
						fill: false,
					});
				}

				chart_data.data.datasets[0].data.push(parseFloat(data[i][this.state.type]));
				chart_data.data.labels.push(1);

				if (chart_data.data.datasets[0].data.length >= 16) {
					chart_data.data.datasets[0].data.shift();
					chart_data.data.labels = Array.apply(null, Array(chart_data.data.datasets[0].data.length)).map(Number.prototype.valueOf,1)
				}
			}
		}

		this.setState({
			chart_data: chart_data
		});
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
						<select name="type" className="form-control node-sel-t" value={this.state.type} onChange={this.handleTypeChange}>	
							<option value='throughput'>Throughput</option>
							<option value='rssi'>RSSI</option>
							<option value='evm'>EVM</option>
						</select>
					</div>
					<ThroughputPlot data={this.state.chart_data} node={this.state.selectedNode} cnt={this.props.cnt}/>
				</div>
			</div>
		);
	}
}