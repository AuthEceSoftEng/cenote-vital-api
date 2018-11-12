import { push } from 'connected-react-router';

import { getProjects, postProject, getProject, putProject, deleteProject } from '../api/projects';
import { handleError } from './helpers';
import * as types from '../constants/actionTypes';

export const setProjects = projects => ({ type: types.SET_PROJECTS, projects });
export const addProject = ({ projectId, text, createdAt }) => ({ type: types.ADD_PROJECT, createdAt, projectId, text });
export const openProjectInfo = project => ({ type: types.OPEN_PROJECT_INFO, project });
export const updateProject = ({ id, text, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, id, text });
export const removeProject = projectId => ({ type: types.REMOVE_PROJECT, projectId });

export const attemptGetProjects = () => dispatch => getProjects().then((data) => {
	dispatch(setProjects(data.projects));
	return data.projects;
}).catch(handleError(dispatch));

export const attemptAddProject = text => dispatch => postProject({ text }).then((data) => {
	dispatch(addProject(data.project));
	return data;
}).catch(handleError(dispatch));

export const attemptOpenProjectInfo = projectId => dispatch => getProject({ projectId }).then((data) => {
	dispatch(openProjectInfo(data.project));
	dispatch(push(`/projects/${data.project.projectId}`));
	return data.project;
}).catch(handleError(dispatch));

export const attemptUpdateProject = ({ id, text }) => dispatch => putProject({ id, text }).then((data) => {
	dispatch(updateProject({ id, text, updatedAt: data.project.updatedAt }));
	return data;
}).catch(handleError(dispatch));

export const attemptDeleteProject = projectId => dispatch => deleteProject({ projectId }).then((data) => {
	dispatch(removeProject(projectId));
	return data;
}).catch(handleError(dispatch));
