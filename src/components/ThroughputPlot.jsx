class ThroughputPlot extends React.Component {
	constructor(props) {
		super(props);

		this.chart = {
			id: 'throughput-'+this.props.cnt,
			canvas: null,
			elem: null,
			type: 'line'
		}

		this.update = this.update.bind(this);
	}

	componentDidMount(){
		this.chart.canvas = document.getElementById(this.chart.id).getContext("2d");
		this.chart.elem = new Chart(this.chart.canvas, this.props.data);
	}


	componentDidUpdate() {
		if ( this.props.data.type != this.chart.type ){
			this.chart.type = this.props.data.type;
			this.chart.elem.destroy();
			this.chart.elem = new Chart(this.chart.canvas, this.props.data);
		}
		this.update();
	}

	update() {
		this.chart.elem.update();
	}

	render() { 
		return (
			<div>
				<canvas id={this.chart.id} width="300" height="100"></canvas>
			</div>
		);
	}
}