import { createStore, compose, applyMiddleware } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';

export const history = createHistory();

const persistedReducer = persistReducer({ key: 'root', storage }, rootReducer(history));

function configureStoreProd(initialState) {
	const reactRouterMiddleware = routerMiddleware(history);
	const middlewares = [
		thunk,
		reactRouterMiddleware,
	];

	const store = createStore(
		persistedReducer,
		initialState,
		compose(applyMiddleware(...middlewares)),
	);
	const persistor = persistStore(store);
	return { store, persistor };
}

function configureStoreDev(initialState) {
	const reactRouterMiddleware = routerMiddleware(history);
	const middlewares = [
		reduxImmutableStateInvariant(),
		thunk,
		reactRouterMiddleware,
	];

	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(
		persistedReducer,
		initialState,
		composeEnhancers(applyMiddleware(...middlewares)),
	);

	if (module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers').default;
			store.replaceReducer(persistedReducer(nextRootReducer));
		});
	}

	const persistor = persistStore(store);
	return { store, persistor };
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
