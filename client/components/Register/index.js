import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptRegister } from '../../store/actions/user';
import RegisterContainer from './RegisterContainer';

const mapStateToProps = pick([]);

const mapDispatchToProps = dispatch => ({ attemptRegister: newUser => dispatch(attemptRegister(newUser)) });

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
