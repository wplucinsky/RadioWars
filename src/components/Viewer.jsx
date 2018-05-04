class Viewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
		}

		this.returnData = this.returnData.bind(this);
	}

	componentDidMount(){
		const canvs = ['grid', 'animations', 'keyboard', 'interference', 'clickCanvas'];
		canvs.forEach(function(item){
			fullscreenify(document.getElementById(item));
		})
	}

	returnData(data){

	}

	render() { 
		const c = {
			height: '100%', 
			marginBottom: '0px',
		};
		return (
			<div id="content" style={c}>
				<nav className="navbar navbar-default" style={c}>
					<div className="container-fluid" style={c}>

						<div className="row team_x" style={c}>
							<div className="col-md-12 viewer-grid viewer" style={c}>
								<GridContainer 
									style={c}
									returnData={this.returnData}
									viewer="1" 

									returnKeyboard={this.returnKeyboard}
									keyboard={this.state.keyboard} 
									keyboardUpdate={this.keyboard == -1}

									returnClick={this.returnClick}
									click={this.state.click}
									clickUpdate={this.click == -1}
								/>
							</div>
						</div>
					</div>

				  </nav>
			</div>
		);
	}
}

function fullscreenify(canvas) {
	// https://gist.github.com/zachstronaut/1184900
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function(){
    	resize(canvas);
   	}, false);

    resize(canvas);

    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 150) / canvas.height;

        if (scale.x < 0.75 || scale.y < 0.75) {
            scale = '0.75, 0.75';
        } else 
        if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}