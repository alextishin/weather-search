import fetch from 'isomorphic-fetch';

export const REQUEST_WEATHER = 'REQUEST_WEATHER';
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER';
export const REQUEST_WEATHER_FAILED = 'REQUEST_WEATHER_FAILED';

export const REMOVE_WEATHER = 'REMOVE_WEATHER';


export function requestWeather() {
	return {
		type: REQUEST_WEATHER
	};
}

export function requestWeatherFailed(error) {
	return {
		type: REQUEST_WEATHER_FAILED,
		error
	};
}

export function receiveWeather(json, city) {
	return {
		type: RECEIVE_WEATHER,
		payload: {
			...json.query.results.channel,
			city: city
		}
	};
}


export function fetchWeather(city) {
	const query = `select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}") and u='c'`;
	const url = `https://query.yahooapis.com/v1/public/yql?q=${query}&format=json`;

	return function (dispatch) {
		dispatch(requestWeather());

		return fetch(url)
			.then(response => response.json())
			.then(json => dispatch(receiveWeather(json, city)))
			.catch(error => dispatch(requestWeatherFailed(error.toString())));
	};
}

export function removeWeather(city) {
	return {
		type: REMOVE_WEATHER,
		city: city
	};
}
