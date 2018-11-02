import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

import { attemptGetProjects } from '../../../actions/projects';

import AddProject from '../../AddProject';
import ProjectList from '../../ProjectList';

class ProjectPageContainer extends React.Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		pushToLogin: PropTypes.func.isRequired,
		getProjects: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToLogin, getProjects } = this.props;
		if (isEmpty(user)) {
			pushToLogin();
		} else {
			getProjects();
		}
	}

	render() {
		return (
			<div className="project-page section">
				<h1 className="title is-1 has-text-centered">Projects</h1>
				<div className="columns">
					<div className="column is-8 is-offset-2 text-center">
						<AddProject />
					</div>
				</div>
				<div className="columns">
					<div className="column is-8 is-offset-2 text-left">
						<ProjectList />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = pick(['user']);
const mapDispatchToProps = dispatch => ({
	pushToLogin: () => dispatch(push('/login')),
	getProjects: () => dispatch(attemptGetProjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPageContainer);
