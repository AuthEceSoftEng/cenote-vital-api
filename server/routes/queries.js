const express = require('express');
const cassandra = require('cassandra-driver');

const { Project } = require('../models');
const { requireAuth, canAccessForCollection } = require('./middleware');
const { isJSON, applyFilter, parseTimeframe, groupBy, getFilterQuery, groupByInterval, median, percentile: percentle } = require('../utils');

const router = express.Router({ mergeParams: true });
const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_URL], keyspace: 'cenote', localDataCenter: 'datacenter1' });
client.connect(console.error);

/**
* @api {get} /projects/:PROJECT_ID/queries/count Count
* @apiVersion 0.1.0
* @apiName QueryCount
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "count": 153
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
*/
router.get('/count', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, group_by, latest, interval } = req.query;
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : 'COUNT(*)'} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
      if (interval) results = groupByInterval(answer, interval, 'count');
      if (group_by) results = groupBy(answer, group_by, 'count');
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
 * @apiDefine TargetNotProvidedError
 * @apiError TargetNotProvidedError The `target_property` parameter must be provided.
 * @apiErrorExample {json} TargetNotProvidedError:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "TargetNotProvidedError"
 *     }
 */
/**
* @api {get} /projects/:PROJECT_ID/queries/minimum Minimum
* @apiVersion 0.1.0
* @apiName QueryMin
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 0.0001
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/minimum', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : `MIN(${target_property})`} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
      if (interval) results = groupByInterval(answer, interval, 'minimum', target_property);
      if (group_by) results = groupBy(answer, group_by, 'minimum', target_property);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/maximum Maximum
* @apiVersion 0.1.0
* @apiName QueryMax
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 9.999
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/maximum', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : `MAX(${target_property})`} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
      if (interval) results = groupByInterval(answer, interval, 'maximum', target_property);
      if (group_by) results = groupBy(answer, group_by, 'maximum', target_property);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/sum Sum
* @apiVersion 0.1.0
* @apiName QuerySum
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 337231
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/sum', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : `SUM(${target_property})`} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
      if (interval) results = groupByInterval(answer, interval, 'sum', target_property);
      if (group_by) results = groupBy(answer, group_by, 'sum', target_property);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/average Average
* @apiVersion 0.1.0
* @apiName QueryAvg
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage":  1.92
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/average', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : `AVG(${target_property})`} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = JSON.parse(JSON.stringify(answer).replace(/system\.\w*\(|\)/g, ''));
      if (interval) results = groupByInterval(answer, interval, 'average', target_property);
      if (group_by) results = groupBy(answer, group_by, 'average', target_property);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/median Median
* @apiVersion 0.1.0
* @apiName QueryMedian
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage":  1.1
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/median', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  let answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      filters.forEach(filter => answer = applyFilter(filter, answer));
      let results = [];
      results.push({ [target_property]: median(answer.map(el => el[target_property])) });
      if (interval) results = groupByInterval(answer, interval, 'median', target_property);
      if (group_by) results = groupBy(answer, group_by, 'median', target_property);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/percentile Percentile
* @apiVersion 0.1.0
* @apiName QueryPercentile
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Number{0-100}} percentile Desired percentile.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 0.945
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
* @apiUse TargetNotProvidedError
*/
router.get('/percentile', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError' });
  const { readKey, masterKey, event_collection, target_property, percentile, group_by, latest, interval } = req.query;
  if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!percentile) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  let answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      filters.forEach(filter => answer = applyFilter(filter, answer));
      let results = [];
      results.push({ [target_property]: percentle(answer.map(el => el[target_property]), percentile) });
      if (interval) results = groupByInterval(answer, interval, 'percentile', target_property, percentile);
      if (group_by) results = groupBy(answer, group_by, 'percentile', target_property, percentile);
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
}));

/**
* @api {get} /projects/:PROJECT_ID/queries/count_unique Count Unique
* @apiVersion 0.1.0
* @apiName QueryCountUnique
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 9
*            }
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
*/
router.get('/count_unique', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec(
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError', err: err2 });
    const { readKey, masterKey, event_collection, target_property, latest, group_by, interval } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
    }
    if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframeQuery = parseTimeframe(req.query.timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = [];
        results.push({ [target_property]: [...new Set(answer.map(el => el[target_property]))].length });
        if (interval) results = groupByInterval(answer, interval, 'count_unique', target_property);
        if (group_by) results = groupBy(answer, group_by, 'count_unique', target_property);
        res.json({ ok: true, results });
      })
      .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
  }));

