import { connect } from 'react-redux';
import pick from 'ramda/src/pick';

import { attemptGetUser } from '../../store/actions/user';
import RootContainer from './RootContainer';

const mapStateToProps = pick([]);
const mapDispatchToProps = dispatch => ({ attemptGetUser: () => dispatch(attemptGetUser()) });

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
