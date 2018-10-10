import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptUpdateUser } from '../../store/actions/user';
import ChangeUsernameContainer from './ChangeUsernameContainer';

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ attemptUpdateUser: user => dispatch(attemptUpdateUser(user)) });

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUsernameContainer);
