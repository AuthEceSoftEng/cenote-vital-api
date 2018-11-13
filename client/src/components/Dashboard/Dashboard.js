import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

import EventCollection from './dashboardComponents/EventCollection';
import { Button } from '..';

const Dashboard = (props) => {
	const { project } = props;
	return (
		<div>
			<h1 className="title is-1">{project.text}</h1>
			<Tabs forceRenderTabPanel defaultIndex={1} defaultFocus>
				<TabList>
					<Tab>Event Collections</Tab>
					<Tab>Project Information</Tab>
				</TabList>
				<TabPanel>
					<Tabs forceRenderTabPanel>
						<TabList>
							<Tab>Event Collection 1</Tab>
							<Tab>Event Collection 2</Tab>
							<Tab>Event Collection 3</Tab>
							<Tab>Event Collection 4</Tab>
							<Tab>Event Collection 5</Tab>
						</TabList>
						<TabPanel><EventCollection /></TabPanel>
						<TabPanel><EventCollection /></TabPanel>
						<TabPanel><EventCollection /></TabPanel>
						<TabPanel><EventCollection /></TabPanel>
						<TabPanel><EventCollection /></TabPanel>
					</Tabs>
				</TabPanel>
				<TabPanel>
					<Tabs forceRenderTabPanel>
						<TabList>
							<Tab>Project</Tab>
							<Tab>Keys</Tab>
						</TabList>
						<TabPanel>
							<div className="container is-fluid">
								<table className="table has-text-centered" align="center">
									<thead>
										<tr>
											<th className="has-text-centered">Project Name</th>
											<th className="has-text-centered">Project ID</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th className="has-text-centered has-text-danger">{project.text}</th>
											<td className="has-text-centered has-text-grey">{project.projectId}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</TabPanel>
						<TabPanel>
							<div className="container is-fluid">
								<table className="table has-text-centered" align="center">
									<thead>
										<tr>
											<th className="has-text-centered is-vcentered">Key</th>
											<th className="has-text-centered">Value</th>
											<th className="has-text-centered">Options</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th className="has-text-centered has-text-primary">Read key</th>
											<td className="has-text-centered has-text-grey">{project.readKey}</td>
											<td><Button label="Edit" type="info" onClick={() => alert('Not yet')} /></td>
										</tr>
										<tr>
											<th className="has-text-centered has-text-link">Write key</th>
											<td className="has-text-centered has-text-grey">{project.writeKey}</td>
											<td><Button label="Edit" type="info" onClick={() => alert('Not yet')} /></td>
										</tr>
										<tr>
											<th className="has-text-centered has-text-danger">Master key</th>
											<td className="has-text-centered has-text-grey">{project.masterKey}</td>
											<td><Button label="Edit" type="info" onClick={() => alert('Not yet')} /></td>
										</tr>
									</tbody>
								</table>
							</div>
						</TabPanel>
					</Tabs>
				</TabPanel>
			</Tabs>
		</div>
	);
};

Dashboard.propTypes = { project: PropTypes.object.isRequired };

export default connect()(Dashboard);
