import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import Notifications from 'react-notification-system-redux';

import { WelcomePage, LoginPage, RegisterPage, HomePage, TodoPage, SettingsPage, LostPage, RecoveryPage } from '../../components/pages';
import { Footer } from '../../components';
import Navigation from '../../components/Navigation';

const Main = (props) => {
	const { location, alerts } = props;
	return (
		<div className="has-navbar-fixed-top">
			<Notifications notifications={alerts} />
			<Navigation pathname={location.pathname} />
			<div className="main">
				<Switch>
					<Route exact path="/" component={WelcomePage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
					<Route path="/home" component={HomePage} />
					<Route path="/todo" component={TodoPage} />
					<Route path="/settings" component={SettingsPage} />
					<Route path="/recovery" component={RecoveryPage} />
					<Route path="*" component={LostPage} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
};

Main.propTypes = {
	location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
	alerts: PropTypes.array.isRequired,
};

export default Main;
