import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptLogin } from '../../store/actions/user';
import LoginContainer from './LoginContainer';

const mapStateToProps = pick([]);

const mapDispatchToProps = dispatch => ({ attemptLogin: user => dispatch(attemptLogin(user)) });

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