/**
* @api {get} /projects/:PROJECT_ID/queries/select_unique Select Unique
* @apiVersion 0.1.0
* @apiName QuerySelectUnique
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} target_property Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            1.1,
*            4.546,
*            8.637,
*            ...
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
*/
router.get('/select_unique', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec(
  (err2, project) => {
    if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError', err: err2 });
    const { readKey, masterKey, event_collection, target_property, latest, group_by, interval } = req.query;
    if (!(readKey === project.readKey || masterKey === project.masterKey)) {
      return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
    }
    if (!target_property) return res.status(400).json({ ok: false, results: 'TargetNotProvidedError' });
    const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
    const timeframeQuery = parseTimeframe(req.query.timeframe);
    const filterQuery = getFilterQuery(filters);
    const query = `SELECT ${group_by || interval ? '*' : target_property} FROM cenote.${
      req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
    let answer = [];
    return client.stream(query)
      .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
      .on('end', () => {
        filters.forEach(filter => answer = applyFilter(filter, answer));
        let results = [...new Set(answer.map(el => el[target_property]))];
        if (interval) results = groupByInterval(answer, interval, 'select_unique', target_property);
        if (group_by) results = groupBy(answer, group_by, 'select_unique', target_property);
        res.json({ ok: true, results });
      })
      .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
  }));

/**
* @api {get} /projects/:PROJECT_ID/queries/extraction Data Extraction
* @apiVersion 0.1.0
* @apiName QueryExtraction
* @apiGroup Queries
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} readkey/masterKey Key for authorized read.
* @apiParam {String} event_collection Event collection.
* @apiParam {String} [target_property] Desired Event collection's property.
* @apiParam {Object[]} [filters] Apply custom filters.
* @apiParam {String} [group_by] Group by a property.
* @apiParam {Number} [latest=5000] Limit events taken into account.
* @apiParam {String=minutely,hourly,daily,weekly,monthly,yearly} [interval] Group by a time interval.
* @apiParam {Object/String="{'start':ISOString, 'end':ISOString}", "[this|previous]_[n]_[seconds|minutes|days|...]"} [timeframe] Specify a timeframe.
* @apiSuccess {Boolean} ok If the query succeded.
* @apiSuccess {Array} results Query result.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 SUCCESS
*     {
*       "ok": true
*       "results": [
*            {
*               "voltage": 153,
*               "current": 3,
*               "Note": "A note",
*            },
*            {
*               "voltage": 123,
*               "current": 9,
*               "Note": "A note",
*            },
*            ...
*       ]
*     }
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse ProjectNotFoundError
*/
router.get('/extraction', canAccessForCollection, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }).lean().exec((err2, project) => {
  if (err2 || !project) return res.status(404).json({ ok: false, results: 'ProjectNotFoundError', err: err2 });
  const { readKey, masterKey, event_collection, target_property, latest } = req.query;
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ ok: false, results: 'KeyNotAuthorizedError' });
  const filters = isJSON(req.query.filters) ? JSON.parse(req.query.filters) : [];
  const timeframeQuery = parseTimeframe(req.query.timeframe);
  const filterQuery = getFilterQuery(filters);
  const query = `SELECT ${target_property || '*'} FROM cenote.${
    req.params.PROJECT_ID}_${event_collection} ${timeframeQuery} ${filterQuery} LIMIT ${latest || req.app.locals.GLOBAL_LIMIT} ALLOW FILTERING`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() { let row = this.read(); while (row) { answer.push(row); row = this.read(); } })
    .on('end', () => {
      let results = answer;
      filters.forEach(filter => results = applyFilter(filter, results));
      res.json({ ok: true, results });
    })
    .on('error', err3 => res.status(400).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
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
    .on('error', err3 => res.status(404).json({ ok: false, results: 'Can\'t execute query!', err: err3.message }));
});

router.all('/*', (req, res) => res.status(400).json({ ok: false, results: 'This is not a valid query!' }));

module.exports = router;
