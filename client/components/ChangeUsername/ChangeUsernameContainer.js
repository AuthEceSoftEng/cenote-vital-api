import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import equals from 'ramda/src/equals';
import ChangeUsername from './ChangeUsername';

export default class ChangeUsernameContainer extends Component {
	static propTypes = {
		user: PropTypes.shape({
			username: PropTypes.string,
			usernameCase: PropTypes.string,
			email: PropTypes.string,
		}).isRequired,
		attemptUpdateUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = { usernameCase: props.user.usernameCase };
	}

	componentWillReceiveProps(nextProps) {
		const { user } = this.props;
		if (!isEmpty(nextProps.user) && !equals(nextProps.user, user)) {
			this.setState({ usernameCase: nextProps.user.usernameCase });
		}
	}

	updateUsernameCase = e => this.setState({ usernameCase: e.target.value })

	saveUsernameCase = () => {
		const { usernameCase } = this.state;
		const { user, attemptUpdateUser } = this.props;
		if (usernameCase.toLowerCase() === user.username) {
			const updatedUser = { username_case: usernameCase };
			attemptUpdateUser(updatedUser).catch(() => this.setState({ usernameCase: user.usernameCase }));
		}
	}

	isDisabled = () => {
		const { user } = this.props;
		const { usernameCase } = this.state;
		return user.usernameCase === usernameCase || usernameCase.toLowerCase() !== user.username;
	}

	render() {
		const { usernameCase } = this.state;
		const { user } = this.props;
		return (
			<ChangeUsername
				disabled={this.isDisabled()}
				username={user.username}
				usernameCase={usernameCase}
				currentUsernameCase={user.usernameCase}
				updateUsernameCase={this.updateUsernameCase}
				saveUsernameCase={this.saveUsernameCase}
			/>
		);
	}
}
