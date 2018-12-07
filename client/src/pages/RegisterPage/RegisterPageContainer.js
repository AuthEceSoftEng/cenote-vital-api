import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

import RegisterPage from './RegisterPage';

class RegisterPageContainer extends React.Component {
	static propTypes = {
		organization: PropTypes.shape({}).isRequired,
		pushToHome: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { organization, pushToHome } = this.props;
		if (!isEmpty(organization)) {
			pushToHome();
		}
	}

	render() {
		return (
			<div className="register-page section">
				<RegisterPage />
			</div>
		);
	}
}

const mapStateToProps = pick(['organization']);
const mapDispatchToProps = dispatch => ({ pushToHome: () => dispatch(push('/home')) });

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPageContainer);
