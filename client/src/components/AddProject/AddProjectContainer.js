import React from 'react';
import PropTypes from 'prop-types';

import AddProject from './AddProject';

export default class AddProjectContainer extends React.Component {
  static propTypes = { addProject: PropTypes.func.isRequired };

  constructor(props) {
    super(props);
    this.state = { title: '' };
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keypress);
  }

  updateTitle = e => this.setState({ title: e.target.value })

  keypress = (e) => {
    if (e.key === 'Enter') {
      this.addProject();
    }
  }

  addProject = () => {
    const { title } = this.state;
    const { addProject } = this.props;
    if (title) {
      addProject(title);
      this.setState({ title: '' });
    }
  }

  render() {
    const { title } = this.state;
    return (<AddProject title={title} updateTitle={this.updateTitle} addProject={this.addProject} />);
  }
}
