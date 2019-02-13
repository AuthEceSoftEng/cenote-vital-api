import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { distanceInWordsToNow } from 'date-fns';

import Project from './Project';

export default class ProjectContainer extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    openProjectInfo: PropTypes.func.isRequired,
    updateProjectTitle: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
  };

  static defaultProps = { updatedAt: undefined, projectId: '', createdAt: '' };

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      edit: false,
      updatedMessage: '',
      createdMessage: '',
    };
  }

  componentDidMount() {
    this.updateMessages();
    this.interval = window.setInterval(this.updateMessages, 1000 * 60);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ updatedMessage: this.fromNow(nextProps.updatedAt) });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateMessages = () => {
    const { updatedAt, createdAt } = this.props;
    this.setState({ updatedMessage: updatedAt ? this.fromNow(updatedAt) : '', createdMessage: this.fromNow(createdAt) });
  }

  fromNow = date => distanceInWordsToNow(date, { addSuffix: true })

  openProjectInfo = () => {
    const { projectId, openProjectInfo } = this.props;
    openProjectInfo(projectId);
  }

  updateTitle = e => this.setState({ title: e.target.value })

  editProject = () => this.setState({ edit: true })

  cancelEdit = () => {
    const { title } = this.props;
    this.setState({ title, edit: false });
  }

  deleteProject = () => {
    const { projectId, deleteProject } = this.props;
    deleteProject(projectId);
  }

  updateProjectTitle = () => {
    const { title } = this.state;
    const { updateProjectTitle, projectId } = this.props;
    if (title) {
      updateProjectTitle({ projectId, title }).then(() => this.setState({ edit: false }));
    }
  }

  render() {
    const { updatedAt, title } = this.props;
    const { edit, confirm, createdMessage, updatedMessage, title: currentTitle } = this.state;
    return (
      <Project
        confirm={confirm}
        edit={edit}
        updated={!!updatedAt}
        currentTitle={currentTitle}
        title={title}
        createdMessage={createdMessage}
        updatedMessage={updatedMessage}
        openProjectInfo={this.openProjectInfo}
        updateTitle={this.updateTitle}
        updateProjectTitle={this.updateProjectTitle}
        editProject={this.editProject}
        cancelEdit={this.cancelEdit}
        deleteProject={this.deleteProject}
      />
    );
  }
}
