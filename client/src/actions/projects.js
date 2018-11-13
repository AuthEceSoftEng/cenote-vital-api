import { push } from 'connected-react-router';
import Notifications from 'react-notification-system-redux';

import { getProjects, postProject, getProject, putProject, deleteProject } from '../api/projects';
import { handleError } from './helpers';
import * as types from '../constants/actionTypes';

export const setProjects = projects => ({ type: types.SET_PROJECTS, projects });
export const addProject = ({ projectId, text, createdAt }) => ({ type: types.ADD_PROJECT, createdAt, projectId, text });
export const openProjectInfo = project => ({ type: types.OPEN_PROJECT_INFO, project });
export const updateProject = ({ projectId, text, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, projectId, text });
export const removeProject = projectId => ({ type: types.REMOVE_PROJECT, projectId });

export const attemptGetProjects = () => dispatch => getProjects().then((data) => {
	dispatch(setProjects(data.projects));
	return data.projects;
}).catch(handleError(dispatch));

export const attemptAddProject = text => dispatch => postProject({ text }).then((data) => {
	dispatch(addProject(data.project));
	dispatch(Notifications.success({
		title: 'Success!',
		message: data.message,
		position: 'tr',
		autoDismiss: 3,
	}));
	return data;
}).catch(handleError(dispatch));

export const attemptOpenProjectInfo = projectId => dispatch => getProject({ projectId }).then((data) => {
	dispatch(openProjectInfo(data.project));
	dispatch(push(`/projects/${data.project.projectId}`));
	return data.project;
}).catch(handleError(dispatch));

export const attemptUpdateProject = ({ projectId, text }) => dispatch => putProject({ projectId, text }).then((data) => {
	dispatch(updateProject({ projectId, text, updatedAt: data.project.updatedAt }));
	dispatch(Notifications.success({
		title: 'Success!',
		message: data.message,
		position: 'tr',
		autoDismiss: 3,
	}));
	return data;
}).catch(handleError(dispatch));

export const attemptDeleteProject = projectId => dispatch => deleteProject({ projectId }).then((data) => {
	dispatch(removeProject(projectId));
	dispatch(Notifications.success({
		title: 'Success!',
		message: data.message,
		position: 'tr',
		autoDismiss: 3,
	}));
	return data;
}).catch(handleError(dispatch));
