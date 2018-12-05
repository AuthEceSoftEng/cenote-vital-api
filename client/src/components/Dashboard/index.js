import { connect } from 'react-redux';

import { attemptUpdateProjectReadKey, attemptUpdateProjectWriteKey, attemptUpdateProjectMasterKey } from '../../actions/projects';
import Dashboard from './Dashboard';


const mapDispatchToProps = dispatch => ({
	updateProjectReadKey: (readKey, id) => dispatch(attemptUpdateProjectReadKey(readKey, id)),
	updateProjectWriteKey: (writeKey, id) => dispatch(attemptUpdateProjectWriteKey(writeKey, id)),
	updateProjectMasterKey: (masterKey, id) => dispatch(attemptUpdateProjectMasterKey(masterKey, id)),
});

export default connect(undefined, mapDispatchToProps)(Dashboard);
