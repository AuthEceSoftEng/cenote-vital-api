import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import pick from 'ramda/src/pick';

import { attemptGetTodos } from '../../../store/actions/todos';
import TodoPageContainer from './TodoPageContainer';

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({
	pushToLogin: () => dispatch(push('/login')),
	getTodos: () => dispatch(attemptGetTodos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoPageContainer);
