import { connect } from 'react-redux';
import { attemptAddTodo } from '../../actions/todos';
import AddTodoContainer from './AddTodoContainer';

const mapDispatchToProps = dispatch => ({ addTodo: text => dispatch(attemptAddTodo(text)) });

export default connect(undefined, mapDispatchToProps)(AddTodoContainer);
