import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

import LoginPage from './LoginPage';

class LoginPageContainer extends React.Component {
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
			<div className="login-page section">
				<LoginPage />
			</div>
		);
	}
}

const mapStateToProps = pick(['user']);
const mapDispatchToProps = dispatch => ({ pushToHome: () => dispatch(push('/home')) });

export default connect(mapStateToProps, mapDispatchToProps)(LoginPageContainer);
