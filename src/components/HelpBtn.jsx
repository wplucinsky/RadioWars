class HelpBtn extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		$('#helpModal').modal();
	}

	render() { 
		return (
			<a className="pointer" onClick={this.handleClick} >Help</a>
		);
	}
}