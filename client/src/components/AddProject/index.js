import { connect } from 'react-redux';
import { attemptAddProject } from '../../actions/projects';
import AddProjectContainer from './AddProjectContainer';

const mapDispatchToProps = dispatch => ({ addProject: title => dispatch(attemptAddProject(title)) });

export default connect(undefined, mapDispatchToProps)(AddProjectContainer);
