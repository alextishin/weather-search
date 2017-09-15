import {
	REQUEST_WEATHER,
	REQUEST_WEATHER_FAILED,
	RECEIVE_WEATHER,
	REMOVE_WEATHER
} from '../actions';

const initialState = {
	isFetching: true,
	forecasts: []
};

export default function weather(state = initialState, action) {
	switch (action.type) {
		case REQUEST_WEATHER:
			return {
				...state,
				isFetching: true
			}

		case REQUEST_WEATHER_FAILED:
			return {
				...state,
				isFetching: false,
				error: action.error
			}
		case RECEIVE_WEATHER:

			return {
				...state,
				isFetching: false,
				forecasts: [...state.forecasts, action.payload]
			}
		case REMOVE_WEATHER:
			let forecasts = [...state.forecasts];
			let item = forecasts.find((p) => {
				return p.city == action.city;
			});

			let itemIndex = forecasts.indexOf(item);

			forecasts.splice(itemIndex, 1);

			return {
				...state,
				isFetching: false,
				forecasts: forecasts
			}
		default:
			return state;
	}
}
