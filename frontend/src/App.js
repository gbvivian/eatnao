import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import loading from './assets/loading.gif';

import Choice from './components/Choice';
import Restaurant from './components/Restaurant';
import Page from './components/Page';

import './App.css';

class App extends Component {
	state = {
		cuisines: [ 'pizza', 'japanese', 'burgers' ],
		cuisineIcons: [ '🍕', '🍣', '🍔' ],
		priceIcons: [ '💲', '💲💲', '💲💲💲' ],
		prices: [ '1', '2', '3' ],
		distances: [],
		restaurants: [],
		isLoadingRestaurants: false
	};

	data = {
		selectedCuisine: '',
		selectedPrice: null,
		myLat: null,
		myLong: null
	};

	handleSelectCuisine = (event, cuisine) => {
		this.data.selectedCuisine = cuisine;
	};

	handleSelectPrice = (event, price) => {
		this.setState({ isLoadingRestaurants: true });
		this.data.selectedPrice = price;

		this.getPosition()
			.then((position) => {
				this.data.myLat = position.coords.latitude;
				this.data.myLong = position.coords.longitude;
				this.getRestaurants({
					lat: position.coords.latitude,
					long: position.coords.longitude,
					cuisine: this.data.selectedCuisine,
					price: this.data.selectedPrice
				}).then((restaurantsResponse) => {
					console.log(restaurantsResponse);
					this.setState({
						isLoadingRestaurants: false,
						restaurants: restaurantsResponse
					});
				});
			})
			.catch((error) => {
				console.warn(error);
				this.setState({
					isLoadingRestaurants: false,
					restaurants: []
				});
			});
	};

	getPosition = (options) => {
		return new Promise(function(resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	};

	getRestaurants = (params) => {
		const query = Object.keys(params)
			.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&');
		return fetch('/api/restaurants?' + query)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				return response;
			})
			.catch((error) => console.log(error));
	};

	render() {
		const restaurantPageProps = this.state.isLoadingRestaurants
			? {
					header: 'Looking for places...',
					display: <img src={loading} alt="loading" className="Loading-image" />
				}
			: {
					header: 'We found something near you ✨',
					display: (
						<div>
							{this.state.restaurants.map((r) => {
								return (
									<Restaurant
										className="Restaurant"
										name={r.name}
										key={r.id}
										img={r.image_url}
										lat={r.coordinates.latitude}
										long={r.coordinates.longitude}
										myLat={this.data.myLat}
										myLong={this.data.myLong}
									/>
								);
							})}
						</div>
					)
				};

		var cuisineChoices = (
			<span>
				{this.state.cuisines.map((cuisine, index) => {
					return (
						<Choice
							key={index}
							dest="/budget"
							image={this.state.cuisineIcons[index]}
							val={this.state.cuisines[index]}
							handleSelection={this.handleSelectCuisine}
						/>
					);
				})}
			</span>
		);

		var priceChoices = (
			<span>
				{this.state.prices.map((price, index) => {
					return (
						<Choice
							key={index}
							dest="/restaurants"
							image={this.state.priceIcons[index]}
							val={this.state.prices[index]}
							handleSelection={this.handleSelectPrice}
						/>
					);
				})}
			</span>
		);

		return (
			<Router>
				<div className="App">
					<Route
						path="/"
						exact
						strict
						render={() => <Page header="What are you craving?" display={cuisineChoices} />}
					/>
					<Route
						path="/budget"
						exact
						strict
						render={() => <Page header="What's your budget?" display={priceChoices} />}
					/>
					<Route path="/restaurants" exact strict render={() => <Page {...restaurantPageProps} />} />
				</div>
			</Router>
		);
	}
}

export default App;
