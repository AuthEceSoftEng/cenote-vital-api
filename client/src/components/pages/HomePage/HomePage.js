import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pick, isEmpty } from 'ramda';

import Clock from '../../Clock';

class HomePageContainer extends React.Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		pushToLogin: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToLogin } = this.props;
		if (isEmpty(user)) {
			pushToLogin();
		}
	}

	render() {
		const { user } = this.props;
		return (
			<div className="home-page section">
				<Clock />
				<h1 className="title is-1">{`Welcome, ${user.username}!`}</h1>
			</div>
		);
	}
}

const mapStateToProps = pick(['user']);
const mapDispatchToProps = dispatch => ({ pushToLogin: () => dispatch(push('/login')) });

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
