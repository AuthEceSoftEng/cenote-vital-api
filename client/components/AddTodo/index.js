import pick from 'ramda/src/pick';
import { connect } from 'react-redux';
import { attemptAddTodo } from '../../store/actions/todos';
import AddTodoContainer from './AddTodoContainer';

const mapStateToProps = pick([]);
const mapDispatchToProps = dispatch => ({ addTodo: text => dispatch(attemptAddTodo(text)) });

export default connect(mapStateToProps, mapDispatchToProps)(AddTodoContainer);
