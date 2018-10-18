import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pick, reverse } from 'ramda';

import Todo from './Todo';

function TodoList({ todos }) {
	return (
		<ul className="todo-list">
			{reverse(todos).map(todo => <Todo key={todo.id} {...todo} />)}
		</ul>
	);
}

TodoList.propTypes = { todos: PropTypes.arrayOf(PropTypes.object).isRequired };

const mapStateToProps = pick(['todos']);

export default connect(mapStateToProps)(TodoList);
