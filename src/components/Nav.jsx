function Nav(props) {
	return (
		<nav id="sidebar">
			<div className="sidebar-header">
				<h3>Radio Wars 2018</h3>
				<h6>Will Plucinsky</h6>
				<h6>Ryan Pepito</h6>
				<h6>Logan Henderson</h6>
			</div>

			<ul className="list-unstyled components">
				<p>Modules</p>
				{props.modules.map((item, key) => {
					return <NavModule key={key} item={item}/>
				})}
			</ul>
			<ul className="list-unstyled CTAs">
				<li>
					<HelpBtn />
				</li>
			</ul>
		</nav>
	);
}