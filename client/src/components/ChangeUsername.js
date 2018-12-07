import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pick, isEmpty, equals } from 'ramda';
import classNames from 'classnames';

import { attemptUpdateOrganization } from '../actions/organization';

class ChangeUsernameContainer extends React.Component {
	static propTypes = {
		organization: PropTypes.shape({
			username: PropTypes.string,
			usernameCase: PropTypes.string,
			email: PropTypes.string,
		}).isRequired,
		attemptUpdateOrganization: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = { usernameCase: props.organization.usernameCase };
	}

	componentWillReceiveProps(nextProps) {
		const { organization } = this.props;
		if (!isEmpty(nextProps.organization) && !equals(nextProps.organization, organization)) {
			this.setState({ usernameCase: nextProps.organization.usernameCase });
		}
	}

	updateUsernameCase = e => this.setState({ usernameCase: e.target.value })

	saveUsernameCase = () => {
		const { usernameCase } = this.state;
		const { organization, attemptUpdateOrganization: attemptupdateOrganization } = this.props;
		if (usernameCase.toLowerCase() === organization.username) {
			const updatedOrganization = { usernameCase };
			attemptupdateOrganization(updatedOrganization).catch(() => this.setState({ usernameCase: organization.usernameCase }));
		}
	}

	isDisabled = () => {
		const { organization } = this.props;
		const { usernameCase } = this.state;
		return organization.usernameCase === usernameCase || usernameCase.toLowerCase() !== organization.username;
	}

	render() {
		const { usernameCase } = this.state;
		const { organization } = this.props;
		const disabled = this.isDisabled();
		const { usernameCase: currentUsernameCase, username } = organization;
		const helpClasses = classNames({
			help: true,
			'is-success': !disabled,
			'is-danger': disabled,
		});

		const inputClasses = classNames({
			input: true,
			'is-success': !disabled,
			'is-danger': disabled && usernameCase !== currentUsernameCase,
		});

		const iconClasses = classNames({
			fa: true,
			'fa-check': !disabled,
			'is-success': !disabled,
			'fa-warning': disabled && usernameCase !== currentUsernameCase,
			'is-danger': disabled && usernameCase !== currentUsernameCase,
		});

		const helpMessage = disabled ? `Username case must match: ${username}` : 'Username case valid.';
		return (
			<div className="change-username box">
				<h3 className="title is-3">Username</h3>
				<hr className="separator" />
				<div className="field">
					<p className="control">
						<label htmlFor="username" className="label">
							{'Current Username'}
							<input
								id="username"
								className={inputClasses}
								type="text"
								value={currentUsernameCase}
								readOnly
							/>
						</label>
					</p>
				</div>
				<div className="field has-help">
					<p className="control has-icons-right">
						<label htmlFor="username-case" className="label">
							{'Username Case'}
							<input
								id="username-case"
								className={inputClasses}
								type="text"
								placeholder="Username Case"
								value={usernameCase}
								onChange={this.updateUsernameCase}
							/>
						</label>
						<span className="icon is-small is-right">
							<i className={iconClasses} />
						</span>
					</p>
					{usernameCase !== currentUsernameCase && (
						<p className={helpClasses}>
							{helpMessage}
						</p>
					)}
				</div>
				<hr className="separator" />
				<button
					type="button"
					className="button is-success"
					disabled={disabled}
					onClick={this.saveUsernameCase}
				>
					{'Save'}
				</button>
			</div>
		);
	}
}

const mapStateToProps = pick(['organization']);
const mapDispatchToProps = dispatch => ({ attemptUpdateOrganization: organization => dispatch(attemptUpdateOrganization(organization)) });

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUsernameContainer);
