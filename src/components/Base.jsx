class Base extends React.Component {
	constructor(props) {
		
	}

	componentDidMount(){
		$('.line').css('background-color', 'rgb(54, 162, 235)');
		// set state or start an intervalled HTTP request / Socket connection
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;

		// check if props changed
	}
	
	render() { 
		return (
			<div className="row" id="base_container">
				<div className="col-md-12">
					<h4 className="text-center">Base Name</h4>
					<div className="line"></div>
					<div>
						
					</div>
				</div>
			</div>
		);
	}
}