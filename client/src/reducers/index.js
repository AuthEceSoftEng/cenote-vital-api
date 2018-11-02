import { combineReducers } from 'redux';
import { reducer as alerts } from 'react-notification-system-redux';
import user from './user';
import projects from './projects';

const rootReducer = combineReducers({
	alerts,
	user,
	projects,
});

export default rootReducer;
