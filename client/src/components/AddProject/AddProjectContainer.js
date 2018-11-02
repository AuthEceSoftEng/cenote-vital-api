import React from 'react';
import PropTypes from 'prop-types';

import AddProject from './AddProject';

export default class AddProjectContainer extends React.Component {
	static propTypes = { addProject: PropTypes.func.isRequired };

	constructor(props) {
		super(props);
		this.state = { text: '' };
	}

	componentDidMount() {
		window.addEventListener('keypress', this.keypress);
	}

	componentWillUnmount() {
		window.removeEventListener('keypress', this.keypress);
	}

	updateText = e => this.setState({ text: e.target.value })

	keypress = (e) => {
		if (e.key === 'Enter') {
			this.addProject();
		}
	}

	addProject = () => {
		const { text } = this.state;
		const { addProject } = this.props;
		if (text) {
			addProject(text);
			this.setState({ text: '' });
		}
	}

	render() {
		const { text } = this.state;
		return (<AddProject text={text} updateText={this.updateText} addProject={this.addProject} />);
	}
}
