import React from 'react';
import PropTypes from 'prop-types';
import reverse from 'ramda/src/reverse';

import { Todo } from '..';

export default function TodoList({ todos }) {
	return (
		<ul className="todo-list">
			{reverse(todos).map(todo => <Todo key={todo.id} {...todo} />)}
		</ul>
	);
}

TodoList.propTypes = { todos: PropTypes.arrayOf(PropTypes.object).isRequired };
