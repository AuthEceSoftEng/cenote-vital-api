import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

class WelcomePage extends Component {
	static propTypes = {
		user: PropTypes.shape({}).isRequired,
		pushToHome: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { user, pushToHome } = this.props;
		if (!isEmpty(user)) {
			pushToHome();
		}
	}

	render() {
		return (
			<div className="welcome-page page">
				<div className="section">
					<div className="container">
						<h1 className="title is-1">Welcome Page!</h1>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ pushToHome: () => dispatch(push('/home')) });

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
