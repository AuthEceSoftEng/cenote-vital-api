import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import EventCollection from './dashboardComponents/EventCollection';
import { Button } from '..';


export default class Dashboard extends React.Component {
	static propTypes = {
		projectId: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		readKey: PropTypes.string.isRequired,
		writeKey: PropTypes.string.isRequired,
		masterKey: PropTypes.string.isRequired,
		updateProjectReadKey: PropTypes.func.isRequired,
		updateProjectWriteKey: PropTypes.func.isRequired,
		updateProjectMasterKey: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			readKey: props.readKey,
			writeKey: props.writeKey,
			text: props.text,
			masterKey: props.masterKey,
			editRead: false,
			editWrite: false,
			editMaster: false,
		};
	}

	updateProjectReadKey = () => {
		const { readKey } = this.state;
		const { updateProjectReadKey, projectId } = this.props;
		if (readKey) {
			updateProjectReadKey({ projectId, readKey }).then(() => this.setState({ editRead: false }));
		}
	}

	updateProjectWriteKey = () => {
		const { writeKey } = this.state;
		const { updateProjectWriteKey, projectId } = this.props;
		if (writeKey) {
			updateProjectWriteKey({ projectId, writeKey }).then(() => this.setState({ editWrite: false }));
		}
	}

	updateProjectMasterKey = () => {
		const { masterKey } = this.state;
		const { updateProjectMasterKey, projectId } = this.props;
		if (masterKey) {
			updateProjectMasterKey({ projectId, masterKey }).then(() => this.setState({ editMaster: false }));
		}
	}

	updateRead = e => this.setState({ readKey: e.target.value })

	updateWrite = e => this.setState({ writeKey: e.target.value })

	updateMaster = e => this.setState({ masterKey: e.target.value })

	editRead = () => {
		const { editRead } = this.state;
		if (editRead) {
			this.setState({ editRead: false });
		} else {
			this.setState({ editRead: true, editWrite: false, editMaster: false });
		}
	}

	editWrite = () => {
		const { editWrite } = this.state;
		if (editWrite) {
			this.setState({ editWrite: false });
		} else {
			this.setState({ editRead: false, editWrite: true, editMaster: false });
		}
	}

	editMaster = () => {
		const { editMaster } = this.state;
		if (editMaster) {
			this.setState({ editMaster: false });
		} else {
			this.setState({ editRead: false, editWrite: false, editMaster: true });
		}
	}

	render() {
		const { readKey, text, writeKey, masterKey, editRead, editWrite, editMaster } = this.state;
		const { projectId } = this.props;
		return (
			<div>
				<h1 className="title is-1">{text}</h1>
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
												<th className="has-text-centered has-text-danger">{text}</th>
												<td className="has-text-centered has-text-grey">{projectId}</td>
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
												{editRead
													? (
														<input
															className="input"
															type="text"
															value={readKey}
															onChange={this.updateRead}
															ref={inpt => inpt && inpt.focus()}
														/>
													)
													: (<td className="has-text-centered has-text-grey">{readKey}</td>)}
												{editRead
													? (
														<td>
															<Button
																label="Change!"
																type="danger"
																onClick={() => { this.editRead(); this.updateProjectReadKey(); }}
															/>

														</td>
													)
													: (<td><Button label="Edit" type="info" onClick={this.editRead} /></td>)
												}
											</tr>
											<tr>
												<th className="has-text-centered has-text-link">Write key</th>
												{editWrite
													? (
														<input
															className="input"
															type="text"
															value={writeKey}
															onChange={this.updateWrite}
															ref={inpt => inpt && inpt.focus()}
														/>
													)
													: (<td className="has-text-centered has-text-grey">{writeKey}</td>)}
												{editWrite
													? (
														<td>
															<Button
																label="Change!"
																type="danger"
																onClick={() => { this.editWrite(); this.updateProjectWriteKey(); }}
															/>

														</td>
													)
													: (<td><Button label="Edit" type="info" onClick={this.editWrite} /></td>)
												}
											</tr>
											<tr>
												<th className="has-text-centered has-text-danger">Master key</th>
												{editMaster
													? (
														<input
															className="input"
															type="text"
															value={masterKey}
															onChange={this.updateMaster}
															ref={inpt => inpt && inpt.focus()}
														/>
													)
													: (<td className="has-text-centered has-text-grey">{masterKey}</td>)}
												{editMaster
													? (
														<td>
															<Button
																label="Change!"
																type="danger"
																onClick={() => { this.editMaster(); this.updateProjectMasterKey(); }}
															/>

														</td>
													)
													: (<td><Button label="Edit" type="info" onClick={this.editMaster} /></td>)
												}
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
	}
}
