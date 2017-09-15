if (module.hot) {
	module.hot.accept();
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';

import App from './components/App/App';


const store = configureStore();

store.subscribe(() => {
});


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

