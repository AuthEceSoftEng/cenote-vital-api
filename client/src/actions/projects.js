import { push } from 'connected-react-router';
import Notifications from 'react-notification-system-redux';

import { getProjects, postProject, getProject, putProject, deleteProject } from '../api/projects';
import { handleError } from './helpers';
import * as types from '../constants/actionTypes';

export const setProjects = projects => ({ type: types.SET_PROJECTS, projects });
export const addProject = ({ projectId, text, createdAt }) => ({ type: types.ADD_PROJECT, createdAt, projectId, text });
export const openProjectInfo = project => ({ type: types.OPEN_PROJECT_INFO, project });
export const updateProjectTitle = ({ projectId, text, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, projectId, text });
export const updateProjectReadKey = ({ projectId, readKey, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, projectId, readKey });
export const updateProjectWriteKey = ({ projectId, writeKey, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, projectId, writeKey });
export const updateProjectMasterKey = ({ projectId, masterKey, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, projectId, masterKey });
export const removeProject = projectId => ({ type: types.REMOVE_PROJECT, projectId });

export const attemptGetProjects = () => dispatch => getProjects().then((data) => {
	dispatch(setProjects(data.projects));
	return data.projects;
}).catch(handleError(dispatch));

export const attemptAddProject = text => dispatch => postProject({ text }).then((data) => {
	dispatch(addProject(data.project));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));

export const attemptOpenProjectInfo = projectId => dispatch => getProject({ projectId }).then((data) => {
	dispatch(openProjectInfo(data.project));
	dispatch(push(`/projects/${data.project.projectId}`));
	return data.project;
}).catch(handleError(dispatch));

export const attemptUpdateProjectTitle = ({ projectId, text }) => dispatch => putProject({ projectId, text }).then((data) => {
	dispatch(updateProjectTitle({ projectId, text, updatedAt: data.project.updatedAt }));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));

export const attemptUpdateProjectReadKey = ({ projectId, readKey }) => dispatch => putProject({ projectId, readKey }).then((data) => {
	dispatch(updateProjectReadKey({ projectId, readKey, updatedAt: data.project.updatedAt }));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));

export const attemptUpdateProjectWriteKey = ({ projectId, writeKey }) => dispatch => putProject({ projectId, writeKey }).then((data) => {
	dispatch(updateProjectWriteKey({ projectId, writeKey, updatedAt: data.project.updatedAt }));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));

export const attemptUpdateProjectMasterKey = ({ projectId, masterKey }) => dispatch => putProject({ projectId, masterKey }).then((data) => {
	dispatch(updateProjectMasterKey({ projectId, masterKey, updatedAt: data.project.updatedAt }));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));

export const attemptDeleteProject = projectId => dispatch => deleteProject({ projectId }).then((data) => {
	dispatch(removeProject(projectId));
	dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
	return data;
}).catch(handleError(dispatch));
