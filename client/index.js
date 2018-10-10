import React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';

import './utils/polyfill';
import Root from './app/Root';
import configureStore from './store/configureStore';

const history = createBrowserHistory();
const store = configureStore(history);

render(
	<Root store={store} history={history} />,
	document.getElementById('app'),
);
