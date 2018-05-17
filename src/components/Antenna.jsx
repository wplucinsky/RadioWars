class Antenna extends React.Component {
	constructor(props) {
		super(props);
		this.api = new API();
		this.state = this.props;

		this.node = 3;
		this.listeners = [];
		this.set = true;
		this.callAPI = this.callAPI.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
		this.startListeners();
	}

	componentWillReceiveProps(nextProps){
	/*
		Sets the initial antenna direction to the state.
	*/
		this.props = nextProps;
		if (this.set && this.data != null) {
			this.set = false; // on node change, this.set = true;
			var self = this;
			this.props.data.filter(function(item){
				if (item._id == 'node'+self.node ) {
					let state = (item.state == undefined) ? 'omni' : item.state;
					self.setState({
						direction: self.getDirFromState(self.node, state),
					});
				}
			});
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
			var url = "http://dwslgrid.ece.drexel.edu:5000/radioAntennaState",
				self = this;
			
			this.api.post(url, {
				'_id': 		'node'+this.node,
				'state': 	this.getDirFromState(this.node, this.state.direction),
			}, (function(data){
				
			}));
		}
	}

	render() { 
		return (
			<div className="row" id="antenna_controls_container">
				<h4 className="text-center">Antenna Controls</h4>
				<div className="line"></div>
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
		);
	}
}