import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import HomePage from './HomePage';

export default class HomePageContainer extends Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		pushToLogin: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToLogin } = this.props;
		if (isEmpty(user)) {
			pushToLogin();
		}
	}

	render() {
		return (
			<HomePage />
		);
	}
}
