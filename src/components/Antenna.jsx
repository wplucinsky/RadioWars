class Antenna extends React.Component {
	constructor(props) {
		super(props);
		this.api = new API();
		this.state = this.props;
		this.state = {
			direction: this.props.direction,
			node: window._nodes.getNodeLocationReal(window._node)
		}

		/*
			this.availableNodes should use PERMISSIONS boolean and 
			window._nodes.getTakenNodes() as well as window._teamColor 
			to restrict nodes that the antenna can be changed on once
			reconfigurable antennas are on all nodes. Should also be 
			moved into the state.
		*/
		this.availableNodes = [window._nodes.getNodeLocationReal(window._node)];
		this.listeners = [];

		this.callAPI = this.callAPI.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
		this.startListeners();
	}

	componentWillReceiveProps(nextProps){
	/*
		Updates the direction state based on information coming from the radio.
	*/
		this.props = nextProps;

		var data = this.props.data;
		if (data != undefined) {
			for (let i = 0; i < data.length; i++){
				if ( data[i]['_id'] == 'node'+this.state.node) {
					if (data[i]['direction'] != undefined){
						var self = this;
						this.setState({
							direction: self.getDirFromState(self.state.node, data[i]['direction'])
						})
					}
				}
			}
		}
	}

	startListeners(){
	/*
		Binds the Button and DPad classes/listeners to the correct #id. When the
		event occurs setState() or callAPI() is called.

		https://github.com/AirConsole/airconsole-controls
	*/

		var self = this;
	  	this.listeners.push(new Button("omni", {
			"down": function () {
				self.setState({
					direction: 'omni'
				});
			}
		}));
		this.listeners.push(new Button("confirm", {
			"down": function () {
				self.callAPI();
			}
		}));
		this.listeners.push(new DPad("dpad-2", {
			"directionchange": function(key, pressed) {
				if (pressed == true) {
					self.setState({
						direction: key
					})
				}
			}
		}));
	}


	getDirFromState(node, state){
	/*
		The directional radios point in different directions so we need to
		set the correct direction.
	*/
		var states = [
			[], // 0
			[], // 1
			[], // 2
			['omni', 'up', 'left', 'down', 'right', 'omni'], // 3
			['omni', 'right', 'down', 'left', 'up', 'omni'], // 4
		];
		if(Number.isInteger(state)) {
			return states[node][state];
		} else {
			return states[node].indexOf(state)
		}
	}

	callAPI(){
		if (!TEST_MODE) {
			var url = 'http://'+document.domain+':'+location.port+'/radioAntennaState',
				self = this;
			
			this.api.post(url, {
				'_id': 		'node'+this.state.node,
				'state': 	this.getDirFromState(this.state.node, this.state.direction),
			}, (function(data){
				
			}));
		}
	}

	handleChange(event){
		this.setState({
			node: event.target.value
		})
	}

	render() { 
		return (
			<div className="row" id="antenna_controls_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Antenna Controls</h4>
					<div className="line"></div>
					<div className="row">
						<div className="col-md-12">
							<label htmlFor="node" className="encr-sel-l">Node ID: </label>
							<select name="node" className="form-control encr-sel-r" value={this.state.node} onChange={this.handleChange}>	
								{this.availableNodes.map((item, key) => {
									return <option key={key} value={item}>{item}</option>;
								})}
							</select>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="dpad-div">
								<div className="dpad-absolute-container" id="dpad-2">
									<div>
										<div className="dpad-arrow dpad-arrow-up"></div>
										<div className="dpad-arrow dpad-arrow-down"></div>
										<div className="dpad-arrow dpad-arrow-left"></div>
										<div className="dpad-arrow dpad-arrow-right"></div>
									</div>
								</div>
							</div>
							<div className="btn-div">
								<div className="logo">
									<div id="omni" className="button-80 control_btn"><div className="button-text control_btn_text">OMNI</div></div>
								</div>
								<div className="logo">
									<div id="confirm" className="button-80 control_btn"><div className="button-text control_btn_text">Confirm</div></div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="pattern"><img src={"src/img/Pattern"+capitalize(this.state.direction)+".png"}></img></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}