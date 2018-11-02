import React from 'react';

import DateTime from './widgets/datetime';
import PageSpeedInsightsScore from './widgets/pagespeed-insights/score';
import PageSpeedInsightsStats from './widgets/pagespeed-insights/stats';
import GitHubIssueCount from './widgets/github/issue-count';

const Dashboard = () => (
	<main className="dashboard">
		<DateTime interval={60 * 1000} />
		<GitHubIssueCount owner="lodash" repository="lodash" />
		<GitHubIssueCount owner="iamnapo" repository="gwi" />
		<PageSpeedInsightsScore url="https://github.com" />
		<PageSpeedInsightsStats url="https://github.com" />
	</main>
);

export default Dashboard;
