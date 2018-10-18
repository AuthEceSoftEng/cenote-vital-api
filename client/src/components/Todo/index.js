import { pick } from 'ramda';
import { connect } from 'react-redux';

import { attemptToggleCompleteTodo, attemptUpdateTodo, attemptDeleteTodo } from '../../actions/todos';
import TodoContainer from './TodoContainer';

const mapStateToProps = pick([]);
const mapDispatchToProps = dispatch => ({
	toggleCompleteTodo: id => dispatch(attemptToggleCompleteTodo(id)),
	updateTodo: (text, id) => dispatch(attemptUpdateTodo(text, id)),
	deleteTodo: id => dispatch(attemptDeleteTodo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoContainer);
