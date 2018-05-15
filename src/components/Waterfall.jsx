class Waterfall extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			src: '/src/img/waterfall/Waterfall_Plot.png?' + new Date().getTime(),
		}
		this.timer = null;

		this.startTimer = this.startTimer.bind(this);
	}

	componentDidMount(){
		$('.line').css('background-color', 'rgb(54, 162, 235)');
		this.startTimer();
	}

	componentWillUnmount(){
		clearTimeout(this.timer);
	}

	startTimer() {
		var self = this;
		this.timer = window.setInterval(function(){
			self.setState({
				src: '/src/img/waterfall/Waterfall_Plot.png?' + new Date().getTime(),
			})
		}, 3000);
	}

	render() { 
		return (
			<div className="row" id="waterfall_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Waterfall</h4>
					<div className="line"></div>
					<div id="waterfall">
						<img src={this.state.src} onError={(e)=>{e.target.src="/src/img/errorimg.png"}}></img>
					</div>
				</div>
			</div>
		);
	}
}