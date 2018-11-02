import React from 'react';
import PropTypes from 'prop-types';

const CircleProgress = (props) => {
	const { max, radius, unit, value } = props;

	const strokeDasharray = 2 * radius * Math.PI;
	const strokeDashoffset = ((max - value) / max) * strokeDasharray;

	return (
		<svg viewBox="0 0 200 200" className="svg">
			<circle r={radius} className="circle background" />
			<circle
				r={radius}
				className="circle progress"
				strokeDasharray={strokeDasharray}
				strokeDashoffset={strokeDashoffset}
			/>
			<text x="100" y="120" className="text">
				{value}
				{unit}
			</text>
		</svg>
	);
};

CircleProgress.propTypes = {
	max: PropTypes.number,
	radius: PropTypes.number,
	unit: PropTypes.string,
	value: PropTypes.number,
};

CircleProgress.defaultProps = {
	max: 100,
	radius: 90,
	unit: '',
	value: 0,
};

export default class PageSpeedInsightsScore extends React.Component {
	static propTypes = {
		filterThirdPartyResources: PropTypes.bool,
		strategy: PropTypes.string,
		title: PropTypes.string,
	}

	static defaultProps = {
		filterThirdPartyResources: false,
		strategy: 'desktop',
		title: 'CPU LOAD',
	}

	state = { score: 0 }

	componentDidMount() {
		this.fetchInformation();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	async fetchInformation() {
		const { url, filterThirdPartyResources, strategy } = this.props;

		const searchParams = [
			`url=${url}`,
			`filter_third_party_resources=${filterThirdPartyResources}`,
			`strategy=${strategy}`,
		].join('&');

		try {
			const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`);
			const json = await res.json();

			this.setState({ score: json.ruleGroups.SPEED.score });
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const { score } = this.state;
		const { title } = this.props;
		return (
			<div className="widget">
				<h3 className="title is-3" style={{ color: 'black' }}>{title}</h3>
				<CircleProgress value={score} />
			</div>
		);
	}
}
