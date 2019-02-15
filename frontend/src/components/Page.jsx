import React from 'react';

function Page(props) {
	return (
		<React.Fragment>
			<p className="Header">{props.header}</p>
			{props.display}
		</React.Fragment>
	);
}

export default Page;
