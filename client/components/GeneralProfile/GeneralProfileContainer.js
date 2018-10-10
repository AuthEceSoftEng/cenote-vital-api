import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import identity from 'ramda/src/identity';

import { validateName } from '../../utils';
import GeneralProfile from './GeneralProfile';

export default class GeneralProfileContainer extends React.Component {
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
		const { attemptGetUser } = this.props;
		attemptGetUser().then(this.resetState).catch(identity);
	}

	save = () => {
		const { firstNameEdited, lastNameEdited, profilePicEdited, bioEdited, firstName, lastName, profilePic, bio } = this.state;
		const { attemptUpdateUser } = this.props;
		const updatedUser = {};

		if (firstNameEdited) { updatedUser.first_name = firstName; }
		if (lastNameEdited) { updatedUser.last_name = lastName; }
		if (profilePicEdited) { updatedUser.profile_pic = profilePic; }
		if (bioEdited) { updatedUser.bio = bio; }

		if (!isEmpty(updatedUser)) {
			attemptUpdateUser(updatedUser).then(this.resetState).catch(identity);
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
		const { user } = this.props;

		const edited = firstNameEdited || lastNameEdited || bioEdited || profilePicEdited;

		return (
			<GeneralProfile
				edited={edited}
				usernameCase={user.usernameCase}
				firstName={firstName}
				lastName={lastName}
				bio={bio}
				profilePic={profilePic}
				save={this.save}
				editProfile={this.editProfile}
				refresh={this.refresh}
				updateFirstName={this.updateFirstName}
				updateLastName={this.updateLastName}
				updateBio={this.updateBio}
				updateProfilePic={this.updateProfilePic}
			/>
		);
	}
}
