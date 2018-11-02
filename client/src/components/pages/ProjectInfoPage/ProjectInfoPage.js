import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pick, isEmpty } from 'ramda';

import Dashboard from '../../Dashboard';

class ProjectInfoPage extends React.Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		projects: PropTypes.array.isRequired,
		pushToLogin: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToLogin } = this.props;
		if (isEmpty(user)) {
			pushToLogin();
		}
	}

	render() {
		const { projects } = this.props;
		const [project] = projects;
		return (
			<div className="home-page section">
				<h1 className="title is-1">{project.text}</h1>
				<Dashboard />
			</div>
		);
	}
}

const mapStateToProps = pick(['user', 'projects']);
const mapDispatchToProps = dispatch => ({ pushToLogin: () => dispatch(push('/login')) });

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfoPage);
