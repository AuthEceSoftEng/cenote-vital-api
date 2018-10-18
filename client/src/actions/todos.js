import { snakeToCamelCase } from 'json-style-converter/es5';
import { assoc, omit, map } from 'ramda';

import { getTodos, postTodo, putToggleCompleteTodo, putTodo, deleteTodo } from '../api/todos';
import { handleError } from './helpers';
import * as types from '../constants/actionTypes';

export const setTodos = todos => ({
	type: types.SET_TODOS,
	todos,
});

export const addTodo = ({ id, text, createdAt }) => ({
	type: types.ADD_TODO,
	createdAt,
	id,
	text,
});

export const toggleCompleteTodo = id => ({
	type: types.TOGGLE_COMPLETE_TODO,
	id,
});

export const updateTodo = ({ id, text, updatedAt }) => ({
	type: types.UPDATE_TODO,
	updatedAt,
	id,
	text,
});

export const removeTodo = id => ({
	type: types.REMOVE_TODO,
	id,
});

export const attemptGetTodos = () => dispatch => getTodos()
	.then((data) => {
		const todos = map(todo => omit(['Id'], assoc('id', todo._id, snakeToCamelCase(todo))), data.todos);

		dispatch(setTodos(todos));
		return data.todos;
	})
	.catch(handleError(dispatch));

export const attemptAddTodo = text => dispatch => postTodo({ text })
	.then((data) => {
		const todo = omit(['Id'], assoc('id', data.todo._id, snakeToCamelCase(data.todo)));

		dispatch(addTodo(todo));
		return data.user;
	})
	.catch(handleError(dispatch));

export const attemptToggleCompleteTodo = id => dispatch => putToggleCompleteTodo({ id })
	.then((data) => {
		dispatch(toggleCompleteTodo(id));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptUpdateTodo = ({ id, text }) => dispatch => putTodo({ id, text })
	.then((data) => {
		dispatch(updateTodo({ id, text, updatedAt: data.todo.updated_at }));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptDeleteTodo = id => dispatch => deleteTodo({ id })
	.then((data) => {
		dispatch(removeTodo(id));
		return data;
	})
	.catch(handleError(dispatch));
