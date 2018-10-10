import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptLogout } from '../../store/actions/user';
import UserDropdown from './UserDropdown';

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ attemptLogout: () => dispatch(attemptLogout()) });

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdown);
