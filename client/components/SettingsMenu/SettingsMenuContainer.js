import React from 'react';
import PropTypes from 'prop-types';
import identity from 'ramda/src/identity';

import SettingsMenu from './SettingsMenu';

const SettingsMenuContainer = (props) => {
	const { attemptLogout, pathname } = props;
	return (
		<SettingsMenu
			pathname={pathname}
			logout={() => attemptLogout().catch(identity)}
		/>
	);
};

SettingsMenuContainer.propTypes = {
	pathname: PropTypes.string.isRequired,
	attemptLogout: PropTypes.func.isRequired,
};

export default SettingsMenuContainer;
