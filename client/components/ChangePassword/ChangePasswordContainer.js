import React, { Component } from 'react';
import PropTypes from 'prop-types';
import identity from 'ramda/src/identity';

import { validatePassword } from '../../utils';
import ChangePassword from './ChangePassword';

export default class ChangePasswordContainer extends Component {
	static propTypes = {
		user: PropTypes.shape({ username: PropTypes.string }).isRequired,
		attemptUpdatePassword: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			message: '',
			valid: false,
		};
	}

	updateOldPassword = e => this.setState({ oldPassword: e.target.value })

	updateNewPassword = (e) => {
		const { user } = this.props;
		this.setState({ newPassword: e.target.value });
		this.validatePassword(user.username, e.target.value);
	}

	updateConfirmPassword = e => this.setState({ confirmPassword: e.target.value })

	validatePassword = (username, password) => {
		const { valid, message } = validatePassword(username, password);

		this.setState({ valid, message });
	}

	save = () => {
		const { valid, oldPassword, newPassword, confirmPassword } = this.state;
		const { attemptUpdatePassword } = this.props;
		if (valid && newPassword === confirmPassword && oldPassword) {
			attemptUpdatePassword({ oldPassword, newPassword }).then(() => this.setState({
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				message: '',
				valid: false,
			})).catch(identity);
		}
	}

	render() {
		const { oldPassword, newPassword, confirmPassword, message, valid } = this.state;
		return (
			<ChangePassword
				oldPassword={oldPassword}
				newPassword={newPassword}
				message={message}
				valid={valid}
				confirmPassword={confirmPassword}
				updateOldPassword={this.updateOldPassword}
				updateNewPassword={this.updateNewPassword}
				updateConfirmPassword={this.updateConfirmPassword}
				save={this.save}
			/>
		);
	}
}
