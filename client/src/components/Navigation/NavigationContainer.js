import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, equals } from 'ramda';
import Navigation from './Navigation';

export default class NavigationContainer extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    organization: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      auth: !isEmpty(props.organization),
      dropdownOpen: false,
      opening: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { organization } = this.props;
    if (!equals(nextProps.organization, organization)) {
      this.setState({ auth: !isEmpty(nextProps.organization) });
    }
  }

  toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen, opening: true }))

  closeDropdown = () => {
    const { opening } = this.state;
    return opening ? this.setState({ opening: false, dropdownOpen: false }) : this.setState({ dropdownOpen: false });
  }

  render() {
    const { auth, dropdownOpen } = this.state;
    const { pathname, organization } = this.props;

    return (
      <Navigation
        organization={organization}
        auth={auth}
        pathname={pathname}
        organizationDropdownOpen={dropdownOpen}
        toggleOrganizationDropdown={this.toggleDropdown}
        closeOrganizationDropdown={this.closeDropdown}
      />
    );
  }
}
