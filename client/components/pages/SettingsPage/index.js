import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import pick from 'ramda/src/pick';
import SettingsPageContainer from './SettingsPageContainer';

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ pushToLogin: () => dispatch(push('/login')) });

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageContainer);
