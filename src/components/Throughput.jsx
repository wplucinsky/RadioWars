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
		this.change(this.state.type, event.target.value);
	}

	handleTypeChange(event){
		this.change(event.target.value, this.state.selectedNode);
	}

	change(type, node){
	/*
		Called by handleChange() and handleTypeChange(). Sets selectedNode in the 
		state to the dropdown selected node. Also update the chart title, and remove 
		all data from the chart in the state. Sets a variety of chart_date based on
		the selected value.
	*/
		let chart_data = this.state.chart_data;
		chart_data.options.title.text = capitalize(type)+' Plot - Node '+node;
		chart_data.data.labels = [];
		chart_data.data.datasets = [];

		if (type == 'tdma') {
			chart_data.type = 'bar';
			chart_data.options.scales.yAxes[0].scaleLabel.labelString = '';
		} else if (type == 'throughput') {
			chart_data.options.scales.yAxes[0].scaleLabel.labelString = 'bytes/sec';
		} else {
			chart_data.options.scales.yAxes[0].scaleLabel.labelString = 'dB';
		}

		this.setState({
			chart_data: chart_data,
			type: type,
			selectedNode: node
		});
	}

	processData(data){
		if ( data == null || data == undefined || $('#radio_characteristics_container').css('display') == 'none' ){ return; } 
		
		let chart_data = this.state.chart_data;
		for (let i = 0; i < data.length; i++){
			/*
				Line Plot: Add a dataset if there are no datasets, then append the new
				data to that dataset's data array. Append a 1 to the labels array. 
				Shorten both the data and labels to a maximum length of 16.
			*/
			
			var node = parseInt(data[i]._id.replace('node', ''), 10);
			if (node == this.state.selectedNode && data[i][this.state.type] != undefined ){
				
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
			/*
				TDMA Bar Plot: Create a dataset if it doesn't exist. If it's a new
				dataset or if the timeslot count changed or the position in the 
				timeslot changed then recreate the dateset's data array. Current node
				timeslot is highlighted in blue, all others are black. Add a subtitle
				with the spacing of the timeslots.
			*/
			else if (this.state.type == 'tdma' && node == this.state.selectedNode){
				if (chart_data.data.datasets.length == 0) {
					chart_data.data.datasets.push({
						label: 'Node '+ this.state.selectedNode,
						borderColor: 'black',
						data: [],
						fill: false,
					});
				}

				if (chart_data.data.datasets.length == 0 ||
					(chart_data.data.datasets[0] != undefined && 
						(chart_data.data.datasets[0].rw_count != data[i]['network'] || 
						chart_data.data.datasets[0].rw_pos != data[i]['tdmaPos']
						)
					)
				) {
					chart_data.data.datasets = [];
					chart_data.data.labels = [1];
					var count 	= parseInt(data[i]['network'],10),
						spacing = parseFloat(data[i]['frameSize']),
						start 	= parseInt(data[i]['Fnode'],10),
						pos 	= parseInt(data[i]['tdmaPos'], 10);
					
					chart_data.options.title.text = [capitalize(this.state.type)+' Plot - Node '+this.state.selectedNode, 'Spacing: '+(parseFloat(spacing)/parseFloat(count)) + 's']
					if (count != undefined && spacing != undefined && start != undefined){
						chart_data.data.datasets.push({
							borderColor: [],
							backgroundColor: [],
							data: [],
							fill: true,
						});
						
						chart_data.data.datasets[0].borderColor.push('#FFFFFF');
						chart_data.data.datasets[0].backgroundColor.push('#FFFFFF');
						chart_data.data.datasets[0].data.push(0);
						
						for (var j = start; j <= count + start; j++){
							var color = (j - start == pos) ? window._teamColor : '#000000';
							chart_data.data.datasets[0].borderColor.push(color);
							chart_data.data.datasets[0].backgroundColor.push(color);
							chart_data.data.datasets[0].data.push(100);
							
							chart_data.data.datasets[0].rw_count = count;
							chart_data.data.datasets[0].rw_pos = pos;
						}
						chart_data.data.datasets[0].borderColor.push('#FFFFFF');
						chart_data.data.datasets[0].backgroundColor.push('#FFFFFF');
						chart_data.data.datasets[0].data.push(0);

						chart_data.data.labels = Array.apply(null, Array(chart_data.data.datasets[0].data.length)).map(Number.prototype.valueOf,1)
					}
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
							<option value='tdma'>TDMA</option>
						</select>
					</div>
					<ThroughputPlot data={this.state.chart_data} node={this.state.selectedNode} cnt={this.props.cnt}/>
				</div>
			</div>
		);
	}
}