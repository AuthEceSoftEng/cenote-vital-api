import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { identity } from 'ramda';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import { attemptLogin } from '../../actions/organization';
import { Box, FormInput } from '../../components';

class LoginPage extends React.Component {
  static propTypes = { attemptLogin: PropTypes.func.isRequired };

  state = {
    remember: false,
    username: '',
    password: '',
  }

  componentWillMount() {
    const username = localStorage.getItem('username');
    if (username) {
      this.setState({ remember: true, username });
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  login = () => {
    const { username, password, remember } = this.state;
    const { attemptLogin: attemptlogin } = this.props;
    const organizationCredentials = { username, password };

    if (remember) { localStorage.setItem('username', username); }

    attemptlogin(organizationCredentials).catch(identity);
  }

  rememberMe = () => {
    localStorage.removeItem('username');
    this.setState(prevState => ({ remember: !prevState.remember }));
  }

  updateUsername = username => this.setState({ username })

  updatePassword = password => this.setState({ password })

  render() {
    const { remember, username, password } = this.state;

    return (
      <Box className="login">
        <h3 className="title is-3">Login</h3>
        <hr className="separator" />
        <p className="has-space-below">
          {'Not Registered Yet? '}
          <Link to="/register">Create an account</Link>
        </p>
        <FormInput
          onChange={e => this.updateUsername(e.target.value)}
          placeholder="Username"
          value={username}
          leftIcon={faUser}
        />
        <FormInput
          onChange={e => this.updatePassword(e.target.value)}
          placeholder="Password"
          value={password}
          leftIcon={faLock}
          type="password"
        />
        <p className="has-space-below">
          <Link to="/recovery">Forgot your password?</Link>
        </p>
        <hr className="separator" />
        <p className="control is-clearfix">
          <button type="button" className="button is-primary is-pulled-right" onClick={this.login}>Login</button>
          <input type="checkbox" onChange={this.rememberMe} checked={remember} />
          {' '}
          {'Remember me'}
        </p>
      </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({ attemptLogin: organization => dispatch(attemptLogin(organization)) });

export default connect(undefined, mapDispatchToProps)(LoginPage);
