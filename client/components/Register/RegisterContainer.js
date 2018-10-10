import React from 'react';
import PropTypes from 'prop-types';
import identity from 'ramda/src/identity';

import { postCheckUsername } from '../../api/users';
import { validatePassword, validateUsername } from '../../utils';
import Register from './Register';

export default class RegisterPage extends React.Component {
	static propTypes = { attemptRegister: PropTypes.func.isRequired };

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			usernameMessage: '',
			password: '',
			passwordMessage: '',
			usernameAvailable: false,
			passwordValid: false,
		};
	}

	componentDidMount() {
		window.addEventListener('keypress', this.handleKeyPress);
	}

	componentWillUnmount() {
		window.removeEventListener('keypress', this.handleKeyPress);
	}

	handleKeyPress = (e) => {
		if (e.key === 'Enter') this.register();
	}

	updateUsername = (username) => {
		const { password } = this.state;
		this.setState({ username });
		this.validatePassword(username, password);
	}

	updatePassword = password => this.setState({ password })

	handleUsernameChange = (e) => {
		this.updateUsername(e.target.value);
		this.validateUsername(e.target.value);
	}

	handlePasswordChange = (e) => {
		const { username } = this.state;
		this.updatePassword(e.target.value);
		this.validatePassword(username, e.target.value);
	}

	validateUsername = (username) => {
		const { valid, message } = validateUsername(username);

		if (valid) {
			this.setState({ usernameMessage: 'Checking username...', usernameAvailable: false },
				() => postCheckUsername(username)
					.then(res => this.setState({
						usernameAvailable: res.available,
						usernameMessage: res.message,
					}))
					.catch(identity));
		} else {
			this.setState({ usernameAvailable: valid, usernameMessage: message });
		}
	}

	validatePassword = (username, password) => {
		const { valid, message } = validatePassword(username, password);

		this.setState({ passwordValid: valid, passwordMessage: message });
	}

	register = () => {
		const { usernameAvailable, username, password, passwordValid } = this.state;
		const { attemptRegister } = this.props;
		if (usernameAvailable && passwordValid) {
			const newUser = { username, password };
			attemptRegister(newUser).catch(identity);
		}
	}

	render() {
		const { username, usernameMessage, usernameAvailable, password, passwordMessage, passwordValid } = this.state;

		return (
			<Register
				username={username}
				usernameMessage={usernameMessage}
				handleUsernameChange={this.handleUsernameChange}
				password={password}
				passwordMessage={passwordMessage}
				handlePasswordChange={this.handlePasswordChange}
				usernameAvailable={usernameAvailable}
				passwordValid={passwordValid}
				register={this.register}
			/>
		);
	}
}
