import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import TodoPage from './TodoPage';

export default class TodoPageContainer extends Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		pushToLogin: PropTypes.func.isRequired,
		getTodos: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToLogin, getTodos } = this.props;
		if (isEmpty(user)) {
			pushToLogin();
		} else {
			getTodos();
		}
	}

	render() {
		return (
			<TodoPage />
		);
	}
}
