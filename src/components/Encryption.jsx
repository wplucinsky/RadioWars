class Encryption extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'substitution',
			nodeId: window._nodes.getNodeLocationReal(window._node)
		}
		this.encryptionMethods = ['Substitution', 'XOR']; //, 'Vignerere', 'WEP', 'AES'];

		this.api = new API();

		this.handleTypeChange = this.handleTypeChange.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.processData(this.props.data);
	}

	handleTypeChange(event) {
		let ctrl = this.state;
		ctrl.type = event.target.value;

		if (!TEST_MODE) {
			var url = 'http://'+document.domain+':'+location.port+'/radioControl';
			
			this.api.post(url, {
				'_id': 		 'node'+ctrl.nodeId,
				'type': 	 'encryption',
				'method': 	 ctrl.type,
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

	processData(data){
	/*
		Goes through the server data and checks if the logged in team's node
		has logged any encryption or decryption messages.

		If in TEST_MODE the dropdown must equal 'substitution' or the decrypted
		text will be incorrect.
	*/
		if ( data == null || data == undefined || $('#encryption_container').css('display') == 'none' ){ return; } 

		let ctrl = this.state;
		for (let i = 0; i < data.length; i++){
			if (data[i]['_id'] == 'node'+ctrl.nodeId) {
				if (TEST_MODE){
					if (data[i]['encrypted'] != undefined){
						ctrl.encrypted = data[i]['encrypted'];
					} else {
						ctrl.encrypted =  '';
					}

					if (data[i]['decrypted'] != undefined){
						if ( ctrl.type == 'substitution') {
							ctrl.decrypted = data[i]['decrypted'];
						} else {
							ctrl.decrypted = 'ybico';
						}
					} else {
						ctrl.decrypted = '';
					}
				} else {
					if (data[i]['encrypted'] != undefined){
						ctrl.encrypted = data[i]['encrypted'];
					} else {
						ctrl.encrypted =  '';
					}
					
					if (data[i]['decrypted'] != undefined){
						ctrl.decrypted = data[i]['decrypted'];
					} else {
						ctrl.decrypted = '';
					}
				}
			}
		}
		this.setState({
			ctrl
		});
	}
	
	render() { 
		return (
			<div className="row" id="encryption_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Encryption Results</h4>
					<div className="line"></div>
					<div className="row">
						<div className="col-md-12">
							<label htmlFor="type" className="encr-sel-l">Encryption Type: </label>
							<select name="type" className="form-control encr-sel-r" value={this.state.type} onChange={this.handleTypeChange}>
								{this.encryptionMethods.map((item, key) => {
									return <option key={key} value={item.toLowerCase()}>{item}</option>;
								})}
							</select>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<span className="encr-sel-l">Encrypted:</span>
							<pre className="encr-sel-r">
								<code className="json">{JSON.stringify(this.state.encrypted)}</code>
							</pre>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<span className="encr-sel-l">Decrypted:</span>
							<pre className="encr-sel-r">
								<code className="json">{JSON.stringify(this.state.decrypted)}</code>
							</pre>
						</div>
					</div>
				</div>
			</div>
		);
	}
}