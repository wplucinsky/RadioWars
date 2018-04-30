class Knob extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log(event)
		// onChange={this.handleChange}>
		// this.setState({value: event.target.value});
	}

	componentDidMount() {
		// console.log('mounted', this.props)
	}

	componentDidUpdate() {
		// console.log(this.props);
	}

	render() { 
		return (
			<div className="col-md-4 knob-holder control">
				<div className="knob-container">
					<input 
						className="knob"
						id={this.props.data.name+'_'+this.props.data.team+'_'+this.props.type+'_knob'}
						data-width="75" 
						data-height="85" 
						data-cursor="true" 
						data-fgcolor="#222222" 
						data-thickness=".3" 
						value={this.props.val}
						data-min={this.props.data.min}
						data-max={this.props.data.max}
						data-step={this.props.data.step}
						onChange={this.handleChange}>
					</input>
				</div>
				<div className="knob-text" id={this.props.data.name+'_'+this.props.data.team+'_'+this.props.type+'_knob_text'}>
					{this.props.data.name}
					{this.props.data.name == 'frequency' ? <img id="tenToSix" src="src/img/tenToSix.png"></img> : null}
				</div>
			</div>
		);
	}
}