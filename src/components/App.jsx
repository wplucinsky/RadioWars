class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props;

		this.returnProps = this.returnProps.bind(this);
	}
	
	set(nameKey, myArray, value){
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].name === nameKey) {
				myArray[i].active = value;
				return myArray;
			}
		}
	}

	returnProps(module, active){
		var data = this.state.data;
		data.modules = this.set(module, data.modules, active);
		this.setState({
			data: data
		});
	}

	render() { 
		if (this.state.mode == 'viewer') {
			return (
				<div>
					<div className="notifications">
						<span id="scroll">Test</span>
					</div>
					<div id="sizeWarning" className="hidden">
						<span>Display smaller than 768px. Bugs may occur.</span>
					</div>
					<div className="wrapper"> 
						<Viewer data={this.state.data} />
					</div>
				</div>
			);
		}


		return (
			<div>
				<div className="notifications">
					<span id="scroll">Test</span>
				</div>
				<div id="sizeWarning" className="hidden">
					<span>Display smaller than 768px. Bugs may occur.</span>
				</div>
				<div className="wrapper"> 
					<Nav modules={this.state.data.modules} returnProps={this.returnProps} />
					<Content data={this.state.data} />
				</div>
			</div>
		);
	}
}