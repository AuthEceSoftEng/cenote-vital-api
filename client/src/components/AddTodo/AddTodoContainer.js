import React from 'react';
import PropTypes from 'prop-types';

import AddTodo from './AddTodo';

export default class AddTodoContainer extends React.Component {
	static propTypes = { addTodo: PropTypes.func.isRequired };

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
			this.addTodo();
		}
	}

	addTodo = () => {
		const { text } = this.state;
		const { addTodo } = this.props;
		if (text) {
			addTodo(text);
			this.setState({ text: '' });
		}
	}

	render() {
		const { text } = this.state;
		return (<AddTodo text={text} updateText={this.updateText} addTodo={this.addTodo} />);
	}
}
