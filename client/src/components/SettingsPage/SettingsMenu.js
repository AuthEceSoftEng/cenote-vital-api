import React from 'react';
import { connect } from 'react-redux';
import { pick, identity } from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { attemptLogout } from '../../actions/user';

const SettingsMenuContainer = (props) => {
	const { pathname } = props;

	const profileClasses = classNames({ 'is-active': pathname.includes('profile') || pathname === '/settings' || pathname === '/settings/' });
	const accountClasses = classNames({ 'is-active': pathname.includes('account') });
	const logout = () => attemptLogout().catch(identity);

	return (
		<aside className="settings-menu menu box">
			<p className="menu-label">Personal</p>
			<ul className="menu-list">
				<li>
					<Link to="/settings/profile" className={profileClasses}>Profile</Link>
				</li>
			</ul>
			<p className="menu-label">Settings</p>
			<ul className="menu-list">
				<li>
					<Link to="/settings/account" className={accountClasses}>Account</Link>
				</li>
				<li>
					<button onClick={logout} type="button" onKeyPress={logout}>Logout</button>
				</li>
			</ul>
		</aside>
	);
};

SettingsMenuContainer.propTypes = { pathname: PropTypes.string.isRequired };

const mapStateToProps = pick([]);
const mapDispatchToProps = dispatch => ({ attemptLogout: () => dispatch(attemptLogout()) });

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMenuContainer);
