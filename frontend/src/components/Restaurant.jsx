import React from 'react';

function Restaurant(props) {
	const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${props.myLat},${props.myLong}&destination=${props.lat},${props.long}`;

	return (
		<div>
			<div>
				<p className="Restaurant-header">
					<a href={directionsUrl} target="_blank" rel="noopener noreferrer">
						{props.name}
					</a>
				</p>
			</div>
			<img className="Restaurant-image" src={props.img} alt={props.name} />
		</div>
	);
}

export default Restaurant;
