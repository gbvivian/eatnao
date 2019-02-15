import React from 'react';
import { Link } from 'react-router-dom';

function Choice(props) {
	var setSelection = (event) => {
		props.handleSelection(event, props.val);
	};
	return (
		<React.Fragment>
			<Link className="Choice" to={props.dest} onClick={setSelection}>
				{props.image}
			</Link>
		</React.Fragment>
	);
}

export default Choice;
