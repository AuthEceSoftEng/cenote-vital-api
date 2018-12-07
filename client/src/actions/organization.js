import { push } from 'connected-react-router';
import { snakeToCamelCase } from 'json-style-converter/es5';
import Notifications from 'react-notification-system-redux';

import { postRegister, postLogin, postLogout } from '../api/auth';
import { getOrganization,
	putOrganization,
	putOrganizationPassword,
	putNewOrganizationPassword,
	putOrganizationEmail,
	resetPassword } from '../api/organization';
import { handleError, handleLoginError } from './helpers';
import * as types from '../constants/actionTypes';

export const login = organization => ({ type: types.LOGIN_ORG, organization: snakeToCamelCase(organization) });
export const logout = () => ({ type: types.LOGOUT_ORG });
export const updateOrganization = organization => ({ type: types.UPDATE_ORG, organization: snakeToCamelCase(organization) });

export const attemptLogin = organization => dispatch => postLogin(organization)
	.then((data) => {
		dispatch(login(data.organization));
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		dispatch(push('/home'));
		return data;
	})
	.catch(handleLoginError(dispatch));

export const attemptRegister = newOrganization => dispatch => postRegister(newOrganization)
	.then((data) => {
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		return dispatch(attemptLogin(newOrganization));
	})
	.then(() => dispatch(push('/settings')))
	.catch(handleError(dispatch));

export const attemptLogout = () => dispatch => postLogout()
	.then((data) => {
		dispatch(logout());
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		dispatch(push('/login'));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptReset = email => dispatch => resetPassword(email)
	.then((data) => {
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		return dispatch(push('/home'));
	})
	.catch(handleError(dispatch));

export const attemptGetOrganization = () => dispatch => getOrganization()
	.then((data) => {
		dispatch(updateOrganization(data.organization));
		return data.organization;
	})
	.catch(handleError(dispatch));

export const attemptUpdateOrganization = updatedOrganization => dispatch => putOrganization(updatedOrganization)
	.then((data) => {
		dispatch(updateOrganization(data.organization));
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptUpdateEmail = emailInfo => dispatch => putOrganizationEmail(emailInfo)
	.then((data) => {
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptUpdatePassword = passwordInfo => dispatch => putOrganizationPassword(passwordInfo)
	.then((data) => {
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptResetPassword = passwordInfo => dispatch => putNewOrganizationPassword(passwordInfo)
	.then((data) => {
		dispatch(Notifications.success({ title: 'Success!', message: data.message, position: 'tr', autoDismiss: 3 }));
		dispatch(push('/login'));
		return data;
	})
	.catch(handleError(dispatch));
