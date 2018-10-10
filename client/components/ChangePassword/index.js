import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptUpdatePassword } from '../../store/actions/user';
import ChangePasswordContainer from './ChangePasswordContainer';


const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ attemptUpdatePassword: passwordInfo => dispatch(attemptUpdatePassword(passwordInfo)) });

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordContainer);
