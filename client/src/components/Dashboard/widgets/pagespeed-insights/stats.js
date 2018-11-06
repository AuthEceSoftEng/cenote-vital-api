import React from 'react';
import PropTypes from 'prop-types';

export default class PageSpeedInsightsStats extends React.Component {
	static propTypes = {
		filterThirdPartyResources: PropTypes.bool,
		strategy: PropTypes.string,
		title: PropTypes.string,
	}

	static defaultProps = {
		filterThirdPartyResources: false,
		strategy: 'desktop',
		title: 'PageSpeed Stats',
	}

	state = {
		stats: {
			cssCount: '-',
			cssSize: '-',
			htmlSize: '-',
			imageSize: '-',
			javascriptCount: '-',
			javascriptSize: '-',
			requestCount: '-',
			requestSize: '-',
			otherSize: '-',
		},
	}

	componentDidMount() {
		this.fetchInformation();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	bytesToKilobytes(bytes) {
		return bytes > 0 ? (bytes / 1024).toFixed(1) : 0;
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

			const { pageStats } = json;
			const stats = {
				cssCount: pageStats.numberCssResources || 0,
				cssSize: this.bytesToKilobytes(pageStats.cssResponseBytes),
				htmlSize: this.bytesToKilobytes(pageStats.htmlResponseBytes),
				imageSize: this.bytesToKilobytes(pageStats.imageResponseBytes),
				javascriptCount: pageStats.numberJsResources || 0,
				javascriptSize: this.bytesToKilobytes(pageStats.javascriptResponseBytes),
				requestCount: pageStats.numberResources || 0,
				requestSize: this.bytesToKilobytes(pageStats.totalRequestBytes),
				otherSize: this.bytesToKilobytes(pageStats.otherResponseBytes),
			};

			this.setState({ stats });
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const { stats } = this.state;
		const { title } = this.props;
		return (
			<div className="widget">
				<h3 className="title is-3" style={{ color: 'black' }}>{title}</h3>
				<h4 className="title is-4 text">github.com</h4>
				<table>
					<tbody>
						<tr>
							<th>JavaScript</th>
							<td>
								{`${stats.javascriptSize} KB (${stats.javascriptCount}) `}
							</td>
						</tr>
						<tr>
							<th>CSS</th>
							<td>
								{`${stats.cssSize} KB (${stats.cssCount}) `}
							</td>
						</tr>
						<tr>
							<th>HTML</th>
							<td>
								{`${stats.htmlSize} KB (${stats.htmlSize}) `}
							</td>
						</tr>
						<tr>
							<th>Image</th>
							<td>
								{`${stats.imageSize} KB `}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}
