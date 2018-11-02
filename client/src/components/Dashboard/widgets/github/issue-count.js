import React from 'react';
import PropTypes from 'prop-types';

export default class GitHubIssueCount extends React.Component {
	static propTypes = { owner: PropTypes.string.isRequired, repository: PropTypes.string.isRequired }

	state = { count: 0 }

	componentDidMount() {
		this.fetchInformation();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	async fetchInformation() {
		const { owner, repository } = this.props;

		try {
			const res = await fetch(`https://api.github.com/repos/${owner}/${repository}`);
			const json = await res.json();

			this.setState({ count: json.open_issues_count });
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const { count } = this.state;
		const { owner, repository } = this.props;
		return (
			<div className="widget">
				<h3 className="title is-3" style={{ color: 'black' }}>{`${owner}:${repository}`}</h3>
				<div className="counter">
					{count}
				</div>
			</div>
		);
	}
}
