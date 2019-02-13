import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';
import Welcome from 'react-welcome-page';

class WelcomePage extends Component {
  static propTypes = {
    organization: PropTypes.shape({}).isRequired,
    pushToProjects: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { organization, pushToProjects } = this.props;
    if (!isEmpty(organization)) {
      pushToProjects();
    }
  }

  render() {
    return (
      <div className="welcome-page section">
        <Welcome
          loopDuration={3000}
          data={
            [
              {
                image: require('../../assets/images/logo_color.png'),
                imageAnimation: 'flipInX',
              },
            ]
          }
        />
        <h1 className="title is-1">{'Welcome to cenote\'s Dashboard!'}</h1>
      </div>
    );
  }
}

const mapStateToProps = pick(['organization']);

const mapDispatchToProps = dispatch => ({ pushToProjects: () => dispatch(push('/projects')) });

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
