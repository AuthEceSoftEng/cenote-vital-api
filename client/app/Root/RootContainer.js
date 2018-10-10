import React, { Component } from 'react';
import PropTypes from 'prop-types';
import identity from 'ramda/src/identity';

import Root from './Root';

export default class RootContainer extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		attemptGetUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = { loading: true };
	}

	componentDidMount() {
		const { attemptGetUser } = this.props;
		attemptGetUser().then(() => this.setState({ loading: false })).catch(identity);
	}

	render() {
		const { store, history } = this.props;
		const { loading } = this.state;
		return !loading && (
			<Root store={store} history={history} />
		);
	}
}
