class ScoreCanvas extends React.Component {
	constructor(props) {
		super(props);

		this.chart = {
			canvas: null,
			elem: null,
		}

		this.update = this.update.bind(this);
	}

	componentDidMount(){
		var id = 'scoring' + ((!this.props.recent) ? '-total' : '');

		this.chart.canvas = document.getElementById(id).getContext("2d");
		this.chart.elem = new Chart(this.chart.canvas, this.props.data);
	}

	componentDidUpdate() {
		this.update();
	}

	update() {
		this.chart.elem.update();
	}

	render() {
		var id = 'scoring' + ((!this.props.recent) ? '-total' : '');
		return (
			<div className="col-md-6">
				<canvas id={id} width="300" height="100"></canvas>
			</div>
		);
	}
}