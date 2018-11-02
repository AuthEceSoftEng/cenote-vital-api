import { push } from 'connected-react-router';
import { snakeToCamelCase } from 'json-style-converter/es5';
import { assoc, omit, map } from 'ramda';

import { getProjects, postProject, putToggleCompleteProject, putProject, deleteProject } from '../api/projects';
import { handleError } from './helpers';
import * as types from '../constants/actionTypes';

export const setProjects = projects => ({ type: types.SET_PROJECTS, projects });
export const addProject = ({ id, text, createdAt }) => ({ type: types.ADD_PROJECT, createdAt, id, text });
export const openProjectInfo = project => ({ type: types.OPEN_PROJECT_INFO, project });
export const updateProject = ({ id, text, updatedAt }) => ({ type: types.UPDATE_PROJECT, updatedAt, id, text });
export const removeProject = id => ({ type: types.REMOVE_PROJECT, id });

export const attemptGetProjects = () => dispatch => getProjects().then((data) => {
	const projects = map(project => omit(['Id'], assoc('id', project._id, snakeToCamelCase(project))), data.projects);
	dispatch(setProjects(projects));
	return data.projects;
}).catch(handleError(dispatch));

export const attemptAddProject = text => dispatch => postProject({ text }).then((data) => {
	const project = omit(['Id'], assoc('id', data.project._id, snakeToCamelCase(data.project)));
	dispatch(addProject(project));
	return data.user;
}).catch(handleError(dispatch));

export const attemptOpenProjectInfo = projectId => dispatch => putToggleCompleteProject({ project_id: projectId }).then((data) => {
	dispatch(openProjectInfo(data.project));
	dispatch(push(`/projects/${data.project.project_id}`));
	return data.project;
}).catch(handleError(dispatch));

export const attemptUpdateProject = ({ id, text }) => dispatch => putProject({ id, text }).then((data) => {
	dispatch(updateProject({ id, text, updatedAt: data.project.updated_at }));
	return data;
}).catch(handleError(dispatch));

export const attemptDeleteProject = id => dispatch => deleteProject({ id }).then((data) => {
	dispatch(removeProject(id));
	return data;
}).catch(handleError(dispatch));
