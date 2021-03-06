class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keyboard: {
				move: 		  0,
				mdirection:   -1,
				select: 	  0,
				interference: 0,
				controls: 	  0,
				cdirection:   0,
				cselect: 	  0,
				esc: 		  0,
				id: 		  0,
				m_id: 		  0,
				old_id: 	  0,
				old_m_id: 	  0,
				c_start: 	  0,
				m_start: 	  0,
			},
			data: null,
			currNode: window._node,
		}

		this.returnKeyboard = this.returnKeyboard.bind(this);
		this.returnClick = this.returnClick.bind(this)
		this.returnData = this.returnData.bind(this);
		this.startListener = this.startListener.bind(this);
	}

	componentDidMount(){
		this.startListener();
	}

	startListener(){
	/*
		Starts the keyboard listener for a variety of commands. If a new key command is
		added it should be reference in #helpModal as well.

		Starts the click handler for the #clickCanvas canvas component if it's present.
	*/
		var self = this;
		this.eventListenerKeydown = document.addEventListener('keydown', function(event){
			self.keyboard = -1; // trigger update

			var m = 0, 	 // move
				s = 0, 	 // select
				i = 0, 	 // interference
				c = 0, 	 // controls
				rs = 0,  // controls selector
				d = 0, 	 // control direction
				esc = 0, // escape
				id = 0,  // node capture
				m_id = 0,// mgen
				j = -1,  // move directon
				old_id   = self.state.keyboard.id,
				old_m_id = self.state.keyboard.m_id,
				c_start  = self.state.keyboard.c_start,
				m_start  = self.state.keyboard.m_start;

			// help modal
			if (event.key == 'h') { $('#helpModal').modal(); self.keyboard = 1; }
			// move around game board
			if (event.key == 'w') { j=0; m=1; if(old_id==1){id = 2;} if(old_m_id==1){m_id = 2;}}
			if (event.key == 'a') { j=2; m=1; if(old_id==1){id = 2;} if(old_m_id==1){m_id = 2;}}
			if (event.key == 's') { j=4; m=1; if(old_id==1){id = 2;} if(old_m_id==1){m_id = 2;}}
			if (event.key == 'd') { j=6; m=1; if(old_id==1){id = 2;} if(old_m_id==1){m_id = 2;}}
			// start interference
			if (event.key == 'i') { i=1; }
			// select one of the radio controls
			if (event.key == '1') { rs = 1; }
			if (event.key == '2') { rs = 2; }
			if (event.key == '3') { rs = 3; }
			if (event.key == '4') { rs = 4; }
			if (event.key == '5') { rs = 5; }
			if (event.key == '6') { rs = 6; }
			if (event.key == 'ArrowLeft')  { rs=-1; }
			if (event.key == 'ArrowRight') { rs=-2; }
			// start node capture
			if (self.state.keyboard.id == 0){ if (event.key == 'c') { id = 1; } }
			// start mgen
			if (self.state.keyboard.m_id == 0){ if (event.key == 'm') { m_id = 1; } }
			// controls the radio controls
			if (event.key == 'ArrowUp') { c=1; d=1; }
			if (event.key == 'ArrowDown') { c=1; d=2; }
			// select a node
			if (event.key == 'Enter') { s=1; }
			if (event.key == 'Escape') { esc=1; }

			self.setState({
				keyboard: {
					move: 		  m,
					mdirection:   j,
					select: 	  s,
					interference: i,
					controls: 	  c,
					cdirection:   d,
					cselect: 	  rs,
					esc: 		  esc,
					id: 		  id,
					m_id: 		  m_id,
					old_id: 	  old_id,
					old_m_id: 	  old_m_id,
					c_start:  	  c_start,
					m_start:      m_start,
				}
			});

			let chng = [m, s, i, c, rs, d, esc, id, m_id].some(function(elem){
				return elem !== 0
			});
			if (chng) {
				event.preventDefault();
			}
		});

		var elem = document.getElementById('clickCanvas');
		if ( elem ){
			this.eventListenerClick = elem.addEventListener('click', function(event){
				self.click = -1; // trigger update
				var rect = elem.getBoundingClientRect(),
					x = event.pageX - rect.left,
					y = event.pageY - (rect.top + window.scrollY) - 50;

				self.setState({
					click: {
						x: x,
						y: y,
					}
				});
			}, false);
		}
	}

	returnData(data){
		this.setState({
			data: data
		});
	}

	returnKeyboard(currNode, control){
	/*
		Used with the GridContainer component to distinguish between a new
		keyboard command and an old keyboard command.
	*/
		var ctrl = this.state;
		if (control.c_start != -1){
			ctrl.keyboard.c_start = control.c_start;
		}
		if (control.m_start != -1){
			ctrl.keyboard.m_start = control.m_start;
		}

		this.setState({
			ctrl
		});

		this.keyboard = currNode;
		this.state.currNode = currNode;
	}

	returnClick(click){
	/*
		Used with the GridContainer component to distinguish between a new
		click command and an old click command.
	*/
		this.click = click;
	}

	render() {
		// conditional rendering for different game modes
		const activeModules = this.props.data.modules.map(function(item){
			if (item.active == 1){
				return item.name;
			}
		});

		return (
			<div id="content">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<button type="button" id="sidebarCollapse" className="navbar-btn">
								<span></span>
								<span></span>
								<span></span>
							</button>
						</div>

						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<ul className="nav navbar-nav navbar-right">
								<li>
									<HelpBtn />
								</li>
							</ul>
						</div>

						<div className="row team_x">
							<div className="col-md-8 col-sm-12 col-xs-12 flip">
								{activeModules.indexOf('Node Graph') != -1 ? 
									(<GridContainer 
										returnData={this.returnData}
										viewer="0"

										returnKeyboard={this.returnKeyboard}
										keyboard={this.state.keyboard} 
										keyboardUpdate={this.keyboard == -1}

										returnClick={this.returnClick}
										click={this.state.click}
										clickUpdate={this.click == -1}
									/>) : ''
								}
								{activeModules.indexOf('Score Graph') != -1 ?
									(<Score />) : ''
								}
								{activeModules.indexOf('Waterfall') != -1 ? 
									(<Waterfall />) : ''
								}
								{activeModules.indexOf('Radio Characteristics') != -1 ? 
									(<ThroughputContainer data={this.state.data} startNode={window._node}/>) : ''
								}
							</div>
							<div className="col-md-4 col-sm-12 col-xs-12">
								{activeModules.indexOf('Spoofing') != -1 ? 
									(<Spoofing  data={this.state.data}/>) : ''
								}
								{activeModules.indexOf('Encryption') != -1 ? 
									(<Encryption  data={this.state.data}/>) : ''
								}
								{activeModules.indexOf('Radio Controls') != -1 ? 
									(<Controls keyboardUpdate={this.keyboard == -1} type={'radio'} control={this.props.data.radio_controls} keyboard={this.state.keyboard} />) : ''
								}	

								{activeModules.indexOf('Antenna Controls') != -1 ? 
									(<Antenna direction="omni" data={this.state.data} />) : ''
								}
								{activeModules.indexOf('Interference Controls') != -1 ? 
									(<Controls keyboardUpdate={this.keyboard == -1} type={'interference'} control={this.props.data.interference_controls} keyboard={this.state.keyboard} />) : ''
								}
								{activeModules.indexOf('Server Output') != -1 ? 
									(<ServerOutput />) : ''
								}
							</div>

						</div>
					</div>

				  </nav>
			</div>
		);
	}
}