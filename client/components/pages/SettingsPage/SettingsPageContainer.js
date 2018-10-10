import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import SettingsPage from './SettingsPage';

const SettingsPageContainer = (props) => {
	const { user, pushToLogin, location } = props;
	if (isEmpty(user)) {
		pushToLogin();
	}
	return (
		<SettingsPage location={location} />
	);
};

SettingsPageContainer.propTypes = {
	user: PropTypes.shape({}).isRequired,
	pushToLogin: PropTypes.func.isRequired,
	location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
};

export default SettingsPageContainer;
