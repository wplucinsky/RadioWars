class Spoofing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			node: window._nodes.getNodeLocationReal(window._node),
			spoof: 15 //window._nodes.getNodeLocationReal(window._node)
		}
		window._spoof = 15; // temp spoofing demo value

		this.availableNodes = window._nodes.getRealLocations();

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
	}

	handleChange(event){
		let ctrl = this.state;
		ctrl.spoof = event.target.value;
		
		window._spoof = event.target.value; // temp spoofing demo value

		if (!TEST_MODE) {
			var url = 'http://'+document.domain+':'+location.port+'/radioControl';
			
			this.api.post(url, {
				'_id': 		 'node'+ctrl.nodeId,
				'type': 	 'spoofing',
				'method': 	 ctrl.spoof,
				'completed': String(false),
				'date': 	 new Date().toISOString(),
				'time': 	 '1',
				'direction': '1',
				'rxGain': 	 '1',
				'txGain': 	 '1',
				'power': 	 '1',
				'freq': 	 '1',
				'nodeToCapture': ctrl.nodeId
			}, (function(data){
				
			}));
		}

		this.setState({
			ctrl
		});
	}
	
	render() { 
		return (
			<div className="row" id="spoofing_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Spoofing Controls</h4>
					<div className="line"></div>
					<div className="row">
						<div className="col-md-12">
							<h5 className="spoof-node">Your Node: {this.state.node}</h5>
							<div className="line"></div>
							<label htmlFor="type" className="encr-sel-l">Spoof Node: </label>
							<select name="type" className="form-control encr-sel-r" value={this.state.spoof} onChange={this.handleChange}>
								{this.availableNodes.map((item, key) => {
									return <option key={key} value={item}>{item}</option>;
								})}
							</select>
						</div>
					</div>
				</div>
			</div>
		);
	}
}