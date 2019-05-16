/* eslint-disable no-bitwise */
/* eslint-disable jsx-a11y/label-has-associated-control, no-bitwise */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ReactTable from 'react-table';
import { ClipLoader } from 'react-spinners';
import * as moment from 'moment';

import { getRecentEvents } from '../utils';

export default class Analytics extends React.Component {
  static propTypes = { collections: PropTypes.object, readKey: PropTypes.string.isRequired, projectId: PropTypes.string.isRequired }

  static defaultProps = { collections: {} }

  constructor(props) {
    super(props);
    this.state = {
      collections: props.collections,
      loading: false,
      columns: [],
      selectedCollection: { value: '---', label: '---' },
      selectedColumn: { value: '*', label: '*' },
      selectedInterval: { value: 'this_year', label: 'this year' },
      tableData: {
        events: null,
        properties: null,
      },
    };
    this.input = React.createRef();
    this.getEvents = this.getEvents.bind(this);
    this.handleCollectionChange = this.handleCollectionChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ collections: nextProps.collections });
  }

  getEvents() {
    const {
      selectedCollection: { value: collection },
      selectedColumn: { value: column },
      selectedInterval: { value: interval },
      collections,
    } = this.state;
    const { projectId, readKey } = this.props;
    if (collection === '---') return;
    this.setState({ loading: true });
    getRecentEvents(projectId, collection, readKey, parseInt(this.input.current.value || 1e3, 10)).then((tableData) => {
      tableData.events = tableData.filter((el) => {
        let filterClause = moment(el.cenote$timestamp).year() === moment().year();
        if (interval === 'this_year') return filterClause;
        filterClause &= moment(el.cenote$timestamp).month() === moment().month();
        if (interval === 'this_month') return filterClause;
        filterClause &= moment(el.cenote$timestamp).isoWeek() === moment().isoWeek();
        if (interval === 'this_week') return filterClause;
        filterClause &= moment(el.cenote$timestamp).dayOfYear() === moment().dayOfYear();
        return filterClause;
      });
      tableData.properties = collections[collection];
      if (column !== '*') {
        tableData.events = tableData.events.map(el => Object.keys(el)
          .filter(key => key === column)
          .reduce((obj, key) => {
            obj[key] = el[key];
            return obj;
          }, {}));
        tableData.properties = tableData.properties.filter(el => el.column_name === column);
      }
      this.setState({ tableData, loading: false });
    });
  }

  handleCollectionChange = (selectedCollection) => {
    const { collections } = this.state;
    const columns = collections[selectedCollection.value].map(el => el.column_name);
    this.setState({
      columns,
      selectedCollection,
      selectedColumn: { value: '*', label: '*' },
      tableData: { events: [], properties: [] },
    }, this.getEvents);
  }

  handleColumnChange = (selectedColumn) => {
    this.setState({ selectedColumn }, this.getEvents);
  }

  handleIntervalChange = (selectedInterval) => {
    this.setState({ selectedInterval }, this.getEvents);
  }

  render() {
    const { collections, selectedCollection, selectedColumn, columns, tableData, loading, selectedInterval } = this.state;
    const collectionNames = Object.keys(collections);
    return (
      <div>
        <div className="field is-horizontal" style={{ justifyContent: 'center', alignItems: 'inherit' }}>
          <div className="field is-horizontal" style={{ flex: 1 }}>
            <div className="field-label is-normal">
              <label className="label">From collection:</label>
            </div>
            <div className="field-body">
              <div style={{ width: '100%', height: '80%' }}>
                <Select
                  value={selectedCollection}
                  onChange={this.handleCollectionChange}
                  options={collectionNames.map(el => ({ value: el, label: el }))}
                  placeholder="---"
                />
              </div>
            </div>
          </div>
          <div className="field is-horizontal" style={{ flex: 1 }}>
            <div className="field-label is-normal">
              <label className="label">fetch column:</label>
            </div>
            <div className="field-body">
              <div style={{ width: '100%', height: '80%' }}>
                <Select
                  value={selectedColumn}
                  onChange={this.handleColumnChange}
                  options={[{ value: '*', label: '*' }].concat(columns.map(el => ({ value: el, label: el })))}
                  placeholder="*"
                  defaultValue="*"
                />
              </div>
            </div>
          </div>
          <div className="field is-horizontal" style={{ flex: 1 }}>
            <div className="field-label is-normal">
              <label className="label">get latest:</label>
            </div>
            <div className="field-body">
              <input className="input is-small" type="text" placeholder="1000" style={{ height: '100%' }} ref={this.input} />
            </div>
          </div>
          <div className="field is-horizontal" style={{ flex: 1 }}>
            <div className="field-label is-normal">
              <label className="label">only from:</label>
            </div>
            <div className="field-body is-normal">
              <div style={{ width: '100%', height: '80%' }}>
                <Select
                  value={selectedInterval}
                  onChange={this.handleIntervalChange}
                  options={[
                    { value: 'this_year', label: 'this year' },
                    { value: 'this_month', label: 'this month' },
                    { value: 'this_week', label: 'this week' },
                    { value: 'this_day', label: 'this day' },
                  ]}
                  placeholder="this_year"
                  defaultValue="this_year"
                />
              </div>
            </div>
          </div>
          <div className="control" style={{ marginLeft: '1rem' }}>
            <button type="submit" className="button is-info" onClick={this.getEvents}>Refresh!</button>
          </div>
        </div>
        {tableData.events && !loading ? (
          <ReactTable
            showPageSizeOptions={false}
            filterable
            defaultPageSize={15}
            data={tableData.events}
            columns={tableData.properties.map(el => ({
              Header: el.column_name,
              accessor: el.column_name,
              minWidth: 200,
              Cell: props => (
                <span className={`has-text-centered ${
                  el.column_name.startsWith('cenote') || el.column_name.startsWith('uuid') ? 'has-text-danger' : 'has-text-info'}`}
                >
                  {props.value}
                </span>
              ),
            }))}
            className="-striped -highlight"
          />
        ) : loading ? <ClipLoader color="#008B8B" /> : null}

      </div>
    );
  }
}
