class ScorePrint extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){

	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
	}

	render() {
		var style = {
			backgroundColor: this.props.data.name, 
		};
		return (
			<div className="color-div">
				<div style={style}></div>
				<span>{this.props.data.score}</span>
			</div>
		);
	}
}