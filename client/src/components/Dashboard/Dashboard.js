/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { EventCollection, MostRecentEvent } from './dashboardComponents';
import { getEventCollections, getRecentEvents } from './widgets';
import { Button } from '..';


export default class Dashboard extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    readKeys: PropTypes.array.isRequired,
    writeKeys: PropTypes.array.isRequired,
    masterKeys: PropTypes.array.isRequired,
    updateProjectReadKey: PropTypes.func.isRequired,
    updateProjectWriteKey: PropTypes.func.isRequired,
    updateProjectMasterKey: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      readKeys: props.readKeys,
      writeKeys: props.writeKeys,
      title: props.title,
      masterKeys: props.masterKeys,
      editRead: new Array(props.readKeys.length).fill(false),
      editWrite: new Array(props.writeKeys.length).fill(false),
      editMaster: new Array(props.readKeys.length).fill(false),
      collections: {},
      events: {},
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const { projectId } = this.props;
    const { readKeys } = this.state;
    getEventCollections(projectId).then((collections) => {
      if (this._isMounted) this.setState({ collections });

      const events = {};
      const promises = [];
      Object.keys(collections).forEach((col) => {
        promises.push(getRecentEvents(projectId, col, readKeys[0], collections[col]).then(evts => events[col] = evts));
      });
      Promise.all(promises).then(() => this._isMounted && this.setState({ events }));
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateProjectReadKey = () => {
    const { readKeys } = this.state;
    const { updateProjectReadKey, projectId } = this.props;
    updateProjectReadKey({ projectId, readKeys }).then(() => this.setState({ editRead: new Array(readKeys.length).fill(false) }));
  }

  updateProjectWriteKey = () => {
    const { writeKeys } = this.state;
    const { updateProjectWriteKey, projectId } = this.props;
    updateProjectWriteKey({ projectId, writeKeys }).then(() => this.setState({ editWrite: new Array(writeKeys.length).fill(false) }));
  }

  updateProjectMasterKey = () => {
    const { masterKeys } = this.state;
    const { updateProjectMasterKey, projectId } = this.props;
    updateProjectMasterKey({ projectId, masterKeys }).then(() => this.setState({ editWrite: new Array(masterKeys.length).fill(false) }));
  }

  updateRead = (value, ind) => this.setState((prevState) => {
    prevState.readKeys[ind] = value;
    return ({ readKey: prevState.readKeys });
  })

  updateWrite = (value, ind) => this.setState((prevState) => {
    prevState.writeKeys[ind] = value;
    return ({ writeKeys: prevState.writeKeys });
  })

  updateMaster = (value, ind) => this.setState((prevState) => {
    prevState.masterKeys[ind] = value;
    return ({ masterKeys: prevState.masterKeys });
  })

  editRead = (i) => {
    let { editRead, editWrite, editMaster } = this.state;
    if (editRead[i]) {
      editRead[i] = false;
      this.setState({ editRead });
    } else {
      editRead = new Array(editRead.length).fill(false);
      editWrite = new Array(editWrite.length).fill(false);
      editMaster = new Array(editMaster.length).fill(false);
      editRead[i] = true;

      this.setState({ editRead, editWrite, editMaster });
    }
  }

  editWrite = (i) => {
    let { editRead, editWrite, editMaster } = this.state;
    if (editWrite[i]) {
      editWrite[i] = false;
      this.setState({ editWrite });
    } else {
      editRead = new Array(editRead.length).fill(false);
      editWrite = new Array(editWrite.length).fill(false);
      editMaster = new Array(editMaster.length).fill(false);
      editWrite[i] = true;

      this.setState({ editRead, editWrite, editMaster });
    }
  }

  editMaster = (i) => {
    let { editRead, editWrite, editMaster } = this.state;
    if (editMaster[i]) {
      editMaster[i] = false;
      this.setState({ editMaster });
    } else {
      editRead = new Array(editRead.length).fill(false);
      editWrite = new Array(editWrite.length).fill(false);
      editMaster = new Array(editMaster.length).fill(false);
      editMaster[i] = true;

      this.setState({ editRead, editWrite, editMaster });
    }
  }

  _getEventCollectionInfo() {
    const { collections } = this.state;
    const tabList = [];
    const tabPanel = [];
    Object.keys(collections).forEach((col, ind) => {
      tabList.push(<Tab key={`tab_col_${ind}`}>{col}</Tab>);
      tabPanel.push(<TabPanel key={`tabpanel_col_${ind}`}><EventCollection properties={collections[col]} /></TabPanel>);
    });
    if (tabList.length === 0) {
      return (
        <div>
          <p>
            {'None yet. Send some events!'}
          </p>
        </div>
      );
    }
    return (
      <Tabs forceRenderTabPanel>
        <TabList>
          {tabList}
        </TabList>
        {tabPanel}
      </Tabs>
    );
  }

  _getLastFiveEvents() {
    const { collections, events } = this.state;
    const tabList = [];
    const tabPanel = [];
    Object.keys(collections).forEach((col, ind) => {
      tabList.push(<Tab key={`tab_col_${ind}`}>{col}</Tab>);
      tabPanel.push(<TabPanel key={`tabpanel_col_${ind}`}><MostRecentEvent properties={collections[col]} events={events[col] || []} /></TabPanel>);
    });
    if (tabList.length === 0) {
      return (
        <div>
          <p>
            {'None yet. Send some events!'}
          </p>
        </div>
      );
    }
    return (
      <Tabs forceRenderTabPanel>
        <TabList>
          {tabList}
        </TabList>
        {tabPanel}
      </Tabs>
    );
  }

  render() {
    const { readKeys, title, writeKeys, masterKeys, editRead, editWrite, editMaster } = this.state;
    const { projectId } = this.props;
    return (
      <div>
        <h1 className="title is-1">{title}</h1>
        <Tabs forceRenderTabPanel defaultIndex={0} defaultFocus>
          <TabList>
            <Tab>Event Collections</Tab>
            <Tab>Project Information</Tab>
          </TabList>
          <TabPanel>
            {this._getEventCollectionInfo()}
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
                        <th className="has-text-centered has-text-danger">{title}</th>
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
                      {
                        readKeys.map((key, ind) => (
                          <tr key={`rowread${ind}`}>
                            <th className="has-text-centered has-text-primary">Read key</th>
                            {editRead[ind]
                              ? (
                                <td className="has-text-centered has-text-grey">
                                  <input
                                    className="input"
                                    type="text"
                                    value={key}
                                    onChange={({ target }) => this.updateRead(target.value, ind)}
                                    ref={inpt => inpt && inpt.focus()}
                                  />
                                </td>
                              )
                              : (<td className="has-text-centered has-text-grey">{key}</td>)}
                            {editRead[ind]
                              ? (
                                <td>
                                  <Button
                                    label="Change!"
                                    type="danger"
                                    onClick={() => { this.editRead(ind); this.updateProjectReadKey(ind); }}
                                  />

                                </td>
                              )
                              : (<td><Button label="Edit" type="info" onClick={() => this.editRead(ind)} /></td>)
                            }
                          </tr>
                        ))
                      }
                      {
                        writeKeys.map((key, ind) => (
                          <tr key={`rowwrite${ind}`}>
                            <th className="has-text-centered has-text-link">Write key</th>
                            {editWrite[ind]
                              ? (
                                <td className="has-text-centered has-text-grey">
                                  <input
                                    className="input"
                                    type="text"
                                    value={key}
                                    onChange={({ target }) => this.updateWrite(target.value, ind)}
                                    ref={inpt => inpt && inpt.focus()}
                                  />
                                </td>
                              )
                              : (<td className="has-text-centered has-text-grey">{key}</td>)}
                            {editWrite[ind]
                              ? (
                                <td>
                                  <Button
                                    label="Change!"
                                    type="danger"
                                    onClick={() => { this.editWrite(ind); this.updateProjectWriteKey(); }}
                                  />

                                </td>
                              )
                              : (<td><Button label="Edit" type="info" onClick={() => this.editWrite(ind)} /></td>)
                            }
                          </tr>
                        ))
                      }
                      {
                        masterKeys.map((key, ind) => (
                          <tr key={`rowmaster${ind}`}>
                            <th className="has-text-centered has-text-danger">Master key</th>
                            {editMaster[ind]
                              ? (
                                <td className="has-text-centered has-text-grey">
                                  <input
                                    className="input"
                                    type="text"
                                    value={key}
                                    onChange={({ target }) => this.updateMaster(target.value, ind)}
                                    ref={inpt => inpt && inpt.focus()}
                                  />
                                </td>
                              )
                              : (<td className="has-text-centered has-text-grey">{key}</td>)}
                            {editMaster[ind]
                              ? (
                                <td>
                                  <Button
                                    label="Change!"
                                    type="danger"
                                    onClick={() => { this.editMaster(ind); this.updateProjectMasterKey(ind); }}
                                  />

                                </td>
                              )
                              : (<td><Button label="Edit" type="info" onClick={() => this.editMaster(ind)} /></td>)
                            }
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </TabPanel>
            </Tabs>
          </TabPanel>
        </Tabs>
        <h4 style={{ marginTop: '1%' }} className="title is-4">last 5 events...</h4>
        <Tabs forceRenderTabPanel defaultIndex={0} defaultFocus>
          {this._getLastFiveEvents()}
        </Tabs>
      </div>
    );
  }
}
