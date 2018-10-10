import pick from 'ramda/src/pick';
import { connect } from 'react-redux';
import TodoList from './TodoList';

const mapStateToProps = pick(['todos']);

export default connect(mapStateToProps)(TodoList);
