import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { distanceInWordsToNow } from 'date-fns';

import Project from './Project';

export default class ProjectContainer extends Component {
	static propTypes = {
		projectId: PropTypes.string,
		text: PropTypes.string.isRequired,
		createdAt: PropTypes.string,
		updatedAt: PropTypes.string,
		openProjectInfo: PropTypes.func.isRequired,
		updateProject: PropTypes.func.isRequired,
		deleteProject: PropTypes.func.isRequired,
	};

	static defaultProps = { updatedAt: undefined, projectId: '', createdAt: '' };

	constructor(props) {
		super(props);
		this.state = {
			text: props.text,
			edit: false,
			confirm: false,
			updatedMessage: '',
			createdMessage: '',
		};
	}

	componentDidMount() {
		this.updateMessages();
		this.interval = window.setInterval(this.updateMessages, 1000);
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

	updateText = e => this.setState({ text: e.target.value })

	editProject = () => this.setState({ edit: true })

	cancelEdit = () => {
		const { text } = this.props;
		this.setState({ text, edit: false });
	}

	deleteProject = () => {
		const { projectId, deleteProject } = this.props;
		deleteProject(projectId);
	}

	openModal = () => this.setState({ confirm: true })

	closeModal = () => this.setState({ confirm: false })

	updateProject = () => {
		const { text } = this.state;
		const { updateProject, projectId } = this.props;
		if (text) {
			updateProject({ projectId, text }).then(() => this.setState({ edit: false }));
		}
	}

	render() {
		const { updatedAt, text } = this.props;
		const { edit, confirm, createdMessage, updatedMessage, text: currentText } = this.state;
		return (
			<Project
				confirm={confirm}
				edit={edit}
				updated={!!updatedAt}
				currentText={currentText}
				text={text}
				createdMessage={createdMessage}
				updatedMessage={updatedMessage}
				openProjectInfo={this.openProjectInfo}
				updateText={this.updateText}
				updateProject={this.updateProject}
				editProject={this.editProject}
				cancelEdit={this.cancelEdit}
				deleteProject={this.deleteProject}
				openModal={this.openModal}
				closeModal={this.closeModal}
			/>
		);
	}
}
