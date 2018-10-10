import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/src/isEmpty';
import equals from 'ramda/src/equals';
import Navigation from './Navigation';

export default class NavigationContainer extends Component {
	static propTypes = {
		pathname: PropTypes.string.isRequired,
		user: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			auth: !isEmpty(props.user),
			dropdownOpen: false,
			opening: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!equals(nextProps.user, this.props.user)) {
			this.setState({ auth: !isEmpty(nextProps.user) });
		}
	}

	toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen, opening: true }))

	closeDropdown = () => (this.state.opening
		? this.setState({ opening: false })
		: this.setState({ dropdownOpen: false }))

	render() {
		const { auth, dropdownOpen } = this.state;
		const { pathname, user } = this.props;

		return (
			<Navigation
				user={user}
				auth={auth}
				pathname={pathname}
				userDropdownOpen={dropdownOpen}
				toggleUserDropdown={this.toggleDropdown}
				closeUserDropdown={this.closeDropdown}
			/>
		);
	}
}
