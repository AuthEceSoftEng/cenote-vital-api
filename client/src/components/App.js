import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Notifications from 'react-notification-system-redux';
import { pick } from 'ramda';

import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SettingsPage from './SettingsPage';
import RecoveryPage from './RecoveryPage';
import TodoPage from './TodoPage';
import NotFoundPage from './NotFoundPage';

import Navigation from './Navigation';
import HomePage from './HomePage';

import Bottom from './Footer';

// eslint-disable-next-line
class App extends React.Component {

	static propTypes = {
		location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
		alerts: PropTypes.array.isRequired,
	}

	render() {
		const { location, alerts } = this.props;
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
						<Route path="*" component={NotFoundPage} />
					</Switch>
				</div>
				<Bottom />
			</div>
		);
	}
}
const mapStateToProps = pick(['alerts']);

export default hot(module)(withRouter(connect(mapStateToProps)(App)));
