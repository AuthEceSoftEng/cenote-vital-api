import request from 'superagent';
import { handleSuccess, handleError } from './helpers';

export const postProject = info => request.post('/api/projects').send(info).then(handleSuccess).catch(handleError);

export const getProjects = () => request.get('/api/projects').then(handleSuccess).catch(handleError);

export const putToggleCompleteProject = info => request.put('/api/projects/complete').send(info).then(handleSuccess).catch(handleError);

export const putProject = info => request.put('/api/projects').send(info).then(handleSuccess).catch(handleError);

export const deleteProject = info => request.delete('/api/projects').send(info).then(handleSuccess).catch(handleError);
