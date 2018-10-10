import React from 'react';
import Main from './Main';

export default class MainContainer extends React.Component {
	componentDidUpdate() {
		this.scrollToTop();
	}

	scrollToTop = () => window.scrollTo(0, 0)

	render() {
		return (<Main {...this.props} />);
	}
}
