class NavModule extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(){
		var a = this.props.item.active == 0 ? 1 : 0;
		this.props.returnProps(this.props.item.name, a)
	}

	render() {
		return (
			<li>
				<a onClick={this.handleClick} className={this.props.item.active == 1 ? 'active' : ''}>{capitalize(this.props.item.name)}</a>
			</li>
		)
	}
}