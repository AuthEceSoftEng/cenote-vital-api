import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pick, identity, isEmpty } from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import { attemptGetUser, attemptUpdateUser } from '../../actions/user';
import { validateName } from '../../utils/validation';

import Box from '../Box';

class ProfileSettings extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			usernameCase: PropTypes.string,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			bio: PropTypes.string,
			profilePic: PropTypes.string,
		}).isRequired,
		attemptGetUser: PropTypes.func.isRequired,
		attemptUpdateUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			firstName: props.user.firstName || '',
			lastName: props.user.lastName || '',
			bio: props.user.bio || '',
			profilePic: props.user.profilePic || '',
			firstNameEdited: false,
			lastNameEdited: false,
			bioEdited: false,
			profilePicEdited: false,
		};
	}

	resetState = () => {
		const { user } = this.props;
		this.setState({
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			bio: user.bio || '',
			profilePic: user.profilePic || '',
			firstNameEdited: false,
			lastNameEdited: false,
			bioEdited: false,
			profilePicEdited: false,
		});
	}

	updateFirstName = (e) => {
		if (validateName(e.target.value)) {
			this.setState({ firstName: e.target.value, firstNameEdited: true });
		}
	}

	updateLastName = (e) => {
		if (validateName(e.target.value)) {
			this.setState({ lastName: e.target.value, lastNameEdited: true });
		}
	}

	updateBio = e => this.setState({ bio: e.target.value, bioEdited: true })

	updateProfilePic = e => this.setState({ profilePic: e.target.value, profilePicEdited: true })

	refresh = () => {
		const { attemptGetUser: attemptgetUser } = this.props;
		attemptgetUser().then(this.resetState).catch(identity);
	}

	save = () => {
		const { firstNameEdited, lastNameEdited, profilePicEdited, bioEdited, firstName, lastName, profilePic, bio } = this.state;
		const updatedUser = {};

		if (firstNameEdited) { updatedUser.first_name = firstName; }
		if (lastNameEdited) { updatedUser.last_name = lastName; }
		if (profilePicEdited) { updatedUser.profile_pic = profilePic; }
		if (bioEdited) { updatedUser.bio = bio; }

		if (!isEmpty(updatedUser)) {
			const { attemptUpdateUser: attemptupdateUser } = this.props;
			attemptupdateUser(updatedUser).then(this.resetState).catch(identity);
		}
	}

	render() {
		const {
			firstName,
			lastName,
			bio,
			profilePic,
			firstNameEdited,
			lastNameEdited,
			bioEdited,
			profilePicEdited,
		} = this.state;

		const edited = firstNameEdited || lastNameEdited || bioEdited || profilePicEdited;
		const charactersRemaining = 240 - bio.length;
		return (
			<div className="profile-settings">
				<Box className="general-profile">
					<span className="icon is-medium is-pulled-right" role="button" tabIndex={0} onClick={this.refresh} onKeyPress={this.refresh}>
						<FontAwesomeIcon icon={faSync} size="lg" />
					</span>
					<h3 className="title is-3">General</h3>
					<hr className="separator" />
					<div className="columns">
						<div className="column is-4">
							<h3 className="title is-3 has-text-centered">
								{this.usernameCase}
							</h3>
							<figure className="image">
								<img
									className="profile-img"
									src={profilePic || '/assets/images/default-profile.png'}
									alt="Profile"
								/>
							</figure>
							<div className="field">
								<p className="control">
									<label htmlFor="profile-pic-url" className="label">
										{'Picture URL'}
										<input
											id="profile-pic-url"
											className="input"
											type="text"
											placeholder="Picture URL"
											value={profilePic}
											onChange={this.updateProfilePic}
										/>
									</label>
								</p>
							</div>
						</div>

						<div className="column is-8">
							<div className="columns">
								<div className="column is-6">
									<div className="field">
										<p className="control">
											<label htmlFor="first-name" className="label">
												{'First Name'}
												<input
													id="first-name"
													className="input"
													type="text"
													placeholder="First Name"
													value={firstName}
													onChange={this.updateFirstName}
												/>
											</label>
										</p>
									</div>
								</div>
								<div className="column is-6">
									<div className="field">
										<p className="control">
											<label htmlFor="last-name" className="label">
												{'Last Name'}
												<input
													id="last-name"
													className="input"
													type="text"
													placeholder="Last Name"
													value={lastName}
													onChange={this.updateLastName}
												/>
											</label>
										</p>
									</div>
								</div>
							</div>
							<div className="field">
								<p className="control">
									<label htmlFor="bio" className="label">
										{'Bio'}
										<textarea
											id="bio"
											className="textarea"
											placeholder="Tell us about yourself."
											value={bio}
											maxLength={240}
											onChange={this.updateBio}
										/>
									</label>
								</p>
								<p className="help">
									{`Characters remaining: ${charactersRemaining}`}
								</p>
							</div>

						</div>
					</div>
					<hr className="separator" />
					<button type="button" className="button is-success" disabled={!edited} onClick={this.save}>Save</button>
				</Box>
			</div>
		);
	}
}

const mapStateToProps = pick(['user', 'locations']);
const mapDispatchToProps = dispatch => ({
	attemptGetUser: () => dispatch(attemptGetUser()),
	attemptUpdateUser: user => dispatch(attemptUpdateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
