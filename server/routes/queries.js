const express = require('express');
const cassandra = require('cassandra-driver');

const { Project } = require('../models');
const { requireAuth, hasReadAccessForCollection } = require('./middleware');
const { isJSON, applyFilter, parseTimeframe, groupBy, getFilterQuery, groupByInterval } = require('../utils');

const router = express.Router({ mergeParams: true });
const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_URL], keyspace: 'cenote', localDataCenter: 'datacenter1' });
client.connect(console.error);

router.get('/count', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, group_by, latest, interval } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : 'COUNT(*)'} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
        if (interval) results = groupByInterval(answer, interval, 'count');
        if (group_by) results = groupBy(answer, group_by, 'count');
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));


router.get('/minimum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : `MIN(${target_property})`} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
           || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
        if (interval) results = groupByInterval(answer, interval, 'minimum', target_property);
        if (group_by) results = groupBy(answer, group_by, 'minimum', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/maximum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : `MAX(${target_property})`} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
        || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
        if (interval) results = groupByInterval(answer, interval, 'maximum', target_property);
        if (group_by) results = groupBy(answer, group_by, 'maximum', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/sum', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : `SUM(${target_property})`} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
        || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
        if (interval) results = groupByInterval(answer, interval, 'sum', target_property);
        if (group_by) results = groupBy(answer, group_by, 'sum', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/average', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : `AVG(${target_property})`} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
        || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
        if (interval) results = groupByInterval(answer, interval, 'average', target_property);
        if (group_by) results = groupBy(answer, group_by, 'average', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/median', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
        || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        const median = (values) => {
          values.sort((a, b) => a - b);
          if (values.length === 0) return 0;
          const half = Math.floor(values.length / 2);
          if (values.length % 2) return values[half];
          return (values[half - 1] + values[half]) / 2.0;
        };
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = [];
        results.push({ [target_property]: median(answer.map(el => el[target_property])) });
        if (interval) results = groupByInterval(answer, interval, 'median', target_property);
        if (group_by) results = groupBy(answer, group_by, 'median', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/percentile', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!` });
    const { readKey, masterKey, event_collection, target_property, percentile, group_by, latest, interval } = req.query;
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    if (!percentile) return res.status(400).json({ ok: false, msg: 'No `percentile` param provided!' });
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe
      ? ` AND cenote_timestamp >= ${timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest
        || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        function percentle(arr, p) {
          if (arr.length === 0) return 0;
          arr.sort((a, b) => a - b);
          if (p <= 0) return arr[0];
          if (p >= 100) return arr[arr.length - 1];
          return arr[Math.ceil(arr.length * (p / 100)) - 1];
        }
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = [];
        results.push({ [target_property]: percentle(answer.map(el => el[target_property]), percentile) });
        if (interval) results = groupByInterval(answer, interval, 'percentile', target_property, percentile);
        if (group_by) results = groupBy(answer, group_by, 'percentile', target_property, percentile);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/extraction', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    const { readKey, masterKey, event_collection, target_property, latest } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${target_property || '*'} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${latest ? `LIMIT ${latest}` : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} ALLOW FILTERING`;
    const answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        let results = answer;
        filters.forEach(filter => results = applyFilter(filter, results));
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/count_unique', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    const { readKey, masterKey, event_collection, target_property, latest, group_by, interval } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = [];
        results.push({ [target_property]: [...new Set(answer.map(el => el[target_property]))].length });
        if (interval) results = groupByInterval(answer, interval, 'count_unique', target_property);
        if (group_by) results = groupBy(answer, group_by, 'count_unique', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/select_unique', hasReadAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true },
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, msg: `Can't find project with id ${req.params.PROJECT_ID}!`, err: err2 });
    const { readKey, masterKey, event_collection, target_property, latest, group_by, interval } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, msg: 'Key hasn\'t authorization' });
    }
    if (!target_property) return res.status(400).json({ ok: false, msg: 'No `target_property` param provided!' });
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframe = isJSON(req.query.timeframe) ? JSON.parse(req.query.timeframe) : null;
    const relativeTimeframe = parseTimeframe(req.query.relative_timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${
      filterQuery !== 'WHERE ' || relativeTimeframe ? filterQuery : ''} ${timeframe ? ` AND cenote_timestamp >= ${
      timeframe.start} AND cenote_timestamp <= ${timeframe.end}` : relativeTimeframe} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        const alreadyIncluded = [];
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = answer.filter((el) => {
          if (alreadyIncluded.includes(el[target_property])) return false;
          alreadyIncluded.push(el[target_property]);
          return true;
        });
        if (interval) results = groupByInterval(answer, interval, 'select_unique', target_property);
        if (group_by) results = groupBy(answer, group_by, 'select_unique', target_property);
        res.json({ ok: true, msg: results });
      })
      .on('error', err3 => res.status(404).json({ ok: false, msg: 'Can\'t execute query!', err: err3.message }));
  }));

router.get('/collections', requireAuth, (req, res) => {
  const query = 'SELECT table_name,column_name,type FROM system_schema.columns WHERE keyspace_name = \'cenote\'';
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
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
