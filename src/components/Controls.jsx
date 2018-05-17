class Controls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {values: this.props.control.map((item, key) => {
			return  parseInt(item.value);
		})};

		this.control = 0;
		this.outline = this.outline.bind(this);
		this.controls = this.controls.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', 'rgb(54, 162, 235)');
		$(".knob").knob({
			release : function (value) {
				if (this.$.attr('id').indexOf('interference_') !== -1 ) {
					$('#interferenceControlsConfirmChanges').css('display', 'block')
				} else {
					$('#radioControlsConfirmChanges').css('display', 'block')
				}
			}
		});

		if (this.props.type == 'radio'){
			this.outline()
		}
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;

		if(this.props.keyboardUpdate && this.props.type == 'radio'){
			if ( this.props.keyboard.cselect != 0 ) {
				if (this.props.keyboard.cselect == -1 ){
					this.control = (this.control == 0) ? 5 : this.control-1;
				} else if (this.props.keyboard.cselect == -2 ) {
					this.control = (this.control == 5) ? 0 : this.control+1;
				} else if ( this.props.keyboard.cselect != 0 ) {
					this.control = this.props.keyboard.cselect - 1;
				}

				this.outline();
			}
			if (this.props.keyboard.cdirection != 0) {
				this.controls(this.props.keyboard.cdirection);
			}
		}
	}

	outline(){
		for ( let i in this.props.control ){
			if ( i == this.control ){
				$('#'+this.props.control[i].name+'_1_'+this.props.type+'_knob_text').css({'border-bottom': '4px solid green'});
			} else {
				$('#'+this.props.control[i].name+'_1_'+this.props.type+'_knob_text').css({'border-bottom': 'none'});
			}
		}
	}

	controls(d){
		var step = parseInt($('#'+this.props.control[this.control].name+'_1_'+this.props.type+'_knob').attr('data-step')),
			min = parseInt($('#'+this.props.control[this.control].name+'_1_'+this.props.type+'_knob').attr('data-min')),
			max = parseInt($('#'+this.props.control[this.control].name+'_1_'+this.props.type+'_knob').attr('data-max')),
			ctrl = this.state.values;

		if ( d == 1) {
			if ((parseInt(ctrl[this.control]) + step) > max ) {
				ctrl[this.control] = max;
			} else {
				ctrl[this.control] = (parseInt(ctrl[this.control]) + step);
			}
		} else {
			if ((parseInt(ctrl[this.control]) - step) < min ) {
				ctrl[this.control] = min;
			} else {
				ctrl[this.control] = (parseInt(ctrl[this.control]) - step);
			}
		}

		$('#'+this.props.control[this.control].name+'_1_'+this.props.type+'_knob').val(ctrl[this.control]).trigger('change');
		$('#radioControlsConfirmChanges').css('display', 'block')
	}

	render() { 
		return (
			<div className="row" id={this.props.type + '_controls_container'}>
				<div className="col-md-12 control-info">
					<h4 className="text-center">{capitalize(this.props.type)} Controls</h4>
					<span id={this.props.type+'ControlsConfirmChanges'} >press ENTER to confirm changes</span>
					<div className="line"></div>
					<div className="row">   
						{this.props.control.map((item, key) => {
							return key < 3 ? (<Knob data={item} val={this.state.values[key]} key={key} type={this.props.type} />) : null;
						})}
					</div>
					<div className="row">
						{this.props.control.map((item, key) => {
							return key >= 3 ? <Knob data={item} val={this.state.values[key]} key={key} type={this.props.type} /> : null
						})}
					</div>
				</div>
			</div>
		);
	}
}