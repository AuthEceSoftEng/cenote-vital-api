const express = require('express');
const cassandra = require('cassandra-driver');

const { Project } = require('../models');
const { requireAuth, hasReadAccessForCollection } = require('./middleware');
const { isJSON, applyFilter, parseTimeframe } = require('../utils');

const router = express.Router({ mergeParams: true });
const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_URL], keyspace: 'cenote', localDataCenter: 'datacenter1' });
client.connect(console.error);

router.get('/count', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property ? target_property.split(',').map(el => `COUNT(${el}) `)
      : 'COUNT(*)'}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe
      ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}`
      : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => res.json({ ok: true, msg: JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, '')) }))
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));


router.get('/minimum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property.split(',').map(el => `MIN(${el}) `)}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => res.json({ ok: true, msg: JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, '')) }))
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/maximum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property.split(',').map(el => `MAX(${el}) `)}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => res.json({ ok: true, msg: JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, '')) }))
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/sum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property.split(',').map(el => `SUM(${el}) `)}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => res.json({ ok: true, msg: JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, '')) }))
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/average', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property.split(',').map(el => `AVG(${el}) `)}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => res.json({ ok: true, msg: JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, '')) }))
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/median', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => {
        const median = (values) => {
          values.sort((a, b) => a - b);
          if (values.length === 0) return 0;
          const half = Math.floor(values.length / 2);
          if (values.length % 2) return values[half];
          return (values[half - 1] + values[half]) / 2.0;
        };
        filters.forEach(filter => answer = applyFilter(filter, answer));
        const results = [];
        target_property.split(',').forEach(col => results.push({ [col]: median(answer.map(el => el[col])) }));
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/percentile', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    }
    const { readKey, masterKey, event_collection, target_property, percentile } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!percentile) return res.status(400).json({ ok: false, msg: 'No `percentile` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => {
        function percentle(arr, p) {
          if (arr.length === 0) return 0;
          arr.sort((a, b) => a - b);
          if (p <= 0) return arr[0];
          if (p >= 100) return arr[arr.length - 1];
          return arr[Math.ceil(arr.length * (p / 100)) - 1];
        }
        filters.forEach(filter => answer = applyFilter(filter, answer));
        const results = [];
        target_property.split(',').forEach(col => results.push({ [col]: percentle(answer.map(el => el[col]), percentile) }));
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/extraction', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    }
    const { readKey, masterKey, event_collection, target_property, latest } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property || '*'} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${latest ? `LIMIT ${latest}` : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => {
        let results = answer;
        filters.forEach(filter => results = applyFilter(filter, results));
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/count_unique', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    }
    const { readKey, masterKey, event_collection, target_property, latest } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property ? target_property.split(',').map(el => `COUNT(${el}) `)
      : 'COUNT(*)'}FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe
      ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}`
      : relativeTimeframe} ${latest ? `LIMIT ${latest}` : ''} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => {
        const results = {};
        if (target_property) {
          target_property.split(',').forEach(col => results[col] = [...new Set(answer.map(el => el[col]))].length);
        } else {
          Object.keys(answer[0]).forEach(col => results[col] = [...new Set(answer.map(el => el[col]))].length);
        }
        res.json({ ok: true, msg: [results] });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/select_unique', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    }
    const { readKey, masterKey, event_collection, target_property, latest } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    let filterQuery = 'WHERE ';
    filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
      if (filter.operator === 'eq') {
        filterQuery += `${filter.property_name} = ${filter.property_value}`;
      } else if (filter.operator === 'lt') {
        filterQuery += `${filter.property_name} < ${filter.property_value}`;
      } else if (filter.operator === 'lte') {
        filterQuery += `${filter.property_name} <= ${filter.property_value}`;
      } else if (filter.operator === 'gt') {
        filterQuery += `${filter.property_name} > ${filter.property_value}`;
      } else if (filter.operator === 'gte') {
        filterQuery += `${filter.property_name} >= ${filter.property_value}`;
      }
      if (ind !== arr.length - 1) filterQuery += ' AND ';
    });
    const query = `SELECT ${target_property || '*'} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${latest ? `LIMIT ${latest}` : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() {
        let row = this.read();
        while (row) {
          answer.push(row);
          row = this.read();
        }
      })
      .on('end', () => {
        const alreadyIncluded = [];
        filters.forEach(filter => answer = applyFilter(filter, answer));
        const results = answer.filter((el) => {
          if (alreadyIncluded.includes(el[target_property])) return false;
          alreadyIncluded.push(el[target_property]);
          return true;
        });
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/collections', requireAuth, (req, res) => {
  const query = 'SELECT table_name,column_name,type FROM system_schema.columns WHERE keyspace_name = \'cenote\'';
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() {
      let row = this.read();
      while (row) {
        answer.push(row);
        row = this.read();
      }
    })
    .on('end', () => {
      const results = {};
      answer.filter(el => el.table_name.startsWith(req.params.PROJECT_ID)).forEach((prop) => {
        const collection = prop.table_name.split('_')[1];
        if (!results[collection]) results[collection] = [];
        results[collection].push({ column_name: prop.column_name, type: prop.type });
      });
      res.json(results);
    })
    .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
});

router.all('/*', (req, res) => res.status(404).json({ ok: false, msg: 'This is not a valid query!' }));

module.exports = router;
