import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { slice } from 'ramda';

import Button from '../Button';
import OrganizationDropdown from '../OrganizationDropdown';

export default function Navigation(props) {
  const { organization, auth, pathname, toggleOrganizationDropdown, closeOrganizationDropdown, organizationDropdownOpen } = props;

  const isHome = (pathname.length === 5) ? pathname === '/home' : slice(0, 6, pathname) === '/home/';
  const isSettings = (pathname.length === 9) ? pathname === '/settings' : slice(0, 10, pathname) === '/settings/';
  const isProjects = (pathname.length === 9) ? pathname === '/projects' : slice(0, 10, pathname) === '/projects/';

  const homeItemClasses = classNames({
    'navbar-item': true,
    'is-tab': true,
    'is-hidden-mobile': true,
    'is-active': isHome,
  });

  const projectsItemClasses = classNames({
    'navbar-item': true,
    'is-tab': true,
    'is-hidden-mobile': true,
    'is-active': isProjects,
  });

  const settingsItemClasses = classNames({
    'navbar-item': true,
    'is-tab': true,
    'is-hidden-mobile': true,
    'is-active': isSettings,
  });

  return (
    <nav className="navbar is-fixed-top has-shadow" role="navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to={auth ? '/home' : '/'} className="navbar-item" aria-label="main navigation">
            <h3 className="title is-3 logo">Cenote Dashboard</h3>
          </Link>
          <div className="navbar-brand-right">
            {!auth && (
              <Link to="/login" className="navbar-item is-hidden-desktop">
                <Button label="Login" type="primary" />
              </Link>
            )}
            {!auth && (
              <Link to="/register" className="navbar-item is-hidden-desktop">
                <Button label="Sign Up" type="secondary" />
              </Link>
            )}
            {auth && (
              <button
                className="navbar-item is-hoverable is-hidden-desktop button"
                type="button"
                onClick={toggleOrganizationDropdown}
                onKeyPress={toggleOrganizationDropdown}
              >
                <figure className="image navbar-image is-32x32">
                  <img
                    className="profile-img"
                    src={organization.profilePic || require('../../assets/images/default-profile.png')}
                    alt=""
                  />
                </figure>
                <span className="dropdown-caret" />
              </button>
            )}
          </div>
        </div>

        {auth ? (
          <div className="navbar-menu">
            <div className="navbar-start">
              <Link to="/home" className={homeItemClasses}>
                <h6 className="title is-6">Home</h6>
              </Link>
              <Link to="/projects" className={projectsItemClasses}>
                <h6 className="title is-6">Projects</h6>
              </Link>
              <Link to="/settings" className={settingsItemClasses}>
                <h6 className="title is-6">Settings</h6>
              </Link>
            </div>
            <div className="navbar-end">
              <button
                className="navbar-item is-hoverable button"
                onClick={toggleOrganizationDropdown}
                onKeyPress={toggleOrganizationDropdown}
                type="button"
              >
                <figure className="image navbar-image is-32x32">
                  <img
                    className="profile-img"
                    src={organization.profilePic || require('../../assets/images/default-profile.png')}
                    alt=""
                  />
                </figure>
                <span className="dropdown-caret" />
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-menu">
            <div className="navbar-end">
              <Link to="/login" className="navbar-item">
                <Button label="Login" type="primary" />
              </Link>
              <Link to="/register" className="navbar-item">
                <Button label="Sign Up" type="secondary" />
              </Link>
            </div>
          </div>
        )}
        <OrganizationDropdown open={organizationDropdownOpen} closeDropdown={closeOrganizationDropdown} />
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  auth: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  organizationDropdownOpen: PropTypes.bool.isRequired,
  toggleOrganizationDropdown: PropTypes.func.isRequired,
  closeOrganizationDropdown: PropTypes.func.isRequired,
  organization: PropTypes.shape({
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    usernameCase: PropTypes.string,
    profilePic: PropTypes.string,
  }).isRequired,
};
