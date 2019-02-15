('use strict');
const express = require('express');
const yelp = require('yelp-fusion');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;

const yelpApiClient = yelp.client(process.env.YELP_API_KEY);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/api/restaurants', (req, res) => {
	console.log(req.query);
	yelpApiClient
		.search({
			limit: 25,
			open_now: true,
			latitude: req.query.lat,
			longitude: req.query.long,
			price: req.query.price,
			categories: req.query.cuisine
		})
		.then((response) => {
			res.json(response.jsonBody.businesses);
		})
		.catch((e) => {
			console.log(e);
			res.status(400);
		});
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
