class App extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() { 
		return (
			<div>
				<div className="notifications">
					<span id="scroll">Test</span>
				</div>
				<div id="sizeWarning" className="hidden">
					<span>Display smaller than 768px. Bugs may occur.</span>
				</div>
				<div className="wrapper">
					<Nav modules={this.props.data.modules} />
					<Content data={this.props.data} />
				</div>
			</div>
		);
	}
}