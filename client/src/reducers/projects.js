import update from 'immutability-helper';
import { findIndex, propEq } from 'ramda';

import { SET_PROJECTS, ADD_PROJECT, OPEN_PROJECT_INFO, UPDATE_PROJECT, REMOVE_PROJECT, LOGOUT_USER } from '../constants/actionTypes';

export function project(state = { }, action) {
	switch (action.type) {
	case (ADD_PROJECT):
		return update(state, {
			projectId: { $set: action.projectId },
			text: { $set: action.text },
			createdAt: { $set: action.createdAt },
		});
	case (OPEN_PROJECT_INFO):
		return state;
	case (UPDATE_PROJECT):
		return update(state, {
			text: { $set: action.text },
			updatedAt: { $set: action.updatedAt },
		});
	default:
		return state;
	}
}

export default function projects(state = [], action) {
	const index = findIndex(propEq('id', action.id), state);
	const updatedAtIndex = { $splice: [[index, 1, project(state[index], action)]] };

	switch (action.type) {
	case (SET_PROJECTS):
		return update(state, { $set: action.projects });
	case (ADD_PROJECT):
		return update(state, { $push: [project(undefined, action)] });
	case (OPEN_PROJECT_INFO):
		return update(state, { $set: [action.project] });
	case (UPDATE_PROJECT):
		return update(state, updatedAtIndex);
	case (REMOVE_PROJECT):
		return update(state, { $splice: [[index, 1]] });
	case (LOGOUT_USER):
		return [];
	default:
		return state;
	}
}
