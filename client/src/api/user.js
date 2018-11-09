import request from 'superagent';
import { handleSuccess, handleError } from './helpers';

export const getUser = () => request.get('/api/user').then(handleSuccess).catch(handleError);

export const putUser = info => request.put('/api/user').send(info).then(handleSuccess).catch(handleError);

export const putUserPassword = passwordInfo => request.put('/api/user/password').send(passwordInfo).then(handleSuccess).catch(handleError);

export const putNewUserPassword = passwordInfo => request.post('/api/user/password').send(passwordInfo).then(handleSuccess).catch(handleError);

export const putUserEmail = emailInfo => request.put('/api/user/email').send(emailInfo).then(handleSuccess).catch(handleError);

export const resetPassword = emailInfo => request.post('/api/users/reset').send(emailInfo).then(handleSuccess).catch(handleError);
