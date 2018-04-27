function NavModule(props) {
	return (
		<li>
			<a className={props.item.active == 1 ? 'active' : ''}>{capitalize(props.item.name)}</a>
		</li>
	)
}