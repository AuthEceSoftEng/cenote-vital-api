import { connect } from 'react-redux';
import { attemptAddProject } from '../../actions/projects';
import AddProjectContainer from './AddProjectContainer';

const mapDispatchToProps = dispatch => ({ addProject: text => dispatch(attemptAddProject(text)) });

export default connect(undefined, mapDispatchToProps)(AddProjectContainer);
