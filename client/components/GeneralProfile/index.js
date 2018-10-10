import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptGetUser, attemptUpdateUser } from '../../store/actions/user';
import GeneralProfileContainer from './GeneralProfileContainer';

const mapStateToProps = pick(['user', 'locations']);

const mapDispatchToProps = dispatch => ({
	attemptGetUser: () => dispatch(attemptGetUser()),
	attemptUpdateUser: user => dispatch(attemptUpdateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralProfileContainer);
