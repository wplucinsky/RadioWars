class ServerOutput extends React.Component {
	constructor() {
		super()
		this.state = {
			serverGet: null,
			serverPost: null,
		};
	}

	componentDidMount(){
		$('.line').css('background-color', window._teamColor);
		
		return fetch('http://www.craigslistadsaver.com/cgi-bin/interference_demo.php?demo=1&m=1')
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					serverGet: responseJson,
				}, function(){

				});

			})
			.catch((error) =>{
				console.error(error);
			});
	}

	render() { 
		return (
			<div className="row" id="server_output_container">
				<div className="col-md-12 team_x">
					<h4 className="text-center">Server Output</h4>
					<div className="line"></div>
					<pre>
						<code id="serverOutputGet" className="json">{JSON.stringify(this.state.serverGet)}</code>
					</pre>
					<div className="line"></div>
					<pre>
						<code id="serverOutputPost" className="json">{JSON.stringify(this.state.serverPost)}</code>
					</pre>
				</div>
			</div>
		);
	}
}