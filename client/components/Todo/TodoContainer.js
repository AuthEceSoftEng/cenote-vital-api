import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { distanceInWordsToNow } from 'date-fns';
import Todo from './Todo';

export default class TodoContainer extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired,
		createdAt: PropTypes.string.isRequired,
		updatedAt: PropTypes.string,
		toggleCompleteTodo: PropTypes.func.isRequired,
		updateTodo: PropTypes.func.isRequired,
		deleteTodo: PropTypes.func.isRequired,
	};

	static defaultProps = { updatedAt: undefined };

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

	toggleCompleteTodo = () => {
		const { id, toggleCompleteTodo } = this.props;
		toggleCompleteTodo(id);
	}

	updateText = e => this.setState({ text: e.target.value })

	editTodo = () => this.setState({ edit: true })

	cancelEdit = () => {
		const { text } = this.props;
		this.setState({ text, edit: false });
	}

	deleteTodo = () => {
		const { id, deleteTodo } = this.props;
		deleteTodo(id);
	}

	openModal = () => this.setState({ confirm: true })

	closeModal = () => this.setState({ confirm: false })

	updateTodo = () => {
		const { text } = this.state;
		const { updateTodo, id } = this.props;
		if (text) {
			updateTodo({ id, text }).then(() => this.setState({ edit: false }));
		}
	}

	render() {
		const { updatedAt, completed, text } = this.props;
		const { edit, confirm, createdMessage, updatedMessage, text: currentText } = this.state;

		return (
			<Todo
				completed={completed}
				confirm={confirm}
				edit={edit}
				updated={!!updatedAt}
				currentText={currentText}
				text={text}
				createdMessage={createdMessage}
				updatedMessage={updatedMessage}
				toggleCompleteTodo={this.toggleCompleteTodo}
				updateText={this.updateText}
				updateTodo={this.updateTodo}
				editTodo={this.editTodo}
				cancelEdit={this.cancelEdit}
				deleteTodo={this.deleteTodo}
				openModal={this.openModal}
				closeModal={this.closeModal}
			/>
		);
	}
}
