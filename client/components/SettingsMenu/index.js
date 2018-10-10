import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptLogout } from '../../store/actions/user';
import SettingsMenuContainer from './SettingsMenuContainer';

const mapStateToProps = pick([]);

const mapDispatchToProps = dispatch => ({ attemptLogout: () => dispatch(attemptLogout()) });

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMenuContainer);
