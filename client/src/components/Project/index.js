import { connect } from 'react-redux';

import { attemptOpenProjectInfo, attemptUpdateProjectTitle, attemptDeleteProject } from '../../actions/projects';
import ProjectContainer from './ProjectContainer';

const mapDispatchToProps = dispatch => ({
	openProjectInfo: projectId => dispatch(attemptOpenProjectInfo(projectId)),
	updateProjectTitle: (text, id) => dispatch(attemptUpdateProjectTitle(text, id)),
	deleteProject: projectId => dispatch(attemptDeleteProject(projectId)),
});

export default connect(undefined, mapDispatchToProps)(ProjectContainer);
