import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

import { attemptGetTodos } from '../../../actions/todos';

import AddTodo from '../../AddTodo';
import TodoList from '../../TodoList';

class TodoPageContainer extends React.Component {
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
			<div className="todo-page section">
				<h1 className="title is-1 has-text-centered">Todo List:</h1>
				<div className="columns">
					<div className="column is-8 is-offset-2 text-center">
						<AddTodo />
					</div>
				</div>
				<div className="columns">
					<div className="column is-8 is-offset-2 text-left">
						<TodoList />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = pick(['user']);
const mapDispatchToProps = dispatch => ({
	pushToLogin: () => dispatch(push('/login')),
	getTodos: () => dispatch(attemptGetTodos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoPageContainer);
